import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import { DocumentId, RecipeDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecentlyAdded from '../RecentlyAdded/RecentlyAdded'
import { NavigateFab } from '../Routes/Navigate'
import { PATHS } from '../Routes/Routes'
import { HomeCategory } from './HomeCategory'
import { HomeRecipe } from './HomeRecipe'

type ChangesRecord = Record<firebase.firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>

const Home = () => {
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map())
    const [lastRecipeName, setLastRecipeName] = useState('')
    const [loading, setLoading] = useState(true)

    const { selectedCategories, setSelectedCategories } = useCategorySelect()
    const { user } = useFirebaseAuthContext()

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipeName('')
        setSelectedCategories(type, value)
    }

    useEffect(() => {
        const trigger = document.getElementById('intersection-observer-trigger')
        if (!trigger) return

        const observer = new IntersectionObserver(entries => {
            const [lastRecipeTrigger] = entries
            if (lastRecipeTrigger.isIntersecting && pagedRecipes.size > 0)
                setLastRecipeName([...pagedRecipes.values()].pop()!.name)
        })
        observer.observe(trigger)

        return () => observer.unobserve(trigger)
    }, [pagedRecipes])

    useEffect(() => {
        setPagedRecipes(new Map())
        setLastRecipeName('')
    }, [user])

    useEffect(() => {
        setLoading(true)
        // ? constructing the query with both where and orderBy clauses requires multiple indexes
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        if (user && user.selectedUsers.length > 0)
            query = query.where('editorUid', 'in', user.selectedUsers)

        if (selectedCategories.size === 0) {
            return query
                .orderBy('name', 'asc')
                .startAfter(lastRecipeName)
                .limit(8)
                .onSnapshot(querySnapshot => {
                    const changes: ChangesRecord = {
                        added: new Map(),
                        modified: new Map(),
                        removed: new Map(),
                    }

                    querySnapshot
                        .docChanges()
                        .forEach(({ type, doc }) =>
                            changes[type].set(doc.id, doc.data() as RecipeDocument)
                        )
                    setPagedRecipes(recipes => {
                        changes.removed.forEach((_v, key) => recipes.delete(key))
                        return new Map([...recipes, ...changes.added, ...changes.modified])
                    })
                    setLoading(false)
                })
        } else {
            selectedCategories.forEach(
                (value, type) => (query = query.where(`categories.${type}`, '==', value))
            )
            return query.onSnapshot(
                querySnapshot => {
                    const added: Map<DocumentId, RecipeDocument> = new Map()
                    querySnapshot.docs.map(doc => added.set(doc.id, doc.data() as RecipeDocument))
                    setPagedRecipes(added)
                    setLoading(false)
                },
                error => console.error(error)
            )
        }
    }, [lastRecipeName, selectedCategories, user])

    return (
        <>
            {user && !user.showRecentlyAdded ? <></> : <RecentlyAdded />}

            <HomeCategory
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />
            <HomeRecipe skeletons={loading} recipes={[...pagedRecipes.values()]} />
            <div id="intersection-observer-trigger" />

            <NavigateFab to={PATHS.recipeCreate} icon={<AddIcon />} />
        </>
    )
}

export default Home
