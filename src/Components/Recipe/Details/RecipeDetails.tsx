import { Card, CardContent, createStyles, Fab, makeStyles, Zoom } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import React, { FC } from 'react'

import { useRecipeDoc } from '../../../hooks/useRecipeDoc'
import { RouteWithRecipeName } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { Loading } from '../../Shared/Loading'
import RecipeResult from '../Result/RecipeResult'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(4.5),
        },
    })
)

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps })
    const { user } = useFirebaseAuthContext()
    const classes = useStyles()

    return (
        <>
            <Card>
                <CardContent>
                    {recipeDocLoading ? (
                        <Loading />
                    ) : (
                        <RecipeResult recipe={recipeDoc} actionsEnabled />
                    )}
                </CardContent>
            </Card>
            {recipeDoc && user && !user.isAnonymous && (
                <Navigate to={PATHS.recipeEdit(recipeDoc.name)}>
                    <Zoom in>
                        <Fab className={classes.fab} color="secondary">
                            <EditIcon />
                        </Fab>
                    </Zoom>
                </Navigate>
            )}
        </>
    )
}

export default RecipeDetails
