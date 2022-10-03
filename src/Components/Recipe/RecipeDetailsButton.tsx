import { IconButton, Tooltip } from '@material-ui/core'
import { Eye } from 'mdi-material-ui'
import { useHistory } from 'react-router-dom'

import { PATHS } from '@/Components/Routes/Routes'
import { Recipe } from '@/model/model'

interface Props {
    recipe?: Recipe | null
    name?: string
}

const RecipeDetailsButton = ({ recipe, name }: Props) => {
    const history = useHistory()

    const handleIconButtonClick = () => {
        if (recipe) history.push(PATHS.details(recipe.name), { recipe })
        else if (name) history.push(PATHS.details(name))
    }

    return (
        <Tooltip title="Details">
            <div>
                <IconButton disabled={!recipe && !name} onClick={handleIconButtonClick}>
                    <Eye />
                </IconButton>
            </div>
        </Tooltip>
    )
}

export default RecipeDetailsButton
