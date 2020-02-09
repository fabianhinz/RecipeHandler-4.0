import {
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
    useTheme,
} from '@material-ui/core'
import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    red,
    teal,
    yellow,
} from '@material-ui/core/colors'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { DocumentId, MostCooked } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { PATHS } from '../Routes/Routes'
import Skeletons from '../Shared/Skeletons'

const COLOR_PALETTE_DARK = [
    amber[300],
    blue[300],
    blueGrey[300],
    brown[300],
    cyan[300],
    deepOrange[300],
    deepPurple[300],
    green[300],
    indigo[300],
    lightBlue[300],
    lightGreen[300],
    lime[300],
    orange[300],
    red[300],
    teal[300],
    yellow[300],
]

const COLOR_PALETTE_LIGHT = [
    amber[100],
    blue[100],
    blueGrey[100],
    brown[100],
    cyan[100],
    deepOrange[100],
    deepPurple[100],
    green[100],
    indigo[100],
    lightBlue[100],
    lightGreen[100],
    lime[100],
    orange[100],
    red[100],
    teal[100],
    yellow[100],
]

interface StyleProps {
    backgroundColor: string
}

const useMostCookedPaperStyles = makeStyles(theme =>
    createStyles({
        mostCookedGridContainer: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        paper: {
            padding: theme.spacing(2),
            backgroundColor: (props: StyleProps) => props.backgroundColor,
        },
        typography: {
            fontFamily: "'Lato', sans-serif",
            color: '#000',
        },
    })
)

interface MostCookedPaperProps {
    recipeName: string
    counter: MostCooked<number>
    index: number
}

const MostCookedPaper = ({ recipeName, counter, index }: MostCookedPaperProps) => {
    const theme = useTheme()
    const paletteIndexRef = useRef(Math.ceil(Math.random() * index))

    const classes = useMostCookedPaperStyles({
        backgroundColor:
            theme.palette.type === 'light'
                ? COLOR_PALETTE_LIGHT[paletteIndexRef.current]
                : COLOR_PALETTE_DARK[paletteIndexRef.current],
    })

    const { gridBreakpointProps } = useGridContext()
    const history = useHistory()

    return (
        <Grid {...gridBreakpointProps} item key={recipeName}>
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

const useHomeMostCookedStyles = makeStyles(theme =>
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

const MOST_COOKED_LIMIT = 10

const HomeMostCooked = () => {
    const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())

    const classes = useHomeMostCookedStyles()

    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        if (user && !user.showMostCooked) return

        return FirebaseService.firestore
            .collection('cookCounter')
            .orderBy('value', 'desc')
            .limit(MOST_COOKED_LIMIT)
            .onSnapshot(querySnapshot =>
                setMostCooked(
                    new Map(querySnapshot.docs.map(doc => [doc.id, doc.data()])) as MostCookedMap
                )
            )
    }, [user])

    if (user && !user.showMostCooked) return <></>

    return (
        <>
            <Grid item>
                <Typography variant="h4">Am häufigsten gekocht</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    className={classes.mostCookedGridContainer}
                    container
                    spacing={3}
                    wrap="nowrap">
                    {[...mostCooked.entries()].map(([recipeName, counter], index) => (
                        <MostCookedPaper
                            key={recipeName}
                            recipeName={recipeName}
                            counter={counter}
                            index={index}
                        />
                    ))}
                    <Skeletons
                        variant="cookCounter"
                        visible={mostCooked.size === 0}
                        numberOfSkeletons={MOST_COOKED_LIMIT}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(HomeMostCooked)
