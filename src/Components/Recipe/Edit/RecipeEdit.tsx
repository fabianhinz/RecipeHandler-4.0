import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import Progress from '../../Shared/Progress'
import RecipeCreate from '../Create/RecipeCreate'

const RecipeEdit: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })

    return (
        <>
            {recipeDocLoading ? (
                <Progress variant="fixed" />
            ) : (
                <RecipeCreate {...routeProps} recipe={recipeDoc} edit />
            )}
        </>
    )
}

export default RecipeEdit
