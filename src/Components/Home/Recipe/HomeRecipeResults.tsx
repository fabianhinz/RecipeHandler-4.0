import {
    Avatar,
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core'
import brown from '@material-ui/core/colors/brown'
import React, { FC, memo } from 'react'

import { AttachementMetadata, Recipe } from '../../../model/model'
import { RecipeResultAction } from '../../Recipe/Result/Action/RecipeResultAction'
import RecipeResult from '../../Recipe/Result/RecipeResult'

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === 'light' ? brown[200] : brown[400]

    return createStyles({
        avatar: {
            background,
            color: theme.palette.getContrastText(background),
        },
    })
})

interface HomeRecipeResultsProps {
    recipe: Recipe<AttachementMetadata>
}

const HomeRecipeResults: FC<HomeRecipeResultsProps> = props => {
    const classes = useStyles()

    return (
        <ExpansionPanel TransitionProps={{ mountOnEnter: true }}>
            <ExpansionPanelSummary>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                    justify="space-between"
                    alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2} alignItems="center" wrap="nowrap">
                            <Grid item>
                                <Avatar className={classes.avatar}>
                                    {props.recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            </Grid>
                            <Grid item zeroMinWidth>
                                <Typography noWrap>{props.recipe.name}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={1} justify="flex-end">
                            <RecipeResultAction
                                name={props.recipe.name}
                                numberOfComments={props.recipe.numberOfComments}
                                actionProps={{ actionsEnabled: true, draggEnabled: false }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <RecipeResult
                    actionProps={{ actionsEnabled: false, draggEnabled: false }}
                    recipe={props.recipe}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default memo(HomeRecipeResults, (prev, next) => prev.recipe === next.recipe)
