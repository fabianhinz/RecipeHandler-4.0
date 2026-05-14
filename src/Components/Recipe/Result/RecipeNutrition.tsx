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
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline'
import { useEffect, useState } from 'react'

import StyledCard from '@/Components/Shared/StyledCard'
import { Recipe } from '@/model/model'
import { parseIngredients } from '@/services/ingredientParser'
import {
  IngredientMatch,
  nutritionService,
  NutritionSummary,
} from '@/services/nutritionService'

const useStyles = makeStyles((theme: Theme) => ({
  perServingChip: {
    minWidth: 100,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  detailsTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
    overflow: 'hidden',
  },
  iconMatched: {
    color: '#4caf50',
  },
  iconDisabled: {
    color: theme.palette.text.disabled,
  },
  matchName: {
    flexShrink: 0,
  },
  matchAmount: {
    color: theme.palette.text.disabled,
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

const MACROS: Array<{
  key: keyof NutritionSummary
  label: string
  unit: string
}> = [
  { key: 'kcal', label: 'Kalorien', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fett', unit: 'g' },
  { key: 'carbs', label: 'Kohlenhydrate', unit: 'g' },
  { key: 'sugar', label: 'davon Zucker', unit: 'g' },
  { key: 'fiber', label: 'Ballaststoffe', unit: 'g' },
]

const RecipeNutrition = ({ recipe }: { recipe: Recipe }) => {
  const classes = useStyles()
  const [summary, setSummary] = useState<NutritionSummary | null>(null)
  const [matches, setMatches] = useState<IngredientMatch[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [perServing, setPerServing] = useState(true)

  useEffect(() => {
    let cancelled = false
    const { parsed, skipped: skippedLines } = parseIngredients(
      recipe.ingredients
    )
    if (parsed.length === 0) {
      // No unit-based ingredients — show card with n/a if there is any content
      if (recipe.ingredients.trim()) {
        setSummary({
          kcal: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          sugar: 0,
        })
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
    <StyledCard expandable header="Nährwerte" BackgroundIcon={LocalDiningIcon}>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress size={24} />
        </div>
      ) : (
        summary && (
          <>
            <Grid container spacing={1}>
              {summary && hasAnyMatch && (
                <Grid item>
                  <Chip
                    className={classes.perServingChip}
                    color="secondary"
                    variant={perServing ? 'default' : 'outlined'}
                    label="Pro Portion"
                    disabled={recipe.amount === 1}
                    onClick={() => setPerServing(p => !p)}
                  />
                </Grid>
              )}
              {MACROS.map(({ key, label, unit }) => {
                const raw = perServing
                  ? summary[key] / recipe.amount
                  : summary[key]
                const value = hasAnyMatch ? Math.round(raw) : null

                return (
                  <Grid item key={key}>
                    <Chip
                      label={
                        value === null
                          ? `n/a ${label}`
                          : `${value}${unit} ${label}`
                      }
                    />
                  </Grid>
                )
              })}
            </Grid>

            {hasMatchDetails && (
              <>
                <Typography
                  variant="subtitle2"
                  className={classes.detailsTitle}>
                  Zuordnung
                </Typography>

                {matches.map(({ name, amountG, matched }) => (
                  <div key={name} className={classes.matchRow}>
                    {matched ? (
                      <CheckCircleOutlineIcon className={classes.iconMatched} />
                    ) : (
                      <HelpOutlineIcon className={classes.iconDisabled} />
                    )}
                    <Typography className={classes.matchName}>
                      {name}
                      <Typography
                        component={'span'}
                        className={classes.matchAmount}>
                        {` (${
                          amountG % 1 === 0 ? amountG : amountG.toFixed(1)
                        }g)`}
                      </Typography>
                      <Typography
                        component={'span'}
                        className={
                          matched
                            ? classes.matchEntry
                            : classes.matchEntryNotFound
                        }>
                        {matched ? ` → ${matched.name}` : ' → nicht gefunden'}
                      </Typography>
                    </Typography>
                  </div>
                ))}

                {skipped.map(line => (
                  <div key={line} className={classes.matchRow}>
                    <RemoveIcon className={classes.iconDisabled} />
                    <Typography
                      className={`${classes.matchName} ${classes.matchEntryNotFound}`}>
                      {line}
                      <Typography
                        component={'span'}
                        className={classes.matchEntryNotFound}>
                        {' → nicht erkannt'}
                      </Typography>
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
