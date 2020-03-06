import {
    Card,
    createStyles,
    Grid,
    GridSize,
    ListItem,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { FirebaseService } from '../../services/firebase'
import { useGridContext } from '../Provider/GridProvider'

interface Props {
    variant: 'recipe' | 'trial' | 'cookCounter' | 'search' | 'bookmark' | 'trialsSelection'
    visible: boolean
    numberOfSkeletons?: number
}

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
            [theme.breakpoints.only('xs')]: {
                height: 224,
            },
            [theme.breakpoints.only('sm')]: {
                height: 184,
            },
            [theme.breakpoints.only('md')]: {
                height: 224,
            },
            [theme.breakpoints.only('lg')]: {
                height: 184,
            },
            [theme.breakpoints.only('xl')]: {
                height: 224,
            },
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
})

const Skeletons = ({ visible, numberOfSkeletons, variant }: Props) => {
    const classes = useStyles()
    const { gridBreakpointProps } = useGridContext()

    if (!visible) return <></>

    const variantAvareBreakpoints: Partial<Record<Breakpoint, boolean | GridSize>> =
        variant === 'trialsSelection' ? { xs: 12 } : gridBreakpointProps

    return (
        <>
            {variant === 'search'
                ? new Array(numberOfSkeletons || FirebaseService.QUERY_LIMIT)
                      .fill(1)
                      .map((_skeleton, index) => (
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
                      ))
                : new Array(numberOfSkeletons || FirebaseService.QUERY_LIMIT)
                      .fill(1)
                      .map((_skeleton, index) => (
                          <Grid {...variantAvareBreakpoints} item key={index}>
                              <Grid
                                  container
                                  spacing={2}
                                  justify="space-between"
                                  alignItems="center">
                                  <Grid xs={12} item>
                                      <Card>
                                          <Skeleton className={classes[variant]} variant="rect" />
                                      </Card>
                                  </Grid>
                              </Grid>
                          </Grid>
                      ))}
        </>
    )
}

export default Skeletons
