import { Card, createStyles, Grid, ListItem, ListItemText, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useGridContext } from '../Provider/GridProvider'

interface Props {
    variant: 'recipe' | 'trial' | 'cookCounter' | 'search' | 'bookmark'
    visible: boolean
    numberOfSkeletons?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        recipe: {
            [theme.breakpoints.only('xs')]: {
                height: 296,
            },
            [theme.breakpoints.only('sm')]: {
                height: 200,
            },
            [theme.breakpoints.up('md')]: {
                height: 250,
            },
            width: '100%',
        },
        trial: {
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
        },
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

        search: {
            width: '100%',
            height: 50,
        },
        bookmark: {
            [theme.breakpoints.down('xs')]: {
                width: 340,
            },
            [theme.breakpoints.up('sm')]: {
                width: 600,
            },
            height: 600,
        },
    })
)

const Skeletons = ({ visible, numberOfSkeletons, variant }: Props) => {
    const classes = useStyles()
    const { gridBreakpointProps } = useGridContext()

    if (!visible) return <></>

    return (
        <>
            {variant !== 'search'
                ? new Array(numberOfSkeletons || 12).fill(1).map((_skeleton, index) => (
                      <Grid {...gridBreakpointProps} item key={index}>
                          <Grid container spacing={2} justify="space-between" alignItems="center">
                              <Grid xs={12} item>
                                  <Card>
                                      <Skeleton className={classes[variant]} variant="rect" />
                                  </Card>
                              </Grid>
                          </Grid>
                      </Grid>
                  ))
                : new Array(numberOfSkeletons || 12).fill(1).map((_skeleton, index) => (
                      <ListItem key={index}>
                          <ListItemText
                              primary={<Skeleton width="30%" />}
                              secondary={
                                  <>
                                      <Skeleton width="60%" />
                                      <Skeleton width="80%" />
                                  </>
                              }
                          />
                      </ListItem>
                  ))}
        </>
    )
}

export default Skeletons
