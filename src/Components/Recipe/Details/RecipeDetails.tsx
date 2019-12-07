import EditIcon from '@material-ui/icons/Edit'
import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { NavigateFab } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import Progress from '../../Shared/Progress'
import RecipeResult from '../Result/RecipeResult'

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })

    return (
        <>
            {recipeDocLoading ? (
                <Progress variant="fixed" />
            ) : (
                <RecipeResult variant="details" recipe={recipeDoc} />
            )}

            {recipeDoc && <NavigateFab to={PATHS.recipeEdit(recipeDoc.name)} icon={<EditIcon />} />}
        </>
    )
}

export default RecipeDetails
