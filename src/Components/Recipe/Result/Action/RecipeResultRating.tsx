import { IconButton } from '@material-ui/core/'
import FavoriteIcon from '@material-ui/icons/FavoriteTwoTone'
import React, { FC, useEffect, useState } from 'react'

import { AttachementMetadata, Recipe } from '../../../../model/model'
import { FirebaseService } from '../../../../services/firebase'
import { BadgeWrapper } from '../../../Shared/BadgeWrapper'

export const RecipeResultRating: FC<Pick<Recipe<AttachementMetadata>, 'name'>> = ({ name }) => {
    const [rating, setRating] = useState(0)

    useEffect(() => {
        return FirebaseService.firestore
            .collection('rating')
            .doc(name)
            .onSnapshot(documentSnapshot =>
                setRating(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            )
    }, [name])

    const handleClick = () => {
        FirebaseService.firestore
            .collection('rating')
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) })
            .catch(console.error)
    }

    return (
        <IconButton disableRipple onClick={handleClick}>
            <BadgeWrapper badgeContent={rating}>
                <FavoriteIcon color="error" />
            </BadgeWrapper>
        </IconButton>
    )
}
