import {
    CardActionArea,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { yellow } from '@material-ui/core/colors'
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
            fontFamily: "'Lato', sans-serif",
            color: (props: StyleProps) => theme.palette.getContrastText(props.backgroundColor),
            maxWidth: 300,
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

const MOST_COOKED_CONTAIER_ID = elementIdService.getId()

const HomeMostCooked = () => {
    const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())
    const [counterValues, setCounterValues] = useState<Set<number>>(new Set())
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
                    {mostCooked.size > 0 && <LeftTrigger />}
                    {[...mostCooked.entries()].map(([recipeName, counter]) => (
                        <MostCookedPaper
                            key={recipeName}
                            paletteIndex={[...counterValues].indexOf(counter.value)}
                            recipeName={recipeName}
                            counter={counter}
                        />
                    ))}
                    {mostCooked.size > 0 && <RightTrigger />}
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
