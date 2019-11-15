import { Card, CardContent } from '@material-ui/core'
import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { Loading } from '../../Shared/Loading'
import RecipeCreate from '../Create/RecipeCreate'

const RecipeEdit: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })

    return (
        <>
            {recipeDocLoading ? (
                <Card>
                    <CardContent>
                        <Loading />
                    </CardContent>
                </Card>
            ) : (
                <RecipeCreate {...routeProps} recipe={recipeDoc} edit />
            )}
        </>
    )
}

export default RecipeEdit
