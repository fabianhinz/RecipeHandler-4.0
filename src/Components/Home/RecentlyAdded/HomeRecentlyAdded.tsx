import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    makeStyles,
    createStyles,
    Tooltip,
    Fab,
    Drawer,
    InputBase
} from "@material-ui/core";
import { HomeRecentlyAddedCard } from "./HomeRecentlyAddedCard";
import useDebounce from "../../../hooks/useDebounce";
import { firestore } from "firebase";
import { FirebaseService } from "../../../firebase";
import SearchIcon from "@material-ui/icons/SearchTwoTone";
import { RecipeDocument } from "../../../model/model";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            background: "none"
        }
    })
);

export const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([]);
    const [searchDrawer, setSearchDrawer] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [skeleton, setSkeleton] = useState(false);

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const classes = useStyles();

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous);

    useEffect(() => {
        if (searchValue !== debouncedSearchValue) setSkeleton(true);
        else setSkeleton(false);
    }, [debouncedSearchValue, searchValue]);

    useEffect(() => {
        let query:
            | firestore.CollectionReference
            | firestore.Query = FirebaseService.firestore.collection("recipes");
        if (debouncedSearchValue.length > 0) {
            return query
                .where("name", ">=", debouncedSearchValue)
                .limit(6)
                .onSnapshot(
                    querySnapshot => {
                        setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument));
                        setSkeleton(false);
                    },
                    error => console.error(error)
                );
        } else {
            return query
                .orderBy("createdDate", "desc")
                .limit(6)
                .onSnapshot(
                    querySnapshot => {
                        setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument));
                    },
                    error => console.error(error)
                );
        }
    }, [debouncedSearchValue]);

    return (
        <>
            <Box margin={2}>
                <Box marginBottom={2} display="flex" justifyContent="space-evenly">
                    <Tooltip title="Kürzlich hinzugefügte einschränken">
                        <div>
                            <Fab onClick={handleSearchDrawerChange} size="small" color="primary">
                                <SearchIcon />
                            </Fab>
                        </div>
                    </Tooltip>
                </Box>
                <Grid container spacing={2}>
                    {recipes.map(recipe => (
                        <HomeRecentlyAddedCard
                            skeleton={skeleton}
                            key={recipe.name}
                            recipe={recipe}
                        />
                    ))}
                </Grid>
            </Box>

            <Drawer
                BackdropProps={{ classes }}
                open={searchDrawer}
                onClose={handleSearchDrawerChange}
                anchor="top"
            >
                <Box padding={2} display="flex" alignItems="center">
                    <Box marginRight={1}>
                        <SearchIcon />
                    </Box>
                    <InputBase
                        autoFocus
                        fullWidth
                        placeholder="Nach Rezeptnamen suchen"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </Box>
            </Drawer>
        </>
    );
};
