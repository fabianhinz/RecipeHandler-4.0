import {
    Button,
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
    useTheme,
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import clsx from 'clsx'
import { ChevronDown } from 'mdi-material-ui'
import React, { memo, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { GridLayout, useGridContext } from '../Provider/GridProvider'
import { PATHS } from '../Routes/Routes'
import Skeletons from '../Shared/Skeletons'

interface StyleProps {
    gridItems: number
    expanded: boolean
    gridLayout: GridLayout
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            overflowY: 'hidden',
            // ? a grid item is around 72px in height
            height: 3 * 72,
            transition: theme.transitions.create('height', {
                easing: theme.transitions.easing.easeOut,
            }),
        },
        containerExpanded: {
            [theme.breakpoints.between('xs', 'sm')]: {
                height: ({ gridItems }: StyleProps) => gridItems * 72,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                height: ({ gridItems, gridLayout }: StyleProps) =>
                    gridLayout === 'list' ? gridItems * 72 : Math.ceil(gridItems / 2) * 72,
            },
            [theme.breakpoints.up('xl')]: {
                height: ({ gridItems, gridLayout }: StyleProps) =>
                    gridLayout === 'list' ? gridItems * 72 : Math.ceil(gridItems / 3) * 72,
            },
        },
        hidden: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                easing: theme.transitions.easing.easeOut,
            }),
        },
        expanded: {
            transform: 'rotate(180deg)',
        },
        paper: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            backgroundColor: green.A100,
        },
        typography: {
            color: theme.palette.getContrastText(green.A100),
            maxWidth: '100%',
        },
    })
)

const HomeNew = () => {
    const [recipeNames, setRecipeNames] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    const { user } = useFirebaseAuthContext()
    const { gridBreakpointProps, gridLayout } = useGridContext()
    const classes = useStyles({ gridItems: recipeNames.length, expanded, gridLayout })
    const theme = useTheme()

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
        <>
            <Grid item xs={12}>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="h4">Neu</Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={recipeNames.length === 0}
                            onClick={() => setExpanded(!expanded)}
                            variant={theme.palette.type === 'dark' ? 'outlined' : 'contained'}
                            startIcon={
                                <ChevronDown
                                    className={clsx(classes.hidden, expanded && classes.expanded)}
                                />
                            }>
                            {expanded ? 'weniger anzeigen' : 'alle anzeigen'}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid
                    container
                    className={clsx(classes.container, expanded && classes.containerExpanded)}
                    spacing={3}>
                    {recipeNames.map(recipeName => (
                        <Grid item {...gridBreakpointProps} key={recipeName}>
                            <CardActionArea onClick={() => history.push(PATHS.details(recipeName))}>
                                <Paper className={classes.paper}>
                                    <Typography className={classes.typography} noWrap variant="h6">
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
                </Grid>
            </Grid>
        </>
    )
}

export default memo(HomeNew)
