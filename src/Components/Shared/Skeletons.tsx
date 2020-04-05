import { Card, createStyles, Grid, GridSize, makeStyles } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { FirebaseService } from '../../services/firebase'
import { useGridContext } from '../Provider/GridProvider'

const useStyles = makeStyles(theme => {
    const trial = {
        [theme.breakpoints.down('sm')]: {
            height: 283,
        },
        [theme.breakpoints.between('md', 'lg')]: {
            height: 333,
        },
        [theme.breakpoints.up('xl')]: {
            height: 383,
        },
        width: '100%',
    }

    return createStyles({
        recipe: {
            height: 250,
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
    })
})

interface Props {
    variant: 'recipe' | 'trial' | 'cookCounter' | 'trialsSelection'
    visible: boolean
    numberOfSkeletons?: number
}

const Skeletons = ({ visible, numberOfSkeletons, variant }: Props) => {
    const classes = useStyles()
    const { gridBreakpointProps } = useGridContext()

    if (!visible) return <></>

    const variantAvareBreakpoints: Partial<Record<Breakpoint, boolean | GridSize>> =
        variant === 'trialsSelection' ? { xs: 12 } : gridBreakpointProps

    return (
        <>
            {new Array(numberOfSkeletons || FirebaseService.QUERY_LIMIT)
                .fill(1)
                .map((_skeleton, index) => (
                    <Grid {...variantAvareBreakpoints} item key={index}>
                        <Grid container spacing={2} justify="space-between" alignItems="center">
                            <Grid xs={12} item>
                                <Card>
                                    <Skeleton
                                        animation="wave"
                                        className={classes[variant]}
                                        variant="rect"
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
