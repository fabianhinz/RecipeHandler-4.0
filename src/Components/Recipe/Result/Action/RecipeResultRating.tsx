import { IconButton, Tooltip } from '@material-ui/core/'
import { BookPlus } from 'mdi-material-ui'
import React, { FC, useEffect, useState } from 'react'

import { Recipe } from '../../../../model/model'
import { FirebaseService } from '../../../../services/firebase'
import { BadgeWrapper } from '../../../Shared/BadgeWrapper'

export const RecipeResultCookCounter: FC<Pick<Recipe, 'name'>> = ({ name }) => {
    const [numberOfCooks, setNumberOfCooks] = useState(0)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        return FirebaseService.firestore
            .collection('cookCounter')
            .doc(name)
            .onSnapshot(documentSnapshot =>
                setNumberOfCooks(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            )
    }, [name])

    const handleClick = () => {
        setDisabled(true)
        FirebaseService.firestore
            .collection('cookCounter')
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) })
            .catch(console.error)
    }

    return (
        <Tooltip title="Gekocht Zähler erhöhen">
            <IconButton disabled={disabled} onClick={handleClick}>
                <BadgeWrapper badgeContent={numberOfCooks}>
                    <BookPlus color={disabled ? 'primary' : 'inherit'} />
                </BadgeWrapper>
            </IconButton>
        </Tooltip>
    )
}
