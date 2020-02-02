import {
    Button,
    ButtonGroup,
    createStyles,
    Grid,
    makeStyles,
    Typography,
    Zoom,
} from '@material-ui/core'
import DescIcon from '@material-ui/icons/ArrowDownwardRounded'
import AscIcon from '@material-ui/icons/ArrowUpwardRounded'
import React from 'react'

import { OrderByRecord } from '../../model/model'
import configService from '../../services/configService'
import CategoryWrapper from '../Category/CategoryWrapper'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        buttonGroupText: {
            '&:not(:first-child), &:not(:last-child)': {
                borderRight: 'none',
                borderBottom: 'none',
            },
        },
        buttonGroupRoot: {
            borderRadius: 20,
            height: 40,
            boxShadow: theme.shadows[6],
        },
        button: {
            borderRadius: 20,
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
    const { isMobile } = useBreakpointsContext()

    const getStartIcon = (orderBy?: 'asc' | 'desc') => {
        if (!orderBy) return {}

        return {
            startIcon: <Zoom in>{orderBy === 'asc' ? <AscIcon /> : <DescIcon />}</Zoom>,
        }
    }

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
            <Grid item xs={6}>
                <Typography variant="h4">Rezeptauswahl</Typography>
            </Grid>
            <Grid item>
                <ButtonGroup
                    size={isMobile ? 'small' : 'medium'}
                    classes={{
                        groupedTextHorizontal: classes.buttonGroupText,
                        groupedTextVertical: classes.buttonGroupText,
                        root: classes.buttonGroupRoot,
                    }}
                    variant="contained">
                    <Button
                        className={classes.button}
                        onClick={handleOrderByChange('name')}
                        color={orderBy.name ? 'primary' : 'default'}
                        {...getStartIcon(orderBy.name)}>
                        Name
                    </Button>
                    <Button
                        className={classes.button}
                        onClick={handleOrderByChange('createdDate')}
                        color={orderBy.createdDate ? 'primary' : 'default'}
                        {...getStartIcon(orderBy.createdDate)}>
                        Datum
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
                <CategoryWrapper
                    selectedCategories={selectedCategories}
                    onCategoryChange={onSelectedCategoriesChange}
                />
            </Grid>
        </>
    )
}

export default HomeRecipeSelection
