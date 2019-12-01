import { IconButton } from '@material-ui/core/'
import { Pin, PinOff } from 'mdi-material-ui'
import React, { FC } from 'react'

import { usePinnedRecipesContext } from '../../../Provider/PinnedRecipesProvider'

interface RecipeResultPinProps {
    name: string
}

export const RecipeResultPin: FC<RecipeResultPinProps> = ({ name }) => {
    const { handlePinnedChange, pinnedContains } = usePinnedRecipesContext()

    return (
        <IconButton onClick={() => handlePinnedChange(name)}>
            {pinnedContains(name) ? <PinOff /> : <Pin />}
        </IconButton>
    )
}
