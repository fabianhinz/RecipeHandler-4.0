import { AppBar, Fade, Grid, makeStyles, Tab, Tabs, Toolbar, withStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useCallback, useEffect, useRef, useState } from 'react'

import { PATHS } from '@/Components/Routes/Routes'
import { SecouredRouteFab } from '@/Components/Routes/SecouredRouteFab'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import { useCategorySelect } from '@/hooks/useCategorySelect'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { DocumentId, OrderByKey, OrderByRecord, Recipe } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
import RecipeService from '@/services/recipeService'
import { BORDER_RADIUS } from '@/theme'

import HomeMostCooked from './HomeMostCooked'
import HomeNew from './HomeNew'
import { RECIPE_CARD_HEIGHT } from './HomeRecipeCard'
import { HomeRecipes } from './HomeRecipes'
import HomeRecipeSelection from './HomeRecipeSelection'

const useStyles = makeStyles(theme => ({
    homeRoot: {
        borderRadius: BORDER_RADIUS,
    },
    tabWrapper: {
        fontSize: theme.typography.h5.fontSize,
    },
    toolbar: {
        justifyContent: 'space-between',
    },
}))

const StyledTab = withStyles(theme => ({
    wrapper: {
        fontSize: theme.typography.h6.fontSize,
    },
}))(Tab)

type ChangesRecord = Record<firebase.default.firestore.DocumentChangeType, Map<DocumentId, Recipe>>

const Home = () => {
    const pagedRecipesSize = useRef(0)

    const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, Recipe>>(
        RecipeService.pagedRecipes
    )

    const [lastRecipe, setLastRecipe] = useState<Recipe | undefined | null>(null)
    const [orderBy, setOrderBy] = useState<OrderByRecord>(RecipeService.orderBy)
    const [querying, setQuerying] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)

    const { selectedCategories, setSelectedCategories, removeSelectedCategories } =
        useCategorySelect()
    const [selectedEditor, setSelectedEditor] = useState<string>('')

    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => {
            if (pagedRecipes.size > 0 && !querying) {
                setLastRecipe([...pagedRecipes.values()].pop())
            }
        },
        options: { rootMargin: RECIPE_CARD_HEIGHT + 'px' },
    })

    const classes = useStyles()

    useDocumentTitle('Rezepte')

    useEffect(() => {
        setQuerying(true)
        const orderByKey = Object.keys(orderBy)[0] as OrderByKey
        let query:
            | firebase.default.firestore.CollectionReference
            | firebase.default.firestore.Query = FirebaseService.firestore
            .collection('recipes')
            .orderBy(orderByKey, orderBy[orderByKey])
        // TODO FirebaseError: [code=invalid-argument]: Invalid Query. 'in' filters support a maximum of 10 elements in the value array
        // if (selectedEditors.length > 0) query = query.where('editorUid', 'in', selectedEditors)

        if (selectedEditor) query = query.where('editorUid', '==', selectedEditor)

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
    }, [lastRecipe, orderBy, selectedCategories, selectedEditor])

    const resetRecipeState = useCallback(() => {
        setPagedRecipes(new Map())
        setLastRecipe(null)
    }, [])

    return (
        <>
            <EntryGridContainer>
                <Grid item xs={12}>
                    <AppBar className={classes.homeRoot} position="static" color="default">
                        <Toolbar className={classes.toolbar}>
                            <Tabs
                                scrollButtons="on"
                                variant="scrollable"
                                value={tabIndex}
                                onChange={(_, newIndex) => setTabIndex(newIndex)}>
                                <StyledTab label="Alle Rezepte" />
                                <StyledTab label="Neue" />
                                <StyledTab label="Häufig gekocht" />
                            </Tabs>
                            <Fade mountOnEnter unmountOnExit in={tabIndex === 0}>
                                <div>
                                    <HomeRecipeSelection
                                        selectedCategories={selectedCategories}
                                        onRemoveSelectedCategories={() => {
                                            removeSelectedCategories()
                                            resetRecipeState()
                                            setSelectedEditor('')
                                        }}
                                        onSelectedCategoriesChange={(type, value) => {
                                            setSelectedCategories(type, value)
                                            resetRecipeState()
                                        }}
                                        selectedEditor={selectedEditor}
                                        onSelectedEditorChange={uid => {
                                            setSelectedEditor(uid)
                                            resetRecipeState()
                                        }}
                                        orderBy={orderBy}
                                        onOrderByChange={newOrderBy => {
                                            setOrderBy(newOrderBy)
                                            resetRecipeState()
                                        }}
                                    />
                                </div>
                            </Fade>
                        </Toolbar>
                    </AppBar>
                </Grid>

                <Grid item xs={12}>
                    <Fade in={tabIndex === 0} mountOnEnter unmountOnExit>
                        <HomeRecipes
                            pagedRecipes={pagedRecipes}
                            IntersectionObserverTrigger={IntersectionObserverTrigger}
                            pagedRecipesSize={pagedRecipesSize}
                            querying={querying}
                        />
                    </Fade>
                    <Fade in={tabIndex === 1} mountOnEnter unmountOnExit>
                        <HomeNew />
                    </Fade>
                    <Fade in={tabIndex === 2} mountOnEnter unmountOnExit>
                        <HomeMostCooked />
                    </Fade>
                </Grid>
            </EntryGridContainer>

            <SecouredRouteFab
                pathname={PATHS.recipeCreate}
                icon={<AddIcon />}
                tooltipTitle="Rezept erstellen"
            />
        </>
    )
}

export default Home
