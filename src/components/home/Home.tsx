import React, { useEffect, useState } from "react";
import { Fade } from "@material-ui/core";
import { HomeCategory } from "./HomeCategory";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeRecipe } from "./Recipe/HomeRecipe";
import { Recipe, AttachementMetadata } from "../../model/model";
import { firestoreService } from "../../firebase";

const Home = () => {
    const [recipes, setRecipes] = useState<Array<Recipe<AttachementMetadata>>>([]);
    const [recipesQuery, setRecipesQuery] = useState(
        firestoreService
            .collection("recipes")
            .orderBy("name", "asc")
            .limit(4)
    );

    useEffect(() => {
        return recipesQuery.onSnapshot(
            querySnapshot => {
                setRecipes(previous => [
                    ...previous,
                    ...querySnapshot.docs.map(doc => doc.data() as Recipe<AttachementMetadata>)
                ]);
            },
            error => {
                console.error(error);
            }
        );
    }, [recipesQuery]);

    return (
        <Fade in>
            <>
                <HomeRecentlyAdded />
                <HomeCategory />
                <HomeRecipe
                    recipes={recipes}
                    onExpandClick={lastRecipeName =>
                        setRecipesQuery(query => query.startAfter(lastRecipeName))
                    }
                />
            </>
        </Fade>
    );
};

export default Home;
