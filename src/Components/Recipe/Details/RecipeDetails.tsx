import EditIcon from '@material-ui/icons/Edit'
import React, { FC } from 'react'

import useDocumentTitle from '../../../hooks/useDocumentTitle'
import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { PATHS } from '../../Routes/Routes'
import { SecouredRouteFab } from '../../Routes/SecouredRouteFab'
import Progress from '../../Shared/Progress'
import RecipeResult from '../Result/RecipeResult'

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })
    const { user } = useFirebaseAuthContext()

    useDocumentTitle(recipeDoc ? recipeDoc.name : recipeDocLoading ? 'Wird geladen...' : '404')

    return (
        <>
            {recipeDocLoading ? <Progress variant="cover" /> : <RecipeResult recipe={recipeDoc} />}

            {recipeDoc && user && (user.uid === recipeDoc.editorUid || user.admin) && (
                <SecouredRouteFab
                    pathname={PATHS.recipeEdit(recipeDoc.name)}
                    icon={<EditIcon />}
                    tooltipTitle="Rezept bearbeiten"
                />
            )}
        </>
    )
}

export default RecipeDetails
