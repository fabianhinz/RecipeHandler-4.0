import React, { FC, useState, useContext } from "react";
import {
    makeStyles,
    createStyles,
    Paper,
    IconButton,
    Grow,
    useMediaQuery
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import TouchIcon from "@material-ui/icons/TouchAppTwoTone";
import Draggable from "react-draggable";
import { useRecipeDoc } from "../../hooks/useRecipeDoc";
import RecipeResult from "../Recipe/Result/RecipeResult";
import { Loading } from "../Shared/Loading";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { BadgeWrapper } from "../Shared/BadgeWrapper";

type DraggableRecipesState = {
    draggableContains: (recipeName: string) => boolean;
    handleDraggableChange: (recipeName: string) => void;
};

const Context = React.createContext<DraggableRecipesState | null>(null);

export const useDraggableRecipesContext = () => useContext(Context) as DraggableRecipesState;

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            boxShadow: theme.shadows[8],
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
        btnContainer: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: theme.spacing(1),
            right: theme.spacing(1)
        },
        activeRecipe: {
            zIndex: theme.zIndex.appBar + 2
        },
        draggable: {
            cursor: "move"
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

    const minWidth = useMediaQuery("(min-width: 768px)");

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

    const draggableContains = (recipeName: string) => draggableRecipes.has(recipeName);

    return (
        <Context.Provider value={{ handleDraggableChange, draggableContains }}>
            {children}
            {minWidth &&
                [...draggableRecipes.values()].map((recipeName, index) => (
                    <Draggable
                        key={recipeName}
                        handle=".draggableHandler"
                        defaultClassName={classes.draggableContainer}
                        defaultClassNameDragged={clsx(
                            activeRecipe === recipeName && classes.activeRecipe
                        )}
                    >
                        <div>
                            <Grow in>
                                <BadgeWrapper
                                    badgeContent={`${index + 1}/${draggableRecipes.size}`}
                                >
                                    <Paper
                                        className={classes.paper}
                                        onClick={() => setActiveRecipe(recipeName)}
                                    >
                                        <div className={classes.btnContainer}>
                                            <IconButton
                                                onClick={handleCloseBtnClick(recipeName)}
                                                size="small"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                className={clsx(
                                                    classes.draggable,
                                                    "draggableHandler"
                                                )}
                                            >
                                                <TouchIcon />
                                            </IconButton>
                                        </div>

                                        <SelectedRecipe recipeName={recipeName} />
                                    </Paper>
                                </BadgeWrapper>
                            </Grow>
                        </div>
                    </Draggable>
                ))}
        </Context.Provider>
    );
};
