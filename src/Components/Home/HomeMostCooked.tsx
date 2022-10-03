import { CardActionArea, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import { yellow } from '@material-ui/core/colors'
import { memo, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { PATHS } from '@/Components/Routes/Routes'
import Skeletons from '@/Components/Shared/Skeletons'
import { DocumentId, MostCooked } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

import HomeRecipeContextMenu from './HomeRecipeContextMenu'

const COLOR_PALETTE = [
  yellow[900],
  yellow[800],
  yellow[700],
  yellow[600],
  yellow[500],
  yellow[400],
  yellow[300],
  yellow[200],
  yellow[100],
  yellow[50],
]

interface StyleProps {
  backgroundColor: string
}

const useMostCookedPaperStyles = makeStyles(theme => ({
  paper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: (props: StyleProps) => props.backgroundColor,
  },
  typography: {
    color: (props: StyleProps) =>
      theme.palette.getContrastText(props.backgroundColor || COLOR_PALETTE[0]),
  },
}))

interface MostCookedPaperProps {
  recipeName: string
  counter: MostCooked<number>
  paletteIndex: number
}

const MostCookedPaper = ({ recipeName, counter, paletteIndex }: MostCookedPaperProps) => {
  const classes = useMostCookedPaperStyles({
    backgroundColor: COLOR_PALETTE[paletteIndex],
  })

  const { gridBreakpointProps } = useGridContext()

  return (
    <Grid item {...gridBreakpointProps} key={recipeName}>
      <HomeRecipeContextMenu name={recipeName}>
        <Link to={PATHS.details(recipeName)}>
          <CardActionArea>
            <Paper className={classes.paper}>
              <Typography noWrap className={classes.typography} variant="h6">
                {counter.value}x {recipeName}
              </Typography>
            </Paper>
          </CardActionArea>
        </Link>
      </HomeRecipeContextMenu>
    </Grid>
  )
}

type MostCookedMap = Map<DocumentId, MostCooked<number>>

// eslint-disable-next-line react/no-multi-comp
const HomeMostCooked = () => {
  const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())
  const [counterValues, setCounterValues] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  const { isMobile } = useBreakpointsContext()

  const numberOfDocs = useMemo(
    () => (isMobile ? 4 * FirebaseService.QUERY_LIMIT_MOBILE : 4 * FirebaseService.QUERY_LIMIT),
    [isMobile]
  )

  useEffect(() => {
    return FirebaseService.firestore
      .collection('cookCounter')
      .orderBy('value', 'desc')
      .limit(numberOfDocs)
      .onSnapshot(querySnapshot => {
        const newMostCookedMap = new Map(
          querySnapshot.docs.map(doc => [doc.id, doc.data()])
        ) as MostCookedMap

        setCounterValues(
          new Set([...newMostCookedMap.values()].map(mostCooked => mostCooked.value))
        )
        setMostCooked(newMostCookedMap)
        setLoading(false)
      })
  }, [numberOfDocs])

  return (
    <Grid container spacing={3}>
      {[...mostCooked.entries()].map(([recipeName, counter]) => (
        <MostCookedPaper
          key={recipeName}
          paletteIndex={[...counterValues].indexOf(counter.value)}
          recipeName={recipeName}
          counter={counter}
        />
      ))}

      <Skeletons variant="cookCounter" visible={loading} numberOfSkeletons={numberOfDocs} />
    </Grid>
  )
}

export default memo(HomeMostCooked)
