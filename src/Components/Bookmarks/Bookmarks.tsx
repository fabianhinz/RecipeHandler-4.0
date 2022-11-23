import { Grid, Tab, Tabs } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import { Skeleton } from '@material-ui/lab'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import MarkdownRenderer from '@/Components/Markdown/MarkdownRenderer'
import { useBookmarkContext } from '@/Components/Provider/BookmarkProvider'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import RecipeBookmarkButton from '@/Components/Recipe/RecipeBookmarkButton'
import RecipeDetailsButton from '@/Components/Recipe/RecipeDetailsButton'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import NotFound from '@/Components/Shared/NotFound'
import StyledCard from '@/Components/Shared/StyledCard'
import { resolveDoc } from '@/firebase/firebaseQueries'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { Recipe } from '@/model/model'

interface BookmarkProps {
  recipeName: string
}

const Bookmark = ({ recipeName }: BookmarkProps) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    return onSnapshot(resolveDoc('recipes', recipeName), doc => {
      setRecipe({ name: doc.id, ...doc.data() } as Recipe)
    })
  }, [recipeName])

  return (
    <>
      {recipe ? (
        <StyledCard
          expandable
          header={recipeName}
          action={
            <>
              <RecipeDetailsButton recipe={recipe} />
              <RecipeBookmarkButton name={recipeName} />
            </>
          }>
          <Tabs variant="fullWidth" value={value} onChange={(_e, newValue) => setValue(newValue)}>
            <Tab icon={<AssignmentIcon />} label={`Zutaten für ${recipe?.amount}`} />
            <Tab icon={<BookIcon />} label="Beschreibung" />
          </Tabs>

          <SwipeableViews disableLazyLoading disabled index={value}>
            <MarkdownRenderer withShoppingList recipeName={recipeName}>
              {recipe.ingredients}
            </MarkdownRenderer>
            <MarkdownRenderer recipeName={recipeName}>{recipe.description}</MarkdownRenderer>
          </SwipeableViews>
        </StyledCard>
      ) : (
        <Skeleton animation="wave" width="100%" height={400} variant="rect" />
      )}
    </>
  )
}

// eslint-disable-next-line react/no-multi-comp
const Bookmarks = () => {
  const { loginEnabled } = useFirebaseAuthContext()
  const { bookmarks } = useBookmarkContext()
  const { gridBreakpointProps } = useGridContext()

  useDocumentTitle(`Lesezeichen (${bookmarks.size})`)

  return (
    <EntryGridContainer>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {[...bookmarks.values()].map(recipeName => (
            <Grid item {...gridBreakpointProps} key={recipeName}>
              <Bookmark recipeName={recipeName} />
            </Grid>
          ))}
        </Grid>
        <NotFound visible={bookmarks.size === 0 && loginEnabled} />
      </Grid>
    </EntryGridContainer>
  )
}

export default Bookmarks
