import {
  Chip,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import LocalDiningIcon from '@material-ui/icons/LocalDining'
import RemoveIcon from '@material-ui/icons/Remove'
import { useEffect, useState } from 'react'

import StyledCard from '@/Components/Shared/StyledCard'
import { Recipe } from '@/model/model'
import {
  IngredientMatch,
  nutritionService,
  NutritionSummary,
} from '@/services/nutritionService'

const useStyles = makeStyles((theme: Theme) => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  macroItem: {
    textAlign: 'center',
  },
  macroValue: {
    fontWeight: 'bold',
  },
  macroLabel: {
    color: theme.palette.text.secondary,
  },
  divider: {
    margin: theme.spacing(1.5, 0),
  },
  matchHeader: {
    display: 'block',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
    overflow: 'hidden',
  },
  icon: {
    fontSize: '1rem',
    flexShrink: 0,
  },
  iconMatched: {
    color: '#4caf50',
  },
  iconUnmatched: {
    color: theme.palette.text.secondary,
  },
  iconSkipped: {
    color: theme.palette.text.disabled,
  },
  matchName: {
    flexShrink: 0,
  },
  matchEntry: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  matchEntryNotFound: {
    color: theme.palette.text.disabled,
  },
}))

interface ParsedIngredient {
  amountG: number
  name: string
}

interface ParseResult {
  parsed: ParsedIngredient[]
  skipped: string[]
}

// cSpell:disable
const UNIT_MULTIPLIERS: Record<string, number> = {
  g: 1,
  gr: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  liter: 1000,
  el: 15,
  tl: 5,
  prise: 1,
  msp: 0.5,
  tasse: 240, // 1 Tasse ≈ 240 ml/g
  dose: 400, // 1 Dose (Standarddose) ≈ 400 g
  zweig: 2, // 1 Zweig Kräuter ≈ 2 g
  zweige: 2,
  bund: 100, // 1 Bund ≈ 100 g
  scheibe: 30, // 1 Scheibe ≈ 30 g
  scheiben: 30,
  zehe: 5, // 1 Zehe Knoblauch ≈ 5 g
  zehen: 5,
}

// Adjectives that can appear between a number and a unit (e.g. "1 gute Prise Salz")
const QUANTITY_ADJECTIVES = new Set([
  'gute',
  'guter',
  'gutes',
  'guten',
  'gehäufte',
  'gehäufter',
  'gehäuftes',
  'gehäuften',
  'gestrichene',
  'gestrichener',
  'gestrichenes',
  'gestrichenen',
  'knappe',
  'knapper',
  'knappes',
  'knappen',
  'halbe',
  'halber',
  'halbes',
  'halben',
])

// Approximate per-item gram weight for common count-based ingredients (no unit)
const PLAIN_COUNT_WEIGHTS: Record<string, number> = {
  apfel: 150,
  äpfel: 150,
  banane: 120,
  bananen: 120,
  zitrone: 100,
  zitronen: 100,
  orange: 180,
  orangen: 180,
  tomate: 100,
  tomaten: 100,
  kartoffel: 150,
  kartoffeln: 150,
  zwiebel: 80,
  zwiebeln: 80,
  karotte: 80,
  karotten: 80,
  möhre: 80,
  möhren: 80,
  zucchini: 250,
  gurke: 300,
  avocado: 200,
  avocados: 200,
}
// cSpell:enable

const NUM = String.raw`(\d+(?:[,.]\d+)?)`
const RANGE_SEP = String.raw`\s*[-–]\s*`

const parseNum = (s: string) => Number.parseFloat(s.replace(',', '.'))
const stripParens = (s: string) => s.replace(/\s*\(.*\)\s*$/, '').trim()

const normalizeLine = (rawLine: string): string => {
  const line = rawLine
    .replace(/^(\s*[-*•]|\d+\.\s*)/, '')
    .trim()
    .replace(/^(ca\.?|etwa|ungefähr)\s+/i, '')
    .trim()
  // Strip optional quantity adjective between number and unit ("1 gute Prise" → "1 Prise")
  const qAdj = new RegExp(String.raw`^${NUM}\s+(\p{L}+)\s+`, 'u').exec(line)
  return qAdj && QUANTITY_ADJECTIVES.has(qAdj[2].toLowerCase())
    ? line.replace(new RegExp(String.raw`^${NUM}\s+\p{L}+\s+`, 'u'), '$1 ')
    : line
}

const matchEgg = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s+Ei(?:er)?\b`, 'i').exec(line)
  return m ? { amountG: parseNum(m[1]) * 50, name: 'Hühnerei' } : null
}

const matchUnitRange = (line: string): ParsedIngredient | null => {
  const m = new RegExp(
    String.raw`^${NUM}${RANGE_SEP}${NUM}\s*(\p{L}+)\.?\s+(.+)$`,
    'u'
  ).exec(line)
  if (!m) return null
  const multiplier = UNIT_MULTIPLIERS[m[3].toLowerCase()]
  if (multiplier === undefined) return null
  return {
    amountG: ((parseNum(m[1]) + parseNum(m[2])) / 2) * multiplier,
    name: stripParens(m[4]),
  }
}

const matchCountRange = (line: string): ParsedIngredient | null => {
  const m = new RegExp(
    String.raw`^${NUM}${RANGE_SEP}${NUM}\s+(\p{L}+(?:\s+.*)?)$`,
    'u'
  ).exec(line)
  if (!m) return null
  const weight = PLAIN_COUNT_WEIGHTS[m[3].toLowerCase().split(/\s+/)[0]]
  if (weight === undefined) return null
  return {
    amountG: ((parseNum(m[1]) + parseNum(m[2])) / 2) * weight,
    name: stripParens(m[3]),
  }
}

const matchUnit = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s*(\p{L}+)\.?\s+(.+)$`, 'u').exec(
    line
  )
  if (!m) return null
  const multiplier = UNIT_MULTIPLIERS[m[2].toLowerCase()]
  if (multiplier === undefined) return null
  return { amountG: parseNum(m[1]) * multiplier, name: stripParens(m[3]) }
}

