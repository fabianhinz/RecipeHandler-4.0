import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { Comments } from '../../../Shared/Comments/Comments'
import { RecipeResultPin } from './RecipeResultPin'
import { RecipeResultRating } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

export type RecipeActions = { actionProps: { draggEnabled: boolean; actionsEnabled: boolean } }

interface RecipeResultActionProps extends RecipeActions {
    name: string
    numberOfComments: number
}

const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>
) => event.stopPropagation()

export const RecipeResultAction: FC<RecipeResultActionProps> = ({
    name,
    numberOfComments,
    actionProps,
}) => {
    return (
        <>
            {actionProps.actionsEnabled && (
                <Grid item onClick={stopPropagation} onFocus={stopPropagation}>
                    <Grid container>
                        <Grid item>
                            <RecipeResultPin name={name} />
                        </Grid>
                        <Grid item>
                            <RecipeResultShare name={name} />
                        </Grid>
                        <Grid>
                            <Comments
                                collection="recipes"
                                numberOfComments={numberOfComments}
                                name={name}
                            />
                        </Grid>
                        <Grid>
                            <RecipeResultRating name={name} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </>
    )
}
