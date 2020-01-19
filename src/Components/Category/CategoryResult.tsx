import { Chip, createStyles, Grid, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC, useMemo, useState } from 'react'

import { Categories } from '../../model/model'
import { stopPropagationProps } from '../../util/constants'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import { iconFromCategory } from './CategoryWrapper'

interface CategoryResultProps {
    categories: Categories<string>
    fullWidth?: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        chipRoot: {
            transition: theme.transitions.create('max-width', {
                duration: theme.transitions.duration.complex,
            }),
        },
        // ? to make the transition work we need to set values for all breakpoints
        chipPreview: {
            [theme.breakpoints.down(426)]: {
                maxWidth: theme.spacing(6),
            },
            [theme.breakpoints.up(426)]: {
                maxWidth: theme.spacing(30),
            },
        },
        chipFocused: {
            maxWidth: theme.spacing(30),
        },
    })
)

export const CategoryResult: FC<CategoryResultProps> = ({ categories }) => {
    const { isMobile } = useBreakpointsContext()
    const { categoriesCollection } = useCategoriesCollectionContext()
    const initialChipFocus = useMemo(
        () =>
            Object.keys(categoriesCollection).reduce((accumulator, currentKey) => {
                accumulator[currentKey] = false
                return accumulator
            }, {} as Categories<boolean>),
        [categoriesCollection]
    )
    const [chipFocus, setChipFocus] = useState<Categories<boolean>>(initialChipFocus)

    const classes = useStyles()

    const handleChipClick = (type: string) => () => {
        setChipFocus(prev => ({ ...initialChipFocus, [type]: !prev[type] }))
    }

    return (
        <Grid container spacing={1} wrap="nowrap">
            {Object.keys(categories).map(type => (
                <Grid item key={type} {...stopPropagationProps}>
                    {categories[type].length > 0 && (
                        <Chip
                            {...(isMobile ? { onClick: handleChipClick(type) } : {})}
                            classes={{
                                sizeSmall: clsx(
                                    classes.chipRoot,
                                    chipFocus[type] ? classes.chipFocused : classes.chipPreview
                                ),
                            }}
                            icon={iconFromCategory(categories[type])}
                            size="small"
                            color="secondary"
                            label={categories[type]}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    )
}
