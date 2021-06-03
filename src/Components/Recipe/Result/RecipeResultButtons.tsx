import { Grid } from '@material-ui/core'

import { stopPropagationProps } from '../../../util/constants'
import { Comments } from '../../Comments/Comments'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import RecipeBookmarkButton from '../RecipeBookmarkButton'
import RecipeCookCounterButton from '../RecipeCookCounterButton'
import RecipeGridButton from '../RecipeGridButton'
import RecipeShareButton from '../RecipeShareButton'

interface Props {
    name: string
    numberOfComments?: number
}

const RecipeResultButtons = ({ name, numberOfComments }: Props) => {
    const authContext = useFirebaseAuthContext()

    return (
        <Grid justify="space-evenly" container spacing={1} {...stopPropagationProps}>
            {authContext.user && (
                <Grid item>
                    <RecipeGridButton />
                </Grid>
            )}
            <Grid item>
                <RecipeBookmarkButton name={name} />
            </Grid>

            <Grid item>
                <RecipeShareButton name={name} />
            </Grid>
            {numberOfComments !== undefined && (
                <>
                    <Grid item>
                        <Comments
                            collection="recipes"
                            numberOfComments={numberOfComments}
                            name={name}
                        />
                    </Grid>
                    <Grid item>
                        <RecipeCookCounterButton name={name} />
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default RecipeResultButtons
