import React, { FC, useState, useContext } from "react";
import { makeStyles, createStyles, Paper, Box, IconButton, Grow } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import Draggable from "react-draggable";
import { useRecipeDoc } from "../../hooks/useRecipeDoc";
import RecipeResult from "../Recipe/Result/RecipeResult";
import { Loading } from "../Shared/Loading";
import clsx from "clsx";
import { useSnackbar } from "notistack";

type DraggableRecipesState = {
    handleDraggableChange: (recipeName: string) => void;
};

const Context = React.createContext<DraggableRecipesState | null>(null);

export const useDraggableRecipesContext = () => useContext(Context) as DraggableRecipesState;

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            position: "relative",
            padding: theme.spacing(2),
            height: "50vh",
            overflow: "auto",
            width: 320
        },
        draggableContainer: {
            zIndex: theme.zIndex.appBar + 1,
            position: "fixed",
            right: theme.spacing(2),
            bottom: theme.spacing(2)
        },
        closeBtn: {
            position: "fixed",
            top: theme.spacing(1),
            right: theme.spacing(1)
        },
        activeRecipe: {
            zIndex: theme.zIndex.appBar + 2
        }
    })
);

const SelectedRecipe: FC<{ recipeName: string | null }> = ({ recipeName }) => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ recipeName });
    return <>{recipeDocLoading ? <Loading /> : <RecipeResult fromRelated recipe={recipeDoc} />}</>;
};

export const DraggableRecipesProvider: FC = ({ children }) => {
    const [draggableRecipes, setDraggableRecipes] = useState<Set<string>>(new Set());
    const [activeRecipe, setActiveRecipe] = useState("");
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const handleDraggableChange = (recipeName: string) => {
        setDraggableRecipes(previous => {
            if (previous.has(recipeName)) {
                previous.delete(recipeName);
            } else if (draggableRecipes.size === 4) {
                enqueueSnackbar("mehr als 4 'passt gut zu' Rezepte sind nicht erlaubt", {
                    variant: "info"
                });
                return new Set(previous);
            } else {
                previous.add(recipeName);
            }
            return new Set(previous);
        });
    };

    const handleCloseBtnClick = (recipeName: string) => (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        handleDraggableChange(recipeName);
    };

    return (
        <Context.Provider value={{ handleDraggableChange }}>
            {children}
            {[...draggableRecipes.values()].map((recipeName, index) => (
                <Draggable
                    key={recipeName}
                    cancel=".closeBtn"
                    defaultClassName={classes.draggableContainer}
                    defaultClassNameDragged={clsx(
                        activeRecipe === recipeName && classes.activeRecipe
                    )}
                >
                    <Box marginRight={index + 1} marginBottom={index + 1}>
                        <Grow in>
                            <Paper
                                className={clsx(classes.paper)}
                                onClick={() => setActiveRecipe(recipeName)}
                            >
                                <IconButton
                                    onClick={handleCloseBtnClick(recipeName)}
                                    className={clsx(classes.closeBtn, "closeBtn")}
                                    size="small"
                                >
                                    <CancelIcon />
                                </IconButton>
                                <SelectedRecipe recipeName={recipeName} />
                            </Paper>
                        </Grow>
                    </Box>
                </Draggable>
            ))}
        </Context.Provider>
    );
};
