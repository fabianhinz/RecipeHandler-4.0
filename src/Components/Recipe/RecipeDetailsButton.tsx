import { IconButton, Tooltip } from '@material-ui/core'
import { Eye } from 'mdi-material-ui'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { Recipe } from '../../model/model'
import { PATHS } from '../Routes/Routes'

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