const matchCount = (line: string): ParsedIngredient | null => {
  const m = new RegExp(String.raw`^${NUM}\s+(\p{L}+(?:\s+.*)?)$`, 'u').exec(
    line
  )
  if (!m) return null
  const weight = PLAIN_COUNT_WEIGHTS[m[2].toLowerCase().split(/\s+/)[0]]
  if (weight === undefined) return null
  return { amountG: parseNum(m[1]) * weight, name: stripParens(m[2]) }
}

const parseIngredients = (markdown: string): ParseResult => {
  const parsed: ParsedIngredient[] = []
  const skipped: string[] = []

  for (const rawLine of markdown.split('\n')) {
    const line = normalizeLine(rawLine)
    if (!line) continue

    const match =
      matchEgg(line) ??
      matchUnitRange(line) ??
      matchCountRange(line) ??
      matchUnit(line) ??
      matchCount(line)

    if (match) {
      parsed.push(match)
    } else {
      skipped.push(line)
    }
  }

  return { parsed, skipped }
}

const MACROS: Array<{
  key: keyof NutritionSummary
  label: string
  unit: string
}> = [
  { key: 'kcal', label: 'Kalorien', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fett', unit: 'g' },
  { key: 'carbs', label: 'Kohlenhydrate', unit: 'g' },
  { key: 'fiber', label: 'Ballaststoffe', unit: 'g' },
]

const RecipeNutrition = ({ recipe }: { recipe: Recipe }) => {
  const classes = useStyles()
  const [summary, setSummary] = useState<NutritionSummary | null>(null)
  const [matches, setMatches] = useState<IngredientMatch[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [perServing, setPerServing] = useState(false)

  useEffect(() => {
    let cancelled = false
    const { parsed, skipped: skippedLines } = parseIngredients(
      recipe.ingredients
    )
    if (parsed.length === 0) {
      // No unit-based ingredients — show card with n/a if there is any content
      if (recipe.ingredients.trim()) {
        setSummary({ kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 })
        setSkipped(skippedLines)
      }
      return
    }
    setLoading(true)
    nutritionService
      .calculateNutritionDetailed(parsed)
      .then(({ summary: result, matches: ingredientMatches }) => {
        if (!cancelled) {
          setSummary(result)
          setMatches(ingredientMatches)
          setSkipped(skippedLines)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [recipe.ingredients])

  if (!loading && !summary) return null

  const hasAnyMatch = matches.some(m => m.matched !== null)
  const hasMatchDetails = matches.length > 0 || skipped.length > 0

  return (
    <StyledCard
      expandable
      header="Nährwerte"
      BackgroundIcon={LocalDiningIcon}
      action={
        summary && hasAnyMatch ? (
          <Chip
            size="small"
            label={perServing ? 'Pro Portion' : 'Gesamt'}
            onClick={() => setPerServing(p => !p)}
            clickable
          />
        ) : undefined
      }>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress size={24} />
        </div>
      ) : (
        summary && (
          <>
            <Grid container spacing={2}>
              {MACROS.map(({ key, label, unit }) => {
                const raw = perServing
                  ? summary[key] / recipe.amount
                  : summary[key]
                const value = hasAnyMatch ? Math.round(raw) : null
                return (
                  <Grid key={key} item xs className={classes.macroItem}>
                    <Typography variant="body1" className={classes.macroValue}>
                      {value === null ? 'n/a' : `${value} ${unit}`}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.macroLabel}>
                      {label}
                    </Typography>
                  </Grid>
                )
              })}
            </Grid>

            {hasMatchDetails && (
              <>
                <Divider className={classes.divider} />
                <Typography variant="caption" className={classes.matchHeader}>
                  Zuordnung
                </Typography>

                {matches.map(({ name, matched }) => (
                  <div key={name} className={classes.matchRow}>
                    {matched ? (
                      <CheckCircleOutlineIcon
                        className={`${classes.icon} ${classes.iconMatched}`}
                      />
                    ) : (
                      <HelpOutlineIcon
                        className={`${classes.icon} ${classes.iconUnmatched}`}
                      />
                    )}
                    <Typography variant="caption" className={classes.matchName}>
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={
                        matched
                          ? classes.matchEntry
                          : classes.matchEntryNotFound
                      }>
                      {matched ? `→ ${matched.name}` : '→ nicht gefunden'}
                    </Typography>
                  </div>
                ))}

                {skipped.map(line => (
                  <div key={line} className={classes.matchRow}>
                    <RemoveIcon
                      className={`${classes.icon} ${classes.iconSkipped}`}
                    />
                    <Typography
                      variant="caption"
                      className={`${classes.matchName} ${classes.matchEntryNotFound}`}>
                      {line}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.matchEntryNotFound}>
                      → nicht erkannt
                    </Typography>
                  </div>
                ))}
              </>
            )}
          </>
        )
      )}
    </StyledCard>
  )
}

export default RecipeNutrition
