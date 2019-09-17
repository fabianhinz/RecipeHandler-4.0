import brown from "@material-ui/core/colors/brown";
import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRight from "@material-ui/icons/ChevronRightTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
import React, {
    FC,
    useCallback,
    useEffect,
    useState
    } from "react";
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    createStyles,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    makeStyles,
    Paper,
    Typography
    } from "@material-ui/core";
import { BadgeRating } from "../../util/BadgeRating";
import { PATHS } from "../../routes/Routes";
import { Recipe } from "../../util/Mock";
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

export const HomeRecipeResults: FC<{ recipes: Array<Recipe> }> = props => {
    const { history } = useRouter();
    const [page, setPage] = useState({ label: 1, offset: 0 });
    const classes = useStyles();
    // ! ToDo change this
    const recipes = props.recipes.slice(page.offset, page.offset + 4);
    const isUpDisabled = recipes.length < 4;
    const isDownDisabled = page.label === 1;

    const handlePageChange = useCallback(
        (change: "up" | "down") => () => {
            if (change === "up" && !isUpDisabled)
                setPage(previous => ({
                    label: ++previous.label,
                    offset: previous.offset + 4
                }));
            if (change === "down" && !isDownDisabled)
                setPage(previous => ({
                    label: --previous.label,
                    offset: previous.offset - 4
                }));
        },
        [isDownDisabled, isUpDisabled]
    );

    const rightLeftHandler = useCallback(
        (event: KeyboardEvent) => {
            if (event.code === "ArrowLeft") handlePageChange("down")();
            if (event.code === "ArrowRight") handlePageChange("up")();
        },
        [handlePageChange]
    );

    useEffect(() => {
        document.addEventListener("keydown", rightLeftHandler);

        return () => {
            document.removeEventListener("keydown", rightLeftHandler);
        };
    }, [rightLeftHandler]);

    return (
        <Box margin={2}>
            <div>
                {recipes.map(recipeProps => (
                    <ExpansionPanel
                        key={recipeProps.name}
                        TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
                    >
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
                                                {recipeProps.name.slice(0, 1).toUpperCase()}
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="button">
                                                {recipeProps.name}
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
                            <RecipeResult {...recipeProps} />
                        </ExpansionPanelDetails>
                        <ExpansionPanelActions>
                            <Button
                                onClick={() =>
                                    history.push(PATHS.recipeEdit(recipeProps.name), recipeProps)
                                }
                            >
                                Bearbeiten
              </Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                ))}
            </div>

            <Box margin={1}>
                <Grid container justify="center">
                    <Paper>
                        <Grid container spacing={1}>
                            <Grid item>
                                <ButtonBase
                                    disabled={isDownDisabled}
                                    onClick={handlePageChange("down")}
                                >
                                    <ChevronLeft />
                                </ButtonBase>
                            </Grid>
                            <Grid item>
                                <Typography>{page.label}</Typography>
                            </Grid>
                            <Grid item>
                                <ButtonBase
                                    disabled={isUpDisabled}
                                    onClick={handlePageChange("up")}
                                >
                                    <ChevronRight />
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Box>
        </Box>
    );
};
