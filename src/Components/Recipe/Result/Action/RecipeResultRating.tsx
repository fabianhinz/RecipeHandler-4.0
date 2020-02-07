import { IconButton } from '@material-ui/core/'
import FavoriteIcon from '@material-ui/icons/Favorite'
import React, { FC, useEffect, useState } from 'react'

import { Recipe } from '../../../../model/model'
import { FirebaseService } from '../../../../services/firebase'
import { BadgeWrapper } from '../../../Shared/BadgeWrapper'

export const RecipeResultRating: FC<Pick<Recipe, 'name'>> = ({ name }) => {
    const [rating, setRating] = useState(0)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        return FirebaseService.firestore
            .collection('rating')
            .doc(name)
            .onSnapshot(documentSnapshot =>
                setRating(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            )
    }, [name])

    const handleClick = () => {
        setDisabled(true)
        FirebaseService.firestore
            .collection('rating')
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) })
            .catch(console.error)
    }

    return (
        <IconButton disabled={disabled} onClick={handleClick}>
            <BadgeWrapper badgeContent={rating}>
                <FavoriteIcon color={disabled ? 'primary' : 'error'} />
            </BadgeWrapper>
        </IconButton>
    )
}
