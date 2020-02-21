import { Chip, ChipProps, createStyles, Grid, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

import { Categories } from '../../model/model'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import getIconByCategory from './CategoryIcons'

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    })
)

interface CategoryResultProps extends Pick<ChipProps, 'color' | 'variant' | 'size'> {
    categories: Categories<string>
}

export const CategoryResult: FC<CategoryResultProps> = ({ categories, ...chipProps }) => {
    const classes = useStyles()
    const { isMobile } = useBreakpointsContext()

    return (
        <Grid
            container
            wrap={isMobile ? 'nowrap' : 'wrap'}
            className={classes.container}
            spacing={1}>
            {Object.keys(categories).map(type => (
                <Grid item key={type}>
                    {categories[type].length > 0 && (
                        <Chip
                            icon={getIconByCategory(categories[type])}
                            label={categories[type]}
                            {...chipProps}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    )
}
