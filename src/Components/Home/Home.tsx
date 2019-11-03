import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../firebase'
import { useCategorySelect } from '../../hooks/useCategorySelect'
import { RecipeDocument } from '../../model/model'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { HomeCategory } from './HomeCategory'
import { HomeSearch } from './HomeSearch/HomeSearch'
import { HomeRecentlyAdded } from './RecentlyAdded/HomeRecentlyAdded'
import { HomeRecipe } from './Recipe/HomeRecipe'

type DocumentId = string
type ChangesRecord = Record<firebase.firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>

const Home = () => {
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map())
    const [lastRecipeName, setLastRecipeName] = useState('')
    const [pagination, setPagination] = useState(false)

    const { isHighRes } = useBreakpointsContext()
    const { selectedCategories, setSelectedCategories } = useCategorySelect()

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipeName('')
        setSelectedCategories(type, value)
    }

    useEffect(() => {
        // ? constructing the query with both where and orderBy clauses requires multiple indexes
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        let limit = isHighRes ? 8 : 4

        if (selectedCategories.size === 0) {
            setPagination(true)

            return query
                .orderBy('name', 'asc')
                .startAfter(lastRecipeName)
                .limit(limit)
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
                },
                error => console.error(error)
            )
        }
    }, [isHighRes, lastRecipeName, selectedCategories, selectedCategories.size])

    return (
        <>
            <HomeSearch />
            <HomeRecentlyAdded />
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
    )
}

export default Home
