import {
  AppBar,
  Fade,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  Toolbar,
  withStyles,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { onSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'

import { PATHS } from '@/Components/Routes/Routes'
import { SecouredRouteFab } from '@/Components/Routes/SecouredRouteFab'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import { resolveRecipesByConstraintValues } from '@/firebase/firebaseQueries'
import { useCategorySelect } from '@/hooks/useCategorySelect'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { ChangesRecord, DocumentId, OrderByRecord, Recipe } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'
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

const Home = () => {
  const pagedRecipesSize = useRef(0)

  const [pagedRecipes, setPagedRecipes] = useState<Map<DocumentId, Recipe>>(
    getRecipeService().pagedRecipes
  )

  const [lastRecipe, setLastRecipe] = useState<Recipe | undefined>()
  const [orderBy, setOrderBy] = useState<OrderByRecord>(
    getRecipeService().orderBy
  )
  const [querying, setQuerying] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const {
    selectedCategories,
    setSelectedCategories,
    removeSelectedCategories,
  } = useCategorySelect()
  const [selectedEditor, setSelectedEditor] = useState<string>(
    getRecipeService().selectedEditor
  )

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

    onSnapshot(
      resolveRecipesByConstraintValues({
        orderByRecord: orderBy,
        lastRecipe,
        selectedEditor,
        selectedCategories,
      }),
      querySnapshot => {
        const changes: ChangesRecord<Recipe> = {
          added: new Map(),
          modified: new Map(),
          removed: new Map(),
        }

        for (const change of querySnapshot.docChanges()) {
          changes[change.type].set(change.doc.id, change.doc.data() as Recipe)
        }
        // TODO fix
        // 1. when creating a new recipe the app redirects to the home page and adds the recipe to the end of the map
        // 2. **not in minfied bundle** after the first "startAfter" with a lastRecipe click on it and navigate back. This recipe will be deleted
        setPagedRecipes(recipes => {
          for (const [docId] of changes.removed) {
            recipes.delete(docId)
          }

          for (const [docId, modifiedRecipe] of changes.modified) {
            recipes.set(docId, modifiedRecipe)
          }

          const newRecipes = new Map([...recipes, ...changes.added])
          pagedRecipesSize.current = newRecipes.size
          getRecipeService().pagedRecipes = newRecipes

          return newRecipes
        })
        setQuerying(false)
      }
    )
  }, [lastRecipe, orderBy, selectedCategories, selectedEditor])

  const resetRecipeState = useCallback(() => {
    setPagedRecipes(new Map())
    setLastRecipe(undefined)
  }, [])

  return (
    <>
      <EntryGridContainer>
        <Grid item xs={12}>
          <AppBar
            className={classes.homeRoot}
            position="static"
            color="default">
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
                      getRecipeService().selectedEditor = ''
                    }}
                    onSelectedCategoriesChange={(type, value) => {
                      setSelectedCategories(type, value)
                      resetRecipeState()
                    }}
                    selectedEditor={selectedEditor}
                    onSelectedEditorChange={uid => {
                      setSelectedEditor(uid)
                      getRecipeService().selectedEditor = uid
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
