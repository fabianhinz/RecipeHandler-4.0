import brown from "@material-ui/core/colors/brown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
import React, { FC } from "react";
import { AttachementMetadata, Recipe } from "../../util/Mock";
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
import { BadgeRating } from "../../util/BadgeRating";
import { PATHS } from "../../routes/Routes";
import { RecipeResult } from "../recipe/result/RecipeResult";
import { useRouter } from "../../routes/RouterContext";

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === "light" ? brown[200] : brown[400];

    return createStyles({
        avatar: {
            background,
            color: theme.palette.getContrastText(background)
        }
    });
});

export const HomeRecipeResultsPanel: FC<Recipe<AttachementMetadata>> = props => {
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
                                    {props.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Typography variant="button">
                                    {props.name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <BadgeRating />
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <RecipeResult {...props} />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
                <Button onClick={() => history.push(PATHS.recipeEdit(props.name), props)}>
                    Bearbeiten
                </Button>
            </ExpansionPanelActions>
        </ExpansionPanel >
    )
}