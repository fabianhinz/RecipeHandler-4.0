import {
    CardActionArea,
    createStyles,
    Grid,
    IconButton,
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
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow,
} from '@material-ui/core/colors'
import { ChevronLeft, ChevronRight } from 'mdi-material-ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { DocumentId, MostCooked } from '../../model/model'
import elementIdService from '../../services/elementIdService'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
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
    grey[300],
    indigo[300],
    lightBlue[300],
    lightGreen[300],
    lime[300],
    orange[300],
    pink[300],
    purple[300],
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
    grey[100],
    indigo[100],
    lightBlue[100],
    lightGreen[100],
    lime[100],
    orange[100],
    pink[100],
    purple[100],
    red[100],
    teal[100],
    yellow[100],
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
            fontFamily: "'Lato', sans-serif",
            color: (props: StyleProps) => theme.palette.getContrastText(props.backgroundColor),
        },
    })
)

interface MostCookedPaperProps {
    recipeName: string
    counter: MostCooked<number>
}

const MostCookedPaper = ({ recipeName, counter }: MostCookedPaperProps) => {
    const theme = useTheme()
    const paletteIndexRef = useRef(Math.floor(Math.random() * COLOR_PALETTE_LIGHT.length))

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
const MOST_COOKED_CONTAIER_ID = elementIdService.getId()

const HomeMostCooked = () => {
    const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())
    const [containerScrollLeft, setContainerScrollLeft] = useState(0)
    const [scrollRightDisabled, setScrollRightDisabled] = useState(false)
    const [scrollLeftDisabled, setScrollLeftDisabled] = useState(false)

    const containerRef = useRef<any | undefined>()

    const classes = useHomeMostCookedStyles()

    const { user } = useFirebaseAuthContext()
    const { isMobile } = useBreakpointsContext()
    const { IntersectionObserverTrigger: RightTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setScrollRightDisabled(true),
        onLeave: () => setScrollRightDisabled(false),
    })
    const { IntersectionObserverTrigger: LeftTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setScrollLeftDisabled(true),
        onLeave: () => setScrollLeftDisabled(false),
    })

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

    const handleScrollLeft = () => {
        ;(containerRef.current as HTMLDivElement).scroll({
            left: containerScrollLeft - 300,
            behavior: 'smooth',
        })
        setContainerScrollLeft(prev => prev - 300)
    }

    const handleScrollRight = () => {
        ;(containerRef.current as HTMLDivElement).scroll({
            left: containerScrollLeft + 300,
            behavior: 'smooth',
        })
        setContainerScrollLeft(prev => prev + 300)
    }

    return (
        <>
            <Grid item xs={10} md={9}>
                <Typography variant="h4">Am häufigsten gekocht</Typography>
            </Grid>
            <Grid item xs={2} md={3}>
                <Grid container justify="flex-end" wrap="nowrap">
                    <Grid item>
                        <IconButton
                            size={isMobile ? 'small' : 'medium'}
                            disabled={scrollLeftDisabled}
                            onClick={handleScrollLeft}>
                            <ChevronLeft />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            size={isMobile ? 'small' : 'medium'}
                            disabled={scrollRightDisabled}
                            onClick={handleScrollRight}>
                            <ChevronRight />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    ref={containerRef}
                    className={classes.mostCookedGridContainer}
                    container
                    spacing={3}
                    id={MOST_COOKED_CONTAIER_ID}
                    wrap="nowrap">
                    <LeftTrigger />
                    {[...mostCooked.entries()].map(([recipeName, counter]) => (
                        <MostCookedPaper
                            key={recipeName}
                            recipeName={recipeName}
                            counter={counter}
                        />
                    ))}
                    <RightTrigger />
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
