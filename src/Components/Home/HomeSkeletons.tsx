import { Card, createStyles, Grid, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { recentlyAddedGridProps } from './HomeRecipeCard'

interface Props {
    visible: boolean
    numberOfSkeletons?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        skeleton: {
            [theme.breakpoints.down('sm')]: {
                width: 120 + 56,
                height: 120 + 56,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 150 + 56,
                height: 150 + 56,
            },
            [theme.breakpoints.up('xl')]: {
                width: 200 + 56,
                height: 200 + 56,
            },
        },
    })
)

const HomeSkeletons = ({ visible, numberOfSkeletons }: Props) => {
    const classes = useStyles()
    const { isHighRes } = useBreakpointsContext()

    return (
        <>
            {visible &&
                new Array(numberOfSkeletons || 6).fill(1).map((_skeleton, index) => (
                    <Grid {...recentlyAddedGridProps(isHighRes)} item key={index}>
                        <Grid container spacing={2} justify="space-between" alignItems="center">
                            <Grid xs={12} item>
                                <Card>
                                    <Skeleton
                                        className={classes.skeleton}
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

export default HomeSkeletons
