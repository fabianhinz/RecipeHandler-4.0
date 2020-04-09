import { Chip, ChipProps, Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { Categories } from '../../model/model'
import getIconByCategory from './CategoryIcons'

interface CategoryResultProps extends Pick<ChipProps, 'color' | 'variant' | 'size'> {
    categories: Categories<string>
}

export const CategoryResult: FC<CategoryResultProps> = ({ categories, ...chipProps }) => (
    <Grid container spacing={1}>
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
