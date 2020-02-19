import { Chip, ChipProps, createStyles, Grid, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

import { Categories } from '../../model/model'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { iconFromCategory } from './CategoryWrapper'

interface CategoryResultProps extends Pick<ChipProps, 'color'> {
    categories: Categories<string>
    fullWidth?: boolean
}

interface StyleProps {
    fixedWidth: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        chip: {
            width: ({ fixedWidth }: StyleProps) => (fixedWidth ? 130 : 'inherit'),
        },
    })
)

export const CategoryResult: FC<CategoryResultProps> = ({ categories, color }) => {
    const { isLowRes } = useBreakpointsContext()
    const classes = useStyles({ fixedWidth: isLowRes })

    return (
        <Grid container spacing={1} justify={isLowRes ? 'center' : 'flex-start'}>
            {Object.keys(categories).map(type => (
                <Grid item key={type}>
                    {categories[type].length > 0 && (
                        <Chip
                            className={classes.chip}
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
