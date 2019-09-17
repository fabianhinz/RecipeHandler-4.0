import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRight from "@material-ui/icons/ChevronRightTwoTone";
import React, {
    FC,
    useCallback,
    useEffect,
    useState
    } from "react";
import { AttachementMetadata, Recipe } from "../../util/Mock";
import {
    Box,
    ButtonBase,
    Grid,
    Paper,
    Typography
    } from "@material-ui/core";
import { HomeRecipeResultsPanel } from "./HomeRecipeResultsPanel";


interface HomeRecipeResultsProps {
    recipes: Array<Recipe<AttachementMetadata>>
}

export const HomeRecipeResults: FC<HomeRecipeResultsProps> = props => {
    const [page, setPage] = useState({ label: 1, offset: 0 });
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
                {recipes.map(recipe => (
                    <HomeRecipeResultsPanel key={recipe.name} {...recipe} />
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
