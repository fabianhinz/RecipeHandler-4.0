import { Button, createStyles, Grid, makeStyles, Typography, useTheme } from '@material-ui/core'
import clsx from 'clsx'
import { ChevronDown } from 'mdi-material-ui'
import React, { ReactNode, ReactText, useMemo, useState } from 'react'

import { GridLayout, useGridContext } from '../Provider/GridProvider'
import EntryGridContainer from './EntryGridContainer'

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
                height: ({ gridItems, gridLayout }: StyleProps) => {
                    console.log(gridItems)
                    return gridLayout === 'list' ? gridItems * 72 : Math.ceil(gridItems / 2) * 72
                },
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
        expandableGridContainer: {
            padding: theme.spacing(2),
        },
    })
)

interface Props {
    titles: { header: ReactText; expanded: ReactText; notExpanded: ReactText }
    children: ReactNode
    onExpandedChange?: (expanded: boolean) => void
}

const ExpandableGridContainer = ({ titles, children, onExpandedChange }: Props) => {
    const [expanded, setExpanded] = useState(false)

    const gridItems = useMemo(() => React.Children.toArray(children).length, [children])
    const { gridLayout } = useGridContext()
    const classes = useStyles({ gridLayout, gridItems })

    const theme = useTheme()

    const handleExpandBtnChange = () => {
        setExpanded(!expanded)
        if (onExpandedChange) onExpandedChange(!expanded)
    }

    return (
        <div className={classes.expandableGridContainer}>
            <EntryGridContainer>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h4">{titles.header}</Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={gridItems === 0}
                                onClick={handleExpandBtnChange}
                                variant={theme.palette.type === 'dark' ? 'outlined' : 'contained'}
                                startIcon={
                                    <ChevronDown
                                        className={clsx(
                                            classes.hidden,
                                            expanded && classes.expanded
                                        )}
                                    />
                                }>
                                {expanded ? titles.expanded : titles.notExpanded}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid
                        container
                        className={clsx(classes.container, expanded && classes.containerExpanded)}
                        spacing={3}>
                        {children}
                    </Grid>
                </Grid>
            </EntryGridContainer>
        </div>
    )
}

export default ExpandableGridContainer
