import {
    Avatar,
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Hidden,
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
                    <Grid item>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar className={classes.avatar}>
                                    {props.recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            </Grid>
                            <Hidden xsDown>
                                <Grid item>
                                    <Typography>{props.recipe.name}</Typography>
                                </Grid>
                            </Hidden>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1}>
                            <RecipeResultAction
                                name={props.recipe.name}
                                numberOfComments={props.recipe.numberOfComments}
                                source="fromExpansionSummary"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <RecipeResult recipe={props.recipe} source="fromExpansionSummary" />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default memo(HomeRecipeResults, (prev, next) => prev.recipe === next.recipe)
