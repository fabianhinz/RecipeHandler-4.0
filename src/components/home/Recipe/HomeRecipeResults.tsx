import brown from "@material-ui/core/colors/brown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
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
    Typography
} from "@material-ui/core";
import { RecipeResult } from "../../Recipe/Result/RecipeResult";
import { useRouter } from "../../Routes/RouterContext";
import { Recipe, AttachementMetadata } from "../../../model/model";
import { BadgeRating } from "../../Shared/BadgeRating";
import { PATHS } from "../../Routes/Routes";

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
    const { history } = useRouter();
    const classes = useStyles();

    return (
        <ExpansionPanel TransitionProps={{ mountOnEnter: true }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
                            <Grid item>
                                <Typography variant="button">{props.recipe.name}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <BadgeRating name={props.recipe.name} />
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <RecipeResult {...props.recipe} />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
                <Button onClick={() => history.push(PATHS.recipeEdit(props.recipe.name), props)}>
                    Bearbeiten
                </Button>
            </ExpansionPanelActions>
        </ExpansionPanel>
    );
};
