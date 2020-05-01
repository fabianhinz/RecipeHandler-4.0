import {
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { yellow } from '@material-ui/core/colors'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { DocumentId, MostCooked } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { PATHS } from '../Routes/Routes'
import ExpandableGridContainer from '../Shared/ExpandableGridContainer'
import Skeletons from '../Shared/Skeletons'

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
            color: (props: StyleProps) =>
                theme.palette.getContrastText(props.backgroundColor || COLOR_PALETTE[0]),
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

type MostCookedMap = Map<DocumentId, MostCooked<number>>

const HomeMostCooked = () => {
    const [mostCooked, setMostCooked] = useState<MostCookedMap>(new Map())
    const [counterValues, setCounterValues] = useState<Set<number>>(new Set())

    const { user } = useFirebaseAuthContext()
    const { isMobile } = useBreakpointsContext()

    const numberOfDocs = useMemo(
        () => (isMobile ? 4 * FirebaseService.QUERY_LIMIT_MOBILE : 4 * FirebaseService.QUERY_LIMIT),
        [isMobile]
    )

    useEffect(() => {
        if (user && !user.showMostCooked) return

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
            })
    }, [isMobile, numberOfDocs, user])

    if (user && !user.showMostCooked) return <></>

    return (
        <ExpandableGridContainer
            titles={{
                header: 'Häufig gekocht',
                expanded: 'weniger anzeigen',
                notExpanded: 'mehr anzeigen',
            }}>
            {[...mostCooked.entries()].map(([recipeName, counter]) => (
                <MostCookedPaper
                    key={recipeName}
                    paletteIndex={[...counterValues].indexOf(counter.value)}
                    recipeName={recipeName}
                    counter={counter}
                />
            ))}

            <Skeletons
                variant="cookCounter"
                visible={mostCooked.size === 0}
                numberOfSkeletons={numberOfDocs}
            />
        </ExpandableGridContainer>
    )
}

export default memo(HomeMostCooked)
