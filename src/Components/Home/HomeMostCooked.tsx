import {
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { yellow } from '@material-ui/core/colors'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useScrollButtons from '../../hooks/useScrollButtons'
import { DocumentId, MostCooked } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { PATHS } from '../Routes/Routes'
import Skeletons from '../Shared/Skeletons'

// ! the length of COLOR_PALETTE must equal the number of MOST_COOKED_LIMIT
const MOST_COOKED_LIMIT = 10
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

const useMostCookedPaperStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            backgroundColor: (props: StyleProps) => props.backgroundColor,
        },
        typography: {
            color: (props: StyleProps) => theme.palette.getContrastText(props.backgroundColor),
            maxWidth: '100%',
        },
    })
)

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
    const history = useHistory()

    return (
        <Grid item {...gridBreakpointProps} key={recipeName}>
            <CardActionArea onClick={() => history.push(PATHS.details(recipeName))}>
                <Paper className={classes.paper}>
                    <Typography className={classes.typography} noWrap variant="h6">
                        {counter.value}x {recipeName}
                    </Typography>
                </Paper>
            </CardActionArea>
        </Grid>
    )
}

const useHomeMostCookedStyles = makeStyles(() =>
    createStyles({
        mostCookedGridContainer: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    })
)

type MostCookedMap = Map<DocumentId, MostCooked<number>>

const HomeMostCooked = () => {
    const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())
    const [counterValues, setCounterValues] = useState<Set<number>>(new Set())

    const containerRef = useRef<any | undefined>()
    const { ScrollButtons, ScrollLeftTrigger, ScrollRightTrigger } = useScrollButtons({
        disabled: mostCooked.size === 0,
        element: containerRef.current as HTMLDivElement,
        delta: 300,
    })

    const classes = useHomeMostCookedStyles()

    const { user } = useFirebaseAuthContext()
    const { gridLayout } = useGridContext()

    useEffect(() => {
        if (user && !user.showMostCooked) return

        return FirebaseService.firestore
            .collection('cookCounter')
            .orderBy('value', 'desc')
            .limit(MOST_COOKED_LIMIT)
            .onSnapshot(querySnapshot => {
                const newMostCookedMap = new Map(
                    querySnapshot.docs.map(doc => [doc.id, doc.data()])
                ) as MostCookedMap

                setCounterValues(
                    new Set([...newMostCookedMap.values()].map(mostCooked => mostCooked.value))
                )
                setMostCooked(newMostCookedMap)
            })
    }, [user])

    if (user && !user.showMostCooked) return <></>

    return (
        <>
            <Grid item xs={10} md={9}>
                <Typography variant="h4">Häufig gekocht</Typography>
            </Grid>
            <Grid item xs={2} md={3}>
                <ScrollButtons />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    ref={containerRef}
                    className={classes.mostCookedGridContainer}
                    container
                    spacing={3}
                    wrap={gridLayout === 'grid' ? 'nowrap' : 'wrap'}>
                    <ScrollLeftTrigger />
                    {[...mostCooked.entries()]
                        .slice(0, gridLayout === 'grid' ? mostCooked.size : 6)
                        .map(([recipeName, counter]) => (
                            <MostCookedPaper
                                key={recipeName}
                                paletteIndex={[...counterValues].indexOf(counter.value)}
                                recipeName={recipeName}
                                counter={counter}
                            />
                        ))}
                    <ScrollRightTrigger />
                    <Skeletons
                        variant="cookCounter"
                        visible={mostCooked.size === 0}
                        numberOfSkeletons={gridLayout === 'grid' ? MOST_COOKED_LIMIT : 6}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(HomeMostCooked)
