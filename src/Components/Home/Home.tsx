import { createStyles, Fab, makeStyles, Zoom } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'

import { useCategorySelect } from '../../hooks/useCategorySelect'
import { RecipeDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecentlyAdded from '../RecentlyAdded/RecentlyAdded'
import { Navigate } from '../Routes/Navigate'
import { PATHS } from '../Routes/Routes'
import { HomeCategory } from './HomeCategory'
import { HomeRecipe } from './HomeRecipe'

type DocumentId = string
type ChangesRecord = Record<firebase.firestore.DocumentChangeType, Map<DocumentId, RecipeDocument>>

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(4.5),
        },
    })
)

const Home = () => {
    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, RecipeDocument>>(new Map())
    const [lastRecipeName, setLastRecipeName] = useState('')
    const [pagination, setPagination] = useState(false)

    const classes = useStyles()

    const { selectedCategories, setSelectedCategories } = useCategorySelect()
    const { user } = useFirebaseAuthContext()

    const handleCategoryChange = (type: string, value: string) => {
        setLastRecipeName('')
        setSelectedCategories(type, value)
    }

    useEffect(() => {
        // ? constructing the query with both where and orderBy clauses requires multiple indexes
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

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
    }, [lastRecipeName, selectedCategories, selectedCategories.size])

    return (
        <>
            <RecentlyAdded />
            <HomeCategory
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />
            <HomeRecipe
                recipes={[...pagedRecipes.values()]}
                onExpandClick={setLastRecipeName}
                expandDisabled={!pagination}
            />

            {user && !user.isAnonymous && (
                <Navigate to={PATHS.recipeCreate}>
                    <Zoom in>
                        <Fab className={classes.fab} color="secondary">
                            <AddIcon />
                        </Fab>
                    </Zoom>
                </Navigate>
            )}
        </>
    )
}

export default Home
