import { IconButton, Tooltip } from '@material-ui/core/'
import { BookPlus } from 'mdi-material-ui'
import React, { FC, useEffect, useState } from 'react'

import { MostCooked, Recipe } from '../../../../model/model'
import { FirebaseService } from '../../../../services/firebase'
import { useFirebaseAuthContext } from '../../../Provider/FirebaseAuthProvider'
import { BadgeWrapper } from '../../../Shared/BadgeWrapper'

export const RecipeResultCookCounter: FC<Pick<Recipe, 'name'>> = ({ name }) => {
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
        // Todo might wanna track individuall cooking history via subcollection
        FirebaseService.firestore
            .collection('cookCounter')
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) } as MostCooked<
                firebase.firestore.FieldValue
            >)
            .catch(console.error)
    }

    return (
        <Tooltip title="Gekocht Zähler erhöhen">
            <div>
                <IconButton disabled={disabled || !user} onClick={handleClick}>
                    <BadgeWrapper badgeContent={numberOfCooks}>
                        <BookPlus color={disabled ? 'primary' : 'inherit'} />
                    </BadgeWrapper>
                </IconButton>
            </div>
        </Tooltip>
    )
}
