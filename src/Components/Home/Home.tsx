import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { AttachmentMetadata, DocumentId, Recipe, RecipeDocument } from '../../model/model'
import ConfigService from '../../services/configService'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecentlyAdded from '../RecentlyAdded/RecentlyAdded'
import { NavigateFab } from '../Routes/Navigate'
import { PATHS } from '../Routes/Routes'
import { HomeCategory } from './HomeCategory'
import { HomeRecipe, OrderByKey, OrderByRecord } from './HomeRecipe'

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
        onIsIntersecting: () => setLastRecipe([...pagedRecipes.values()].pop()),
    })

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipe(null)
        setSelectedCategories(type, value)
    }

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

        return query.limit(8).onSnapshot(querySnapshot => {
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
        <Grid container spacing={4}>
            {user && !user.showRecentlyAdded ? (
                <></>
            ) : (
                <Grid item xs={12}>
                    <RecentlyAdded />
                </Grid>
            )}

            <Grid item xs={12}>
                <HomeCategory
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />
            </Grid>

            <Grid item xs={12}>
                <HomeRecipe
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
                    skeletons={loading}
                    recipes={[...pagedRecipes.values()]}
                />
                {/* IMPORTANT: the intersection observer trigger must not be moved */}
                <IntersectionObserverTrigger />
            </Grid>

            <NavigateFab to={PATHS.recipeCreate} icon={<AddIcon />} />
        </Grid>
    )
}

export default Home
