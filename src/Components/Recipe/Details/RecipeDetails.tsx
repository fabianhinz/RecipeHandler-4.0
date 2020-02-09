import EditIcon from '@material-ui/icons/Edit'
import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { NavigateFab } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import Progress from '../../Shared/Progress'
import RecipeResult from '../Result/RecipeResult'

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })
    const { user } = useFirebaseAuthContext()

    return (
        <>
            {recipeDocLoading ? (
                <Progress variant="fixed" />
            ) : (
                <RecipeResult variant="details" recipe={recipeDoc} />
            )}

            {recipeDoc && user && (user.uid === recipeDoc.editorUid || user.admin) && (
                <NavigateFab
                    to={PATHS.recipeEdit(recipeDoc.name)}
                    icon={<EditIcon />}
                    tooltipTitle="Rezept bearbeiten"
                />
            )}
        </>
    )
}

export default RecipeDetails
