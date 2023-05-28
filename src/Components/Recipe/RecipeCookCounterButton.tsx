import FavoriteIcon from '@mui/icons-material/Favorite'
import { IconButton, Tooltip } from '@mui/material/'
import {
  addDoc,
  FieldValue,
  increment,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { BadgeWrapper } from '@/Components/Shared/BadgeWrapper'
import { resolveCollection, resolveDoc } from '@/firebase/firebaseQueries'
import { CookingHistory, MostCooked, Recipe } from '@/model/model'

type Props = Pick<Recipe, 'name'>

const RecipeCookCounterButton = ({ name }: Props) => {
  const [numberOfCooks, setNumberOfCooks] = useState(0)
  const [disabled, setDisabled] = useState(false)

  const { user } = useFirebaseAuthContext()

  useEffect(() => {
    return onSnapshot(resolveDoc('cookCounter', name), documentSnapshot => {
      setNumberOfCooks(
        documentSnapshot.exists() ? documentSnapshot.data().value : 0
      )
    })
  }, [name])

  const handleClick = async () => {
    if (!user) {
      return
    }

    setDisabled(true)
    const cookCounterUpdate: Partial<MostCooked<FieldValue>> = {
      value: increment(1),
    }
    const cookingHistoryDoc: Partial<CookingHistory> = {
      createdDate: Timestamp.fromDate(new Date()),
      recipeName: name,
    }

    void updateDoc(resolveDoc('cookCounter', name), cookCounterUpdate)
    void addDoc(
      resolveCollection(`users/${user.uid}/cookingHistory`),
      cookingHistoryDoc
    )
  }

  return (
    <Tooltip title={disabled ? 'Zähler erhöht' : 'Gekocht Zähler erhöhen'}>
      <div>
        <IconButton disabled={disabled} onClick={handleClick} size="large">
          <BadgeWrapper badgeContent={numberOfCooks}>
            <FavoriteIcon color={disabled ? 'primary' : 'error'} />
          </BadgeWrapper>
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default RecipeCookCounterButton
