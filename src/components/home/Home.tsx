import React, { FC, useEffect, useState } from "react";
import { AttachementMetadata, Recipe } from "../../util/Mock";
import { Fade } from "@material-ui/core";
import { firestore } from "../../util/Firebase";
import { HomeCategories } from "./HomeCategories";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeRecipeResults } from "./HomeRecipeResults";
import { RouteComponentProps } from "react-router";

const Home: FC<RouteComponentProps> = () => {
    const [recipes, setRecipes] = useState<Array<Recipe<AttachementMetadata>>>([]);

    useEffect(() => {
        return firestore.collection("recipes").onSnapshot(
            observer => {
                const data: Array<Recipe<AttachementMetadata>> = [];
                observer.forEach(result => data.push(result.data() as Recipe<AttachementMetadata>));
                setRecipes(data);
            },
            error => {
                console.error(error);
            }
        );
    }, []);

    return (
        <Fade in>
            <>
                <HomeRecentlyAdded />
                <HomeCategories />
                <HomeRecipeResults recipes={recipes} />
            </>
        </Fade>
    );
};

export default Home;
