import {
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import React, { memo, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { PATHS } from '../Routes/Routes'
import ExpandableGridContainer from '../Shared/ExpandableGridContainer'
import Skeletons from '../Shared/Skeletons'

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            backgroundColor: green.A100,
        },
        typography: {
            color: theme.palette.getContrastText(green.A100),
        },
    })
)

const HomeNew = () => {
    const [recipeNames, setRecipeNames] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const { user } = useFirebaseAuthContext()
    const { gridBreakpointProps } = useGridContext()
    const classes = useStyles()

    const history = useHistory()

    useEffect(() => {
        if (user && !user.showMostCooked) return

        return FirebaseService.firestore
            .collection('cookCounter')
            .orderBy('createdDate', 'desc')
            .where('value', '==', 0)
            .onSnapshot(snapshot => {
                setRecipeNames(snapshot.docs.map(doc => doc.id))
                setLoading(false)
            })
    }, [user])

    if (!loading && recipeNames.length === 0) return <></>
    else if (user && !user.showNew) return <></>

    return (
        <ExpandableGridContainer
            titles={{
                header: 'Neu',
                expanded: 'weniger anzeigen',
                notExpanded: 'alle anzeigen',
            }}>
            {recipeNames.map(recipeName => (
                <Grid item {...gridBreakpointProps} key={recipeName}>
                    <CardActionArea onClick={() => history.push(PATHS.details(recipeName))}>
                        <Paper className={classes.paper}>
                            <Typography className={classes.typography} variant="h6">
                                {recipeName}
                            </Typography>
                        </Paper>
                    </CardActionArea>
                </Grid>
            ))}

            <Skeletons
                variant="cookCounter"
                visible={recipeNames.length === 0}
                numberOfSkeletons={12}
            />
        </ExpandableGridContainer>
    )
}

export default memo(HomeNew)
