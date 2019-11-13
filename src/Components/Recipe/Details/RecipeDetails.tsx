import { Card, CardContent } from '@material-ui/core'
import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { Loading } from '../../Shared/Loading'
import RecipeResult from '../Result/RecipeResult'

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })

    return (
        <Card>
            <CardContent>
                {recipeDocLoading ? (
                    <Loading variant="linear" />
                ) : (
                    <RecipeResult recipe={recipeDoc} actionsEnabled />
                )}
            </CardContent>
        </Card>
    )
}

export default RecipeDetails
