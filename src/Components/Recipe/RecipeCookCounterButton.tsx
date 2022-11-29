import { IconButton, Tooltip } from '@material-ui/core/'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { FieldValue, increment, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { BadgeWrapper } from '@/Components/Shared/BadgeWrapper'
import { CookingHistory, MostCooked, Recipe } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

type Props = Pick<Recipe, 'name'>

const RecipeCookCounterButton = ({ name }: Props) => {
  const [numberOfCooks, setNumberOfCooks] = useState(0)
  const [disabled, setDisabled] = useState(false)

  const { user } = useFirebaseAuthContext()

  useEffect(() => {
    return FirebaseService.firestore
      .collection('cookCounter')
      .doc(name)
      .onSnapshot(documentSnapshot =>
        setNumberOfCooks(
          documentSnapshot.exists ? documentSnapshot.data()!.value : 0
        )
      )
  }, [name])

  const handleClick = () => {
    if (!user) return
    setDisabled(true)

    FirebaseService.firestore
      .collection('cookCounter')
      .doc(name)
      .update({
        value: increment(1),
      } as MostCooked<FieldValue>)
      .catch(console.error)

    FirebaseService.firestore
      .collection('users')
      .doc(user.uid)
      .collection('cookingHistory')
      .doc()
      .set({
        createdDate: Timestamp.fromDate(new Date()),
        recipeName: name,
      } as CookingHistory)
      .catch(console.error)
  }

  return (
    <Tooltip title={disabled ? 'Zähler erhöht' : 'Gekocht Zähler erhöhen'}>
      <div>
        <IconButton disabled={disabled} onClick={handleClick}>
          <BadgeWrapper badgeContent={numberOfCooks}>
            <FavoriteIcon color={disabled ? 'primary' : 'error'} />
          </BadgeWrapper>
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default RecipeCookCounterButton
