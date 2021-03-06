import { Avatar, Chip } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { useRecipeDoc } from '../../hooks/useRecipeDoc'
import { PATHS } from '../Routes/Routes'

type Props = {
    recipeName: string
}

const RecipeChip = (props: Props) => {
    const history = useHistory()

    const { recipeDoc } = useRecipeDoc({ recipeName: props.recipeName })

    return (
        <Chip
            avatar={
                <Avatar src={recipeDoc?.previewAttachment}>{props.recipeName.slice(0, 1)}</Avatar>
            }
            onClick={() => history.push(PATHS.details(props.recipeName))}
            label={props.recipeName}
        />
    )
}

export default RecipeChip
