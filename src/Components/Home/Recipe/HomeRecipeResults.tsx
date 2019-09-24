import brown from "@material-ui/core/colors/brown";
import React, { FC } from "react";
import {
    Avatar,
    Button,
    createStyles,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    makeStyles,
    Typography,
    Hidden
} from "@material-ui/core";
import { RecipeResult } from "../../Recipe/Result/RecipeResult";
import { Recipe, AttachementMetadata } from "../../../model/model";
import { BadgeRating } from "../../Shared/BadgeRating";
import { PATHS } from "../../Routes/Routes";
import { useRouterContext } from "../../Provider/RouterProvider";
import { useFirebaseAuthContext } from "../../Provider/FirebaseAuthProvider";
import { Comments } from "../../Shared/Comments";
import { Share } from "../../Shared/Share";

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === "light" ? brown[200] : brown[400];

    return createStyles({
        avatar: {
            background,
            color: theme.palette.getContrastText(background)
        }
    });
});

interface HomeRecipeResultsProps {
    recipe: Recipe<AttachementMetadata>;
}

export const HomeRecipeResults: FC<HomeRecipeResultsProps> = props => {
    const { user } = useFirebaseAuthContext();
    const { history } = useRouterContext();
    const classes = useStyles();

    return (
        <ExpansionPanel TransitionProps={{ mountOnEnter: true }}>
            <ExpansionPanelSummary>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                    justify="space-between"
                    alignItems="center"
                >
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
                            <Grid item>
                                <Share name={props.recipe.name} />
                            </Grid>
                            <Grid item>
                                <Comments name={props.recipe.name} />
                            </Grid>
                            <Grid item>
                                <BadgeRating name={props.recipe.name} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <RecipeResult recipe={props.recipe} />
            </ExpansionPanelDetails>
            {user && (
                <ExpansionPanelActions>
                    <Button
                        onClick={() => history.push(PATHS.recipeEdit(props.recipe.name), props)}
                    >
                        Bearbeiten
                    </Button>
                </ExpansionPanelActions>
            )}
        </ExpansionPanel>
    );
};
