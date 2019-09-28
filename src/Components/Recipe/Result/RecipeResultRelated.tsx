import React, { FC } from "react";
import { Grid, Chip, Box, makeStyles, createStyles } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/LinkTwoTone";
import { CategoryBase } from "../../Category/CategoryBase";
import { useDraggableRecipesContext } from "../../Provider/DraggableRecipesProvider";
import { useRouterContext } from "../../Provider/RouterProvider";
import { PATHS } from "../../Routes/Routes";
import clsx from "clsx";
import { useBreakpointsContext } from "../../Provider/BreakpointsProvider";

const useStyles = makeStyles(theme =>
    createStyles({
        selectedChip: {
            boxShadow: theme.shadows[8]
        }
    })
);

export const RecipeResultRelated: FC<{ relatedRecipes: Array<string> }> = ({ relatedRecipes }) => {
    const { handleDraggableChange, draggableContains } = useDraggableRecipesContext();
    const { isMobile } = useBreakpointsContext();
    const { history } = useRouterContext();

    const classes = useStyles();

    const handleRecipeClick = (recipeName: string) => () => {
        if (isMobile) history.push(PATHS.details(recipeName));
        else handleDraggableChange(recipeName);
    };

    return (
        <Box position="relative">
            <Grid container spacing={2} alignItems="center">
                {relatedRecipes.map(recipeName => (
                    <Grid key={recipeName} item>
                        <CategoryBase onClick={handleRecipeClick(recipeName)}>
                            <Chip
                                className={clsx(
                                    draggableContains(recipeName) && classes.selectedChip
                                )}
                                icon={<LinkIcon />}
                                label={recipeName}
                            />
                        </CategoryBase>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
