import { Chip, Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { Categories } from '../../model/model'
import { stopPropagationProps } from '../../util/constants'
import { iconFromCategory } from './CategoryWrapper'

interface CategoryResultProps {
    categories: Categories<string>
    fullWidth?: boolean
}

export const CategoryResult: FC<CategoryResultProps> = ({ categories }) => (
    <Grid container spacing={1}>
        {Object.keys(categories).map(type => (
            <Grid item key={type} {...stopPropagationProps}>
                {categories[type].length > 0 && (
                    <Chip
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
