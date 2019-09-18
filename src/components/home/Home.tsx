import React, { useEffect, useState } from "react";
import { Fade } from "@material-ui/core";
import { HomeCategory } from "./HomeCategory";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeRecipe } from "./Recipe/HomeRecipe";
import { Recipe, AttachementMetadata } from "../../model/model";
import { firestoreService } from "../../firebase";

const Home = () => {
    const [recipes, setRecipes] = useState<Array<Recipe<AttachementMetadata>>>([]);

    useEffect(() => {
        return firestoreService.collection("recipes").onSnapshot(
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
                <HomeCategory />
                <HomeRecipe recipes={recipes} />
            </>
        </Fade>
    );
};

export default Home;
