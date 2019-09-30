import { IconButton } from '@material-ui/core/'
import FavoriteIcon from '@material-ui/icons/FavoriteTwoTone'
import React, { FC, useEffect, useState } from 'react'

import { FirebaseService } from '../../firebase'
import { AttachementMetadata, Recipe } from '../../model/model'
import { BadgeWrapper } from '../Shared/BadgeWrapper'

export const RecipeRating: FC<Pick<Recipe<AttachementMetadata>, 'name'>> = ({ name }) => {
    const [rating, setRating] = useState(0)

    useEffect(() => {
        return FirebaseService.firestore
            .collection('rating')
            .doc(name)
            .onSnapshot(documentSnapshot =>
                setRating(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            )
    }, [name])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
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
