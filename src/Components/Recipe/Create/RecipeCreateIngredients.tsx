import AddIcon from '@mui/icons-material/AddCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import RemoveIcon from '@mui/icons-material/RemoveCircle'
import {
  Button,
  Grid,
  IconButton,
  Popover,
  Theme,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useState } from 'react'

import MarkdownInput from '@/Components/Markdown/MarkdownInput'
import StyledCard from '@/Components/Shared/StyledCard'

import { RecipeCreateDispatch } from './RecipeCreateReducer'

interface Props extends RecipeCreateDispatch {
  amount: number
  ingredients: string
  onIngredientsChange: (value: string) => void
}

const useStyles = makeStyles<Theme>(theme => ({
  headerButton: {
    textTransform: 'none',
  },
  popoverPaper: {
    padding: theme.spacing(1),
  },
}))

const RecipeCreateIngredients = ({
  amount,
  ingredients,
  onIngredientsChange,
  dispatch,
}: Props) => {
  const [amountAnchorEl, setAmountAnchorEl] =
    useState<HTMLButtonElement | null>(null)

  const classes = useStyles()

  return (
    <>
      <StyledCard
        header={
          <Button
            className={classes.headerButton}
            variant="text"
            onClick={e => setAmountAnchorEl(e.currentTarget)}>
            <Typography variant="h5">Zutaten für {amount}</Typography>
          </Button>
        }
        BackgroundIcon={AssignmentIcon}>
        <MarkdownInput
          outerValue={ingredients}
          onChange={onIngredientsChange}
        />
      </StyledCard>

      <Popover
        classes={{ paper: classes.popoverPaper }}
        open={Boolean(amountAnchorEl)}
        anchorEl={amountAnchorEl}
        onClose={() => setAmountAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Grid container wrap="nowrap" spacing={1} alignItems="center">
          <Grid item>
            <Typography variant="h5">Personen</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => dispatch({ type: 'decreaseAmount' })}
              size="small">
              <RemoveIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h5">{amount}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => dispatch({ type: 'increaseAmount' })}
              size="small">
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Popover>
    </>
  )
}

export default RecipeCreateIngredients
