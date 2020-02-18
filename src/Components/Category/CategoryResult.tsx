import { Chip, ChipProps, Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { Categories } from '../../model/model'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { iconFromCategory } from './CategoryWrapper'

interface CategoryResultProps extends Pick<ChipProps, 'color'> {
    categories: Categories<string>
    fullWidth?: boolean
}

export const CategoryResult: FC<CategoryResultProps> = ({ categories, color }) => {
    const { isLowRes } = useBreakpointsContext()

    return (
        <Grid container spacing={1} justify={isLowRes ? 'center' : 'flex-start'}>
            {Object.keys(categories).map(type => (
                <Grid item key={type}>
                    {categories[type].length > 0 && (
                        <Chip
                            style={{ width: 130 }}
                            icon={iconFromCategory(categories[type])}
                            size="small"
                            color={color}
                            label={categories[type]}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    )
}
