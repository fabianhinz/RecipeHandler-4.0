import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Skeleton } from '@mui/material';
import { getDoc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import HomeRecipeCard, {
  RECIPE_CARD_HEIGHT,
} from '@/Components/Home/HomeRecipeCard'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import NotFound from '@/Components/Shared/NotFound'
import {
  resolveCookingHistoryOrderedByDateDesc,
  resolveDoc,
} from '@/firebase/firebaseQueries'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { CookingHistory, Recipe } from '@/model/model'
import { BORDER_RADIUS } from '@/theme'

const useStyles = makeStyles({
  skeleton: {
    height: RECIPE_CARD_HEIGHT,
    width: '100%',
    borderRadius: BORDER_RADIUS,
  },
})

const HistoryElement = ({ recipeName, createdDate }: CookingHistory) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [notFound, setNotFound] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    getDoc(resolveDoc('recipes', recipeName)).then(doc => {
      if (doc.exists()) {
        setRecipe(doc.data() as Recipe)
      } else {
        setNotFound(true)
      }
    })
  }, [recipeName])

  if (notFound) return <></>

  return <>
    {recipe ? (
      <HomeRecipeCard recipe={recipe} lastCookedDate={createdDate} />
    ) : (
      <Grid item xs={6} md={4} lg={3} xl={2}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          className={classes.skeleton}
        />
      </Grid>
    )}
  </>;
}

// eslint-disable-next-line react/no-multi-comp
const AccountCookingHistory = () => {
  const [cookingHistory, setCookingHistory] = useState<CookingHistory[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useFirebaseAuthContext()

  useDocumentTitle(`Kochverlauf (${cookingHistory.length})`)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    return onSnapshot(
      resolveCookingHistoryOrderedByDateDesc(user.uid),
      snapshot => {
        setCookingHistory(
          snapshot.docs.map(doc => doc.data() as CookingHistory)
        )
        setLoading(false)
      }
    )
  }, [user])

  if (!user) return <></>

  return (
    <EntryGridContainer>
      <Grid item xs={12}>
        <Typography variant="h4">Im letzten Quartal</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {cookingHistory.map(element => (
            <HistoryElement
              key={element.recipeName + element.createdDate.toMillis()}
              {...element}
            />
          ))}
        </Grid>
        <NotFound visible={!loading && cookingHistory.length === 0} />
      </Grid>
    </EntryGridContainer>
  )
}

export default AccountCookingHistory
