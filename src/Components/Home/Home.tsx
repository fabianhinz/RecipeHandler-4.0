import { Grid, LinearProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useRef, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { DocumentId, OrderByKey, OrderByRecord, Recipe } from '../../model/model'
import ConfigService from '../../services/configService'
import { FirebaseService } from '../../services/firebase'
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

    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, Recipe>>(new Map())
    const [lastRecipe, setLastRecipe] = useState<Recipe | undefined | null>(null)
    const [orderBy, setOrderBy] = useState<OrderByRecord>(ConfigService.orderBy)
    const [querying, setQuerying] = useState(false)

    const { selectedCategories, setSelectedCategories } = useCategorySelect()
    const { user } = useFirebaseAuthContext()
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => {
            if (pagedRecipes.size > 0) setLastRecipe([...pagedRecipes.values()].pop())
        },
    })

    useDocumentTitle('RecipeHandler 4.0')

    useEffect(() => {
        setPagedRecipes(new Map())
        setLastRecipe(null)
        // ? clear intersection observer trigger and recipes when any of following change
    }, [orderBy, selectedCategories])

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

                return newRecipes
            })
            setQuerying(false)
        })
    }, [lastRecipe, orderBy, selectedCategories, setQuerying, user])

    return (
        <>
            <EntryGridContainer>
                <HomeMostCooked />
                <HomeRecentlyAdded />
                <HomeRecipeSelection
                    selectedCategories={selectedCategories}
                    onSelectedCategoriesChange={setSelectedCategories}
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
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

                        <Grid item xs={12}>
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
