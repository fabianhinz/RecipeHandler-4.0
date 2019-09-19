import React, { useEffect, useState } from "react";
import { Fade } from "@material-ui/core";
import { HomeCategory } from "./HomeCategory";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeRecipe } from "./Recipe/HomeRecipe";
import { Recipe, AttachementMetadata } from "../../model/model";
import { FirebaseService } from "../../firebase";
import { firestore } from "firebase";

type DocumentId = string;
type RecipeDocument = Recipe<AttachementMetadata>;
type ChangesRecord = Record<firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>;

const Home = () => {
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map());
    const [mostRecentRecipes, setMostRecentRecipes] = useState<Array<RecipeDocument>>([]);
    const [lastRecipeName, setLastRecipeName] = useState("");

    useEffect(() => {
        return FirebaseService.firestore
            .collection("recipes")
            .orderBy("createdDate", "desc")
            .limit(10)
            .onSnapshot(
                querySnapshot => {
                    setMostRecentRecipes(
                        querySnapshot.docs.map(doc => doc.data() as RecipeDocument)
                    );
                },
                error => console.error(error)
            );
    }, []);

    useEffect(() => {
        return FirebaseService.firestore
            .collection("recipes")
            .orderBy("name", "asc")
            .startAfter(lastRecipeName)
            .limit(4)
            .onSnapshot(
                querySnapshot => {
                    const changes: ChangesRecord = {
                        added: new Map(),
                        modified: new Map(),
                        removed: new Map()
                    };
                    querySnapshot
                        .docChanges()
                        .forEach(({ type, doc }) =>
                            changes[type].set(doc.id, doc.data() as RecipeDocument)
                        );
                    setPagedRecipes(recipes => {
                        changes.removed.forEach((_v, key) => recipes.delete(key));
                        return new Map([...recipes, ...changes.added, ...changes.modified]);
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, [lastRecipeName]);

    return (
        <Fade in>
            <>
                <HomeRecentlyAdded recipes={mostRecentRecipes} />
                <HomeCategory />
                <HomeRecipe
                    recipes={[...pagedRecipes.values()]}
                    onExpandClick={setLastRecipeName}
                />
            </>
        </Fade>
    );
};

export default Home;
