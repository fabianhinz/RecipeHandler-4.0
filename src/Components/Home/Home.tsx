import { Grid, LinearProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { DocumentId, OrderByKey, OrderByRecord, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import RecipeService from '../../services/recipeService'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { NavigateFab } from '../Routes/Navigate'
import { PATHS } from '../Routes/Routes'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'
import HomeMostCooked from './HomeMostCooked'
import HomeRecentlyAdded from './HomeRecentlyAdded'
import HomeRecipeCard from './HomeRecipeCard'
import HomeRecipeSelection from './HomeRecipeSelection'

type ChangesRecord = Record<firebase.firestore.DocumentChangeType, Map<DocumentId, Recipe>>

const Home = () => {
    const pagedRecipesSize = useRef(0)

    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, Recipe>>(
        RecipeService.pagedRecipes
    )
    const [lastRecipe, setLastRecipe] = useState<Recipe | undefined | null>(null)
    const [orderBy, setOrderBy] = useState<OrderByRecord>(RecipeService.orderBy)
    const [querying, setQuerying] = useState(false)

    const {
        selectedCategories,
        setSelectedCategories,
        removeSelectedCategories,
    } = useCategorySelect()
    const { user } = useFirebaseAuthContext()
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => {
            if (pagedRecipes.size > 0) setLastRecipe([...pagedRecipes.values()].pop())
        },
    })

    useDocumentTitle('RecipeHandler 4.0')

    useEffect(() => {
        setQuerying(true)
        const orderByKey = Object.keys(orderBy)[0] as OrderByKey
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore
            .collection('recipes')
            .orderBy(orderByKey, orderBy[orderByKey])

        if (user && user.selectedUsers.length > 0)
            query = query.where('editorUid', 'in', user.selectedUsers)

        if (lastRecipe) query = query.startAfter(lastRecipe[orderByKey])

        selectedCategories.forEach(
            (value, type) => (query = query.where(`categories.${type}`, '==', value))
        )

        return query.limit(FirebaseService.QUERY_LIMIT).onSnapshot(querySnapshot => {
            const changes: ChangesRecord = {
                added: new Map(),
                modified: new Map(),
                removed: new Map(),
            }
            querySnapshot
                .docChanges()
                .forEach(({ type, doc }) => changes[type].set(doc.id, doc.data() as Recipe))

            setPagedRecipes(recipes => {
                changes.removed.forEach((_v, key) => recipes.delete(key))
                const newRecipes = new Map([...recipes, ...changes.added, ...changes.modified])
                pagedRecipesSize.current = newRecipes.size

                RecipeService.pagedRecipes = newRecipes
                return newRecipes
            })
            setQuerying(false)
        })
    }, [lastRecipe, orderBy, selectedCategories, setQuerying, user])

    const resetRecipeState = useCallback(() => {
        setPagedRecipes(new Map())
        setLastRecipe(null)
    }, [])

    return (
        <>
            <EntryGridContainer>
                <HomeMostCooked />
                <HomeRecentlyAdded />
                <HomeRecipeSelection
                    selectedCategories={selectedCategories}
                    onRemoveSelectedCategories={() => {
                        removeSelectedCategories()
                        resetRecipeState()
                    }}
                    onSelectedCategoriesChange={(type, value) => {
                        setSelectedCategories(type, value)
                        resetRecipeState()
                    }}
                    orderBy={orderBy}
                    onOrderByChange={newOrderBy => {
                        setOrderBy(newOrderBy)
                        resetRecipeState()
                    }}
                />
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {[...pagedRecipes.values()].map(recipe => (
                            <HomeRecipeCard key={recipe.name} recipe={recipe} />
                        ))}

                        <Skeletons
                            variant="recipe"
                            visible={querying && pagedRecipes.size === 0}
                            numberOfSkeletons={
                                pagedRecipesSize.current > 0 ? pagedRecipesSize.current : undefined
                            }
                        />

                        <NotFound visible={!querying && pagedRecipes.size === 0} />

                        <Grid item xs={12} style={{ minHeight: 29 }}>
                            {querying && <LinearProgress variant="query" color="secondary" />}
                            <IntersectionObserverTrigger />
                        </Grid>
                    </Grid>
                </Grid>
            </EntryGridContainer>

            <NavigateFab
                to={PATHS.recipeCreate}
                icon={<AddIcon />}
                tooltipTitle="Rezept erstellen"
            />
        </>
    )
}

export default Home
