import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    createStyles,
    Grid,
    Grow,
    makeStyles,
    Zoom,
} from '@material-ui/core'
import DescIcon from '@material-ui/icons/ArrowDownwardRounded'
import AscIcon from '@material-ui/icons/ArrowUpwardRounded'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { AttachmentMetadata, Recipe } from '../../model/model'
import configService from '../../services/configService'
import RecipeResult from '../Recipe/Result/RecipeResult'

export type OrderByKey = keyof Pick<Recipe<AttachmentMetadata>, 'name' | 'createdDate'>
export type OrderByRecord = Partial<Record<OrderByKey, 'asc' | 'desc'>>

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachmentMetadata>>
    skeletons: boolean
    orderBy: OrderByRecord
    onOrderByChange: (orderBy: OrderByRecord) => void
}

const useStyles = makeStyles(() =>
    createStyles({
        buttonGroupText: {
            '&:not(:first-child), &:not(:last-child)': {
                borderRight: 'none',
                borderBottom: 'none',
            },
        },
        buttonGroupRoot: {
            boxShadow: 'none',
        },
    })
)

export const HomeRecipe = ({ recipes, skeletons, orderBy, onOrderByChange }: HomeRecipeProps) => {
    const classes = useStyles()

    const handleOrderByChange = (key: keyof OrderByRecord) => () => {
        let newOrderBy: OrderByRecord

        if (orderBy[key] && orderBy[key] === 'asc') newOrderBy = { [key]: 'desc' }
        else if (orderBy[key] && orderBy[key] === 'desc') newOrderBy = { [key]: 'asc' }
        else newOrderBy = { [key]: 'asc' }

        onOrderByChange(newOrderBy)
        configService.orderBy = newOrderBy
    }

    const getStartIcon = (orderBy?: 'asc' | 'desc') => {
        if (!orderBy) return {}

        return {
            startIcon: <Zoom in>{orderBy === 'asc' ? <AscIcon /> : <DescIcon />}</Zoom>,
        }
    }

    return (
        <Card>
            <CardActions>
                <Box display="flex" justifyContent="center" flexGrow={1}>
                    <ButtonGroup
                        classes={{
                            groupedTextHorizontal: classes.buttonGroupText,
                            groupedTextVertical: classes.buttonGroupText,
                            root: classes.buttonGroupRoot,
                        }}
                        variant="contained">
                        <Button
                            onClick={handleOrderByChange('name')}
                            color={orderBy.name ? 'primary' : 'default'}
                            {...getStartIcon(orderBy.name)}>
                            Name
                        </Button>
                        <Button
                            onClick={handleOrderByChange('createdDate')}
                            color={orderBy.createdDate ? 'primary' : 'default'}
                            {...getStartIcon(orderBy.createdDate)}>
                            Datum
                        </Button>
                    </ButtonGroup>
                </Box>
            </CardActions>
            <CardContent>
                <Grid container spacing={2}>
                    {recipes.map(recipe => (
                        <Grid xs={12} item key={recipe.name}>
                            <RecipeResult
                                variant="summary"
                                recipe={recipe}
                                divider={recipe.name !== recipes[recipes.length - 1].name}
                            />
                        </Grid>
                    ))}

                    {skeletons &&
                        recipes.length === 0 &&
                        new Array(8).fill(1).map((_skeleton, index) => (
                            <Grid xs={12} item key={index}>
                                <Grid
                                    container
                                    spacing={2}
                                    justify="space-between"
                                    alignItems="center">
                                    <Grid xs={12} item>
                                        <Skeleton width="100%" height={111} variant="rect" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                    {!skeletons && recipes.length === 0 && (
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <Grow in timeout={500}>
                                    <NotFoundIcon width={200} />
                                </Grow>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    )
}
