import { CardActionArea, Grid, Paper, Typography } from '@mui/material'
import { green } from '@mui/material/colors'
import makeStyles from '@mui/styles/makeStyles'
import { onSnapshot } from 'firebase/firestore'
import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useGridContext } from '@/Components/Provider/GridProvider'
import { PATHS } from '@/Components/Routes/Routes'
import Skeletons from '@/Components/Shared/Skeletons'
import { resolveCookCounterOrderedByCreatedDateDescWhereValueIsZero } from '@/firebase/firebaseQueries'

import HomeRecipeContextMenu from './HomeRecipeContextMenu'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    backgroundColor: green.A100,
  },
  typography: {
    color: theme.palette.getContrastText(green.A100),
  },
}))

const HomeNew = () => {
  const [recipeNames, setRecipeNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const { gridBreakpointProps } = useGridContext()
  const classes = useStyles()

  useEffect(() => {
    return onSnapshot(
      resolveCookCounterOrderedByCreatedDateDescWhereValueIsZero(),
      snapshot => {
        setRecipeNames(snapshot.docs.map(doc => doc.id))
        setLoading(false)
      }
    )
  }, [])

  return (
    <Grid container spacing={3}>
      {recipeNames.map(recipeName => (
        <Grid item {...gridBreakpointProps} key={recipeName}>
          <HomeRecipeContextMenu name={recipeName}>
            <Link to={PATHS.details(recipeName)}>
              <CardActionArea>
                <Paper className={classes.paper}>
                  <Typography
                    noWrap
                    className={classes.typography}
                    variant="h6">
                    {recipeName}
                  </Typography>
                </Paper>
              </CardActionArea>
            </Link>
          </HomeRecipeContextMenu>
        </Grid>
      ))}

      <Skeletons
        variant="cookCounter"
        visible={loading}
        numberOfSkeletons={12}
      />
    </Grid>
  )
}

export default memo(HomeNew)
