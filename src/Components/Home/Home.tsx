import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import {
    AttachmentMetadata,
    DocumentId,
    OrderByKey,
    OrderByRecord,
    Recipe,
    RecipeDocument,
} from '../../model/model'
import ConfigService from '../../services/configService'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { NavigateFab } from '../Routes/Navigate'
import { PATHS } from '../Routes/Routes'
import HomeRecentlyAdded from './HomeRecentlyAdded'
import HomeRecipeCard from './HomeRecipeCard'
import HomeRecipeSelection from './HomeRecipeSelection'
import HomeSkeletons from './HomeSkeletons'

type ChangesRecord = Record<firebase.firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>

const Home = () => {
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map())
    const [lastRecipe, setLastRecipe] = useState<Recipe<AttachmentMetadata> | undefined | null>(
        null
    )
    const [loading, setLoading] = useState(true)
    const [orderBy, setOrderBy] = useState<OrderByRecord>(ConfigService.orderBy)

    const { selectedCategories, setSelectedCategories } = useCategorySelect()
    const { user } = useFirebaseAuthContext()
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => {
            if (pagedRecipes.size > 0) setLastRecipe([...pagedRecipes.values()].pop())
        },
    })

    useEffect(() => {
        setPagedRecipes(new Map())
        setLastRecipe(null)
        // ? clear intersection observer trigger and recipes when any of following change
    }, [user, orderBy, selectedCategories])

    useEffect(() => {
        setLoading(true)
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

        return query.limit(6).onSnapshot(querySnapshot => {
            const changes: ChangesRecord = {
                added: new Map(),
                modified: new Map(),
                removed: new Map(),
            }
            querySnapshot
                .docChanges()
                .forEach(({ type, doc }) => changes[type].set(doc.id, doc.data() as RecipeDocument))
            setPagedRecipes(recipes => {
                changes.removed.forEach((_v, key) => recipes.delete(key))
                return new Map([...recipes, ...changes.added, ...changes.modified])
            })
            setLoading(false)
        })
    }, [lastRecipe, orderBy, selectedCategories, user])

    return (
        <Grid container spacing={4} justify="space-between" alignItems="center">
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
                        <HomeRecipeCard key={recipe.name} skeleton={false} recipe={recipe} />
                    ))}
                    <HomeSkeletons visible={pagedRecipes.size === 0} numberOfSkeletons={6} />
                </Grid>
                <IntersectionObserverTrigger />
            </Grid>

            <NavigateFab to={PATHS.recipeCreate} icon={<AddIcon />} />
        </Grid>
    )
}

export default Home
