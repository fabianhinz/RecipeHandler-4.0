import { Grid, makeStyles, Typography } from '@material-ui/core'

import { CategoryResult } from '@/Components/Category/CategoryResult'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { Recipe } from '@/model/model'

import RecipeResultButtons from './RecipeResultButtons'

const useStyles = makeStyles(theme => ({
  recipeName: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
}))

interface Props {
  recipe: Recipe
}

const RecipeResultHeader = ({ recipe }: Props) => {
  const classes = useStyles()
  const { user } = useFirebaseAuthContext()

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      alignItems="center">
      <Grid item xs={12} sm="auto">
        <Typography className={classes.recipeName} variant="h5">
          {recipe.name}
        </Typography>
      </Grid>

      <Grid item xs={12} sm="auto">
        <RecipeResultButtons
          name={recipe.name}
          numberOfComments={user ? recipe.numberOfComments : undefined}
        />
      </Grid>

      <Grid item xs={12}>
        <CategoryResult
          variant="outlined"
          swatches={recipe.previewAttachmentSwatches}
          categories={recipe.categories}
        />
      </Grid>
    </Grid>
  )
}

export default RecipeResultHeader
