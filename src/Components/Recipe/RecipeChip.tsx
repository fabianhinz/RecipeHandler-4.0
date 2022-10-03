import { Avatar, Chip } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import { PATHS } from '@/Components/Routes/Routes'
import { useRecipeDoc } from '@/hooks/useRecipeDoc'

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
