import { IconButton, Tooltip } from '@material-ui/core/'
import FavoriteIcon from '@material-ui/icons/Favorite'
import React, { useEffect, useState } from 'react'

import { CookingHistory, MostCooked, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { BadgeWrapper } from '../Shared/BadgeWrapper'

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
                setNumberOfCooks(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            )
    }, [name])

    const handleClick = () => {
        if (!user) return
        setDisabled(true)

        FirebaseService.firestore
            .collection('cookCounter')
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) } as MostCooked<
                firebase.firestore.FieldValue
            >)
            .catch(console.error)

        FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .collection('cookingHistory')
            .doc()
            .set({
                createdDate: FirebaseService.createTimestampFromDate(new Date()),
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
