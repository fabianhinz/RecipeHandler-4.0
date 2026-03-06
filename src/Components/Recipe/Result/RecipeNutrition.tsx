import {
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import LocalDiningIcon from '@material-ui/icons/LocalDining'
import { useEffect, useState } from 'react'

import StyledCard from '@/Components/Shared/StyledCard'
import { Recipe } from '@/model/model'
import { nutritionService, NutritionSummary } from '@/services/nutritionService'

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
}))

interface ParsedIngredient {
  amountG: number
  name: string
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

const parseIngredients = (markdown: string): ParsedIngredient[] => {
  const lines = markdown.split('\n')
  const result: ParsedIngredient[] = []

  for (const rawLine of lines) {
    const line = rawLine.replace(/^(\s*[-*•]|\d+\.\s*)/, '').trim()
    if (!line) continue

    // Special case: Ei/Eier (plain count)
    const eggMatch = new RegExp(/^(\d+(?:[,.]\d+)?)\s+Ei(?:er)?\b/i).exec(line)
    if (eggMatch) {
      const count = Number.parseFloat(eggMatch[1].replace(',', '.'))
      result.push({ amountG: count * 50, name: 'Hühnerei' })
      continue
    }

    // General unit match
    const unitMatch = new RegExp(
      /^(\d+(?:[,.]\d+)?)\s*(g|gr|kg|ml|l|EL|TL|Prise|Msp)\.?\s+(.+)$/i
    ).exec(line)
    if (!unitMatch) continue

    const amount = Number.parseFloat(unitMatch[1].replace(',', '.'))
    const unit = unitMatch[2].toLowerCase()
    const namePart = unitMatch[3].trim()

    const multiplier = UNIT_MULTIPLIERS[unit]
    if (multiplier === undefined) continue

    // Strip trailing parenthetical
    const name = namePart.replace(/\s*\(.*\)\s*$/, '').trim()

    result.push({ amountG: amount * multiplier, name })
  }

  return result
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
  const [loading, setLoading] = useState(false)
  const [perServing, setPerServing] = useState(false)

  useEffect(() => {
    let cancelled = false
    const parsed = parseIngredients(recipe.ingredients)
    if (parsed.length === 0) return
    setLoading(true)
    nutritionService
      .calculateNutrition(parsed)
      .then(result => {
        if (!cancelled) {
          setSummary(result)
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

  return (
    <StyledCard
      header="Nährwerte"
      BackgroundIcon={LocalDiningIcon}
      action={
        summary ? (
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
          <Grid container spacing={2}>
            {MACROS.map(({ key, label, unit }) => {
              const raw = perServing
                ? summary[key] / recipe.amount
                : summary[key]
              const value = Math.round(raw)
              return (
                <Grid key={key} item xs className={classes.macroItem}>
                  <Typography variant="body1" className={classes.macroValue}>
                    {value} {unit}
                  </Typography>
                  <Typography variant="caption" className={classes.macroLabel}>
                    {label}
                  </Typography>
                </Grid>
              )
            })}
          </Grid>
        )
      )}
    </StyledCard>
  )
}

export default RecipeNutrition
