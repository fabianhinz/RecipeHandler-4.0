import { Breakpoint, Card, Grid, GridSize, Theme } from '@mui/material'
import { Skeleton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { RECIPE_CARD_HEIGHT } from '@/Components/Home/HomeRecipeCard'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { queryLimits } from '@/firebase/firebaseQueries'

const useStyles = makeStyles<Theme>(theme => {
  const trial = {
    [theme.breakpoints.down('md')]: {
      height: 283,
    },
    [theme.breakpoints.between('md', 'xl')]: {
      height: 333,
    },
    [theme.breakpoints.up('xl')]: {
      height: 383,
    },
    width: '100%',
  }

  return {
    recipe: {
      height: RECIPE_CARD_HEIGHT,
      width: '100%',
    },
    trialsSelection: trial,
    trial,
    cookCounter: {
      minWidth: 150,
      [theme.breakpoints.only('xs')]: {
        height: 44.86,
      },
      [theme.breakpoints.up('sm')]: {
        height: 48,
      },
      width: '100%',
    },
  }
})

interface Props {
  variant: 'recipe' | 'trial' | 'cookCounter' | 'trialsSelection'
  visible: boolean
  numberOfSkeletons?: number
}

const Skeletons = ({ visible, numberOfSkeletons, variant }: Props) => {
  const { gridBreakpointProps } = useGridContext()
  const classes = useStyles()

  if (!visible) return <></>

  const variantAvareBreakpoints: Partial<
    Record<Breakpoint, boolean | GridSize>
  > =
    variant === 'trialsSelection'
      ? { xs: 12 }
      : variant === 'recipe'
      ? { xs: 6, md: 4, lg: 3, xl: 2 }
      : gridBreakpointProps

  return (
    <>
      {new Array(numberOfSkeletons || queryLimits.desktop)
        .fill(1)
        .map((_skeleton, index) => (
          <Grid {...variantAvareBreakpoints} item key={index}>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center">
              <Grid xs={12} item>
                <Card>
                  <Skeleton
                    animation="wave"
                    className={classes[variant]}
                    variant="rectangular"
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        ))}
    </>
  )
}

export default Skeletons
