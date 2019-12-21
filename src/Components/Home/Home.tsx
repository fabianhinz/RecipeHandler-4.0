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
    const [pagination, setPagination] = useState(false)
    const [loading, setLoading] = useState(true)

    const { selectedCategories, setSelectedCategories } = useCategorySelect()
    const { user } = useFirebaseAuthContext()

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipeName('')
        setSelectedCategories(type, value)
    }

    useEffect(() => {
        setLoading(true)
        // ? constructing the query with both where and orderBy clauses requires multiple indexes
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        if (user && user.selectedUsers.length > 0)
            query = query.where('editorUid', 'in', user.selectedUsers)

        if (selectedCategories.size === 0) {
            setPagination(true)

            return query
                .orderBy('name', 'asc')
                .startAfter(lastRecipeName)
                .limit(4)
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
            setPagination(false)
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
    }, [lastRecipeName, selectedCategories, selectedCategories.size, user])

    return (
        <>
            {user && user.showRecentlyAdded && <RecentlyAdded />}
            <HomeCategory
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />
            <HomeRecipe
                skeletons={loading}
                recipes={[...pagedRecipes.values()]}
                onExpandClick={setLastRecipeName}
                expandDisabled={!pagination}
            />

            <NavigateFab to={PATHS.recipeCreate} icon={<AddIcon />} />
        </>
    )
}

export default Home
