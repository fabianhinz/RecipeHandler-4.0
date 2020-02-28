import { Button, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import clsx from 'clsx'
import React from 'react'

import { OrderByRecord } from '../../model/model'
import configService from '../../services/configService'
import CategorySelection from '../Category/CategorySelection'

const useStyles = makeStyles(theme =>
    createStyles({
        orderByAsc: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.complex,
            }),
        },
        orderByDesc: {
            transform: 'rotate(180deg)',
        },
    })
)

interface Props {
    selectedCategories: Map<string, string>
    onSelectedCategoriesChange: (type: string, value: string) => void
    orderBy: OrderByRecord
    onOrderByChange: (orderBy: OrderByRecord) => void
}

const HomeRecipeSelection = ({
    onSelectedCategoriesChange,
    selectedCategories,
    orderBy,
    onOrderByChange,
}: Props) => {
    const classes = useStyles()

    const handleOrderByChange = (key: keyof OrderByRecord) => () => {
        let newOrderBy: OrderByRecord

        if (orderBy[key] === 'asc') newOrderBy = { [key]: 'desc' }
        else if (orderBy[key] === 'desc') newOrderBy = { [key]: 'asc' }
        else newOrderBy = { [key]: 'asc' }

        onOrderByChange(newOrderBy)
        configService.orderBy = newOrderBy
    }

    return (
        <>
            <Grid item>
                <Typography gutterBottom display="inline" variant="h4">
                    Rezeptauswahl
                </Typography>
            </Grid>
            <Grid item>
                <CategorySelection
                    onCategoryChange={onSelectedCategoriesChange}
                    selectedCategories={selectedCategories}
                    label="Filter"
                    header={
                        <Grid justify="center" wrap="nowrap" container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleOrderByChange('name')}
                                    color={orderBy.name ? 'primary' : 'default'}
                                    startIcon={
                                        <ArrowUpwardIcon
                                            className={clsx(
                                                classes.orderByAsc,
                                                orderBy.name === 'desc' && classes.orderByDesc
                                            )}
                                        />
                                    }>
                                    Name
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleOrderByChange('createdDate')}
                                    color={orderBy.createdDate ? 'primary' : 'default'}
                                    startIcon={
                                        <ArrowUpwardIcon
                                            className={clsx(
                                                classes.orderByAsc,
                                                orderBy.createdDate === 'desc' &&
                                                    classes.orderByDesc
                                            )}
                                        />
                                    }>
                                    Datum
                                </Button>
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
        </>
    )
}

export default HomeRecipeSelection
