import React, { FC, useEffect, useState } from "react";
import { Fade } from "@material-ui/core";
import { firestore } from "../../util/Firebase";
import { HomeCategories } from "./HomeCategories";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeRecipeResults } from "./HomeRecipeResults";
import { Recipe } from "../../util/Mock";
import { RouteComponentProps } from "react-router";

const Home: FC<RouteComponentProps> = () => {
    const [recipes, setRecipes] = useState<Array<Recipe>>([]);

    useEffect(() => {
        return firestore.collection("recipes").onSnapshot(
            observer => {
                const data: Array<Recipe> = [];
                observer.forEach(result => data.push(result.data() as Recipe));
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
