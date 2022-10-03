import { Button, ButtonProps, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ChevronDown } from 'mdi-material-ui'
import { Children, ReactNode, ReactText, useCallback, useMemo, useState } from 'react'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { GridLayout, useGridContext } from '@/Components/Provider/GridProvider'

import EntryGridContainer from './EntryGridContainer'

interface StyleProps extends Pick<Props, 'itemHeight' | 'rows'> {
    gridItems: number
    gridLayout: GridLayout
}

const useStyles = makeStyles(theme => ({
    container: {
        overflowY: 'hidden',
        height: ({ itemHeight, rows }: StyleProps) => (rows ? rows * itemHeight : itemHeight),
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.easeOut,
        }),
    },
    containerExpanded: {
        [theme.breakpoints.between('xs', 'sm')]: {
            height: ({ gridItems, itemHeight }: StyleProps) => gridItems * itemHeight,
        },
        [theme.breakpoints.between('md', 'lg')]: {
            height: ({ gridItems, gridLayout, itemHeight }: StyleProps) =>
                gridLayout === 'list'
                    ? gridItems * itemHeight
                    : Math.ceil(gridItems / 2) * itemHeight,
        },
        [theme.breakpoints.up('xl')]: {
            height: ({ gridItems, gridLayout, itemHeight }: StyleProps) =>
                gridLayout === 'list'
                    ? gridItems * itemHeight
                    : Math.ceil(gridItems / 3) * itemHeight,
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
}))

interface Props {
    titles: { header?: ReactText; expanded: ReactText; notExpanded: ReactText }
    itemHeight: number
    rows?: number
    children: ReactNode
    onExpandedChange?: (expanded: boolean) => void
}

const ExpandableGridContainer = ({
    titles,
    children,
    onExpandedChange,
    itemHeight,
    rows,
}: Props) => {
    const [expanded, setExpanded] = useState(false)

    const gridItems = useMemo(() => Children.toArray(children).length, [children])
    const { gridLayout } = useGridContext()
    const classes = useStyles({ gridLayout, gridItems, itemHeight, rows })
    const { isMobile } = useBreakpointsContext()

    const handleExpandBtnChange = useCallback(() => {
        setExpanded(!expanded)
        if (onExpandedChange) onExpandedChange(!expanded)
    }, [expanded, onExpandedChange])

    const chevron = useMemo(
        () => <ChevronDown className={clsx(classes.hidden, expanded && classes.expanded)} />,
        [classes.expanded, classes.hidden, expanded]
    )

    const sharedExpandBtnProps: Pick<ButtonProps, 'disabled' | 'onClick'> = useMemo(
        () => ({
            disabled: gridItems === 0,
            onClick: handleExpandBtnChange,
        }),
        [gridItems, handleExpandBtnChange]
    )

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h4">{titles.header}</Typography>
                    </Grid>

                    <Grid item>
                        {isMobile ? (
                            <IconButton {...sharedExpandBtnProps}>{chevron}</IconButton>
                        ) : (
                            <Button
                                {...sharedExpandBtnProps}
                                variant="contained"
                                startIcon={chevron}>
                                {expanded ? titles.expanded : titles.notExpanded}
                            </Button>
                        )}
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
    )
}

export default ExpandableGridContainer
