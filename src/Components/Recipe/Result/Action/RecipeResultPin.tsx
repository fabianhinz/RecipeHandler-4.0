import { IconButton } from '@material-ui/core/'
import { Pin, PinOff } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useDraggableRecipesContext } from '../../../Provider/DraggableRecipesProvider'

interface RecipeResultPinProps {
    name: string
}

export const RecipeResultPin: FC<RecipeResultPinProps> = ({ name }) => {
    const { handleDraggableChange, draggableContains } = useDraggableRecipesContext()

    return (
        <IconButton onClick={() => handleDraggableChange(name)}>
            {draggableContains(name) ? <PinOff /> : <Pin />}
        </IconButton>
    )
}
