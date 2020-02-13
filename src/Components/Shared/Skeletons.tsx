import { Card, createStyles, Grid, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useGridContext } from '../Provider/GridProvider'

interface Props {
    variant: 'recipe' | 'trial' | 'cookCounter'
    visible: boolean
    numberOfSkeletons?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        recipe: {
            [theme.breakpoints.down('sm')]: {
                height: 120 + 57,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                height: 150 + 57,
            },
            [theme.breakpoints.up('xl')]: {
                height: 180 + 57,
            },
        },
        trial: {
            [theme.breakpoints.down('sm')]: {
                height: 283,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                height: 333,
            },
            [theme.breakpoints.up('xl')]: {
                height: 383,
            },
        },
        cookCounter: {
            minWidth: 150,
            [theme.breakpoints.only('xs')]: {
                height: 44,
            },
            [theme.breakpoints.up('sm')]: {
                height: 48,
            },
        },
    })
)

const Skeletons = ({ visible, numberOfSkeletons, variant }: Props) => {
    const classes = useStyles()
    const { gridBreakpointProps } = useGridContext()

    return (
        <>
            {visible &&
                new Array(numberOfSkeletons || 6).fill(1).map((_skeleton, index) => (
                    <Grid {...gridBreakpointProps} item key={index}>
                        <Grid container spacing={2} justify="space-between" alignItems="center">
                            <Grid xs={12} item>
                                <Card>
                                    <Skeleton
                                        className={classes[variant]}
                                        width="100%"
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
