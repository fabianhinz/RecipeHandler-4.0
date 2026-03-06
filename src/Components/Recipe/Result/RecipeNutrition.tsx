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

const UNIT_MULTIPLIERS: Record<string, number> = {
  g: 1,
  gr: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  el: 15,
  tl: 5,
  prise: 1,
  msp: 0.5,
}

const parseIngredients = (markdown: string): ParseResult => {
  const lines = markdown.split('\n')
  const parsed: ParsedIngredient[] = []
  const skipped: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.replace(/^(\s*[-*•]|\d+\.\s*)/, '').trim()
    if (!line) continue

    // Special case: Ei/Eier (plain count)
    const eggMatch = new RegExp(/^(\d+(?:[,.]\d+)?)\s+Ei(?:er)?\b/i).exec(line)
    if (eggMatch) {
      const count = Number.parseFloat(eggMatch[1].replace(',', '.'))
      parsed.push({ amountG: count * 50, name: 'Hühnerei' })
      continue
    }

    // General unit match
    const unitMatch = new RegExp(
      /^(\d+(?:[,.]\d+)?)\s*(g|gr|kg|ml|l|EL|TL|Prise|Msp)\.?\s+(.+)$/i
    ).exec(line)
    if (unitMatch) {
      const amount = Number.parseFloat(unitMatch[1].replace(',', '.'))
      const unit = unitMatch[2].toLowerCase()
      const namePart = unitMatch[3].trim()
      const multiplier = UNIT_MULTIPLIERS[unit]
      if (multiplier !== undefined) {
        const name = namePart.replace(/\s*\(.*\)\s*$/, '').trim()
        parsed.push({ amountG: amount * multiplier, name })
        continue
      }
    }

    skipped.push(line)
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
