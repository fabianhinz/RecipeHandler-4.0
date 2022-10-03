import { FC } from 'react'

import Progress from '@/Components/Shared/Progress'
import { useRecipeDoc } from '@/hooks/useRecipeDoc'
import { RouteWithRecipeName } from '@/model/model'

import RecipeCreate from '../Create/RecipeCreate'

const RecipeEdit: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({
        recipeName: routeProps.match.params.name,
    })

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
