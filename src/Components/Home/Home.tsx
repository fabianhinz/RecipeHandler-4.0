import React, { useEffect, useState } from "react";
import { Fade } from "@material-ui/core";
import { HomeCategory } from "./HomeCategory";
import { HomeRecentlyAdded } from "./RecentlyAdded/HomeRecentlyAdded";
import { HomeRecipe } from "./Recipe/HomeRecipe";
import { Recipe, AttachementMetadata } from "../../model/model";
import { FirebaseService } from "../../firebase";
import { firestore } from "firebase";
import { useCategorySelect } from "../../hooks/useCategorySelect";

type DocumentId = string;
type RecipeDocument = Recipe<AttachementMetadata>;
type ChangesRecord = Record<firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>;

const Home = () => {
    const [mostRecentRecipes, setMostRecentRecipes] = useState<Array<RecipeDocument>>([]);
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map());
    const [lastRecipeName, setLastRecipeName] = useState("");
    const [pagination, setPagination] = useState(false);

    const { selectedCategories, setSelectedCategories } = useCategorySelect();

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipeName("");
        setSelectedCategories(type, value);
    };

    useEffect(() => {
        return FirebaseService.firestore
            .collection("recipes")
            .orderBy("createdDate", "desc")
            .limit(6)
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
        // ? constructing the query with both where and orderBy clauses requires multiple indexes
        let query:
            | firestore.CollectionReference
            | firestore.Query = FirebaseService.firestore.collection("recipes");

        if (selectedCategories.size === 0) {
            setPagination(true);

            return query
                .orderBy("name", "asc")
                .startAfter(lastRecipeName)
                .limit(4)
                .onSnapshot(querySnapshot => {
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
                });
        } else {
            setPagination(false);
            selectedCategories.forEach(
                (value, type) => (query = query.where(`categories.${type}`, "==", value))
            );

            return query.onSnapshot(
                querySnapshot => {
                    const added: Map<DocumentId, RecipeDocument> = new Map();
                    querySnapshot.docs.map(doc => added.set(doc.id, doc.data() as RecipeDocument));
                    setPagedRecipes(added);
                },
                error => console.error(error)
            );
        }
    }, [lastRecipeName, selectedCategories, selectedCategories.size]);

    return (
        <Fade in>
            <>
                <HomeRecentlyAdded recipes={mostRecentRecipes} />
                <HomeCategory
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />
                <HomeRecipe
                    recipes={[...pagedRecipes.values()]}
                    onExpandClick={setLastRecipeName}
                    expandDisabled={!pagination}
                />
            </>
        </Fade>
    );
};

export default Home;
