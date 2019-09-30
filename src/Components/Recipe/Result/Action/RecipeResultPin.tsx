import { IconButton } from '@material-ui/core/'
import { Pin } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useDraggableRecipesContext } from '../../../Provider/DraggableRecipesProvider'

interface RecipeResultPinProps {
    name: string
}

export const RecipeResultPin: FC<RecipeResultPinProps> = ({ name }) => {
    const { handleDraggableChange } = useDraggableRecipesContext()

    return (
        <IconButton onClick={() => handleDraggableChange(name)}>
            <Pin />
        </IconButton>
    )
}
