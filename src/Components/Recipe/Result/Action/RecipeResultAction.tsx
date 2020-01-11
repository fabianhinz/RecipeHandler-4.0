import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { Comments } from '../../../Comments/Comments'
import { RecipeResultPin } from './RecipeResultPin'
import { RecipeResultRating } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

export type RecipeVariants = { variant: 'summary' | 'details' | 'pinned' | 'preview' | 'related' }

interface RecipeResultActionProps {
    name: string
    numberOfComments: number
    pinOnly: boolean
}

const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>
) => event.stopPropagation()

export const RecipeResultAction: FC<RecipeResultActionProps> = ({
    name,
    numberOfComments,
    pinOnly,
}) => (
    <Grid
        justify="flex-end"
        container
        spacing={1}
        onClick={stopPropagation}
        onFocus={stopPropagation}>
        <Grid item>
            <RecipeResultPin name={name} />
        </Grid>
        {!pinOnly && (
            <>
                <Grid item>
                    <RecipeResultShare name={name} />
                </Grid>
                <Grid item>
                    <Comments
                        collection="recipes"
                        numberOfComments={numberOfComments}
                        name={name}
                    />
                </Grid>
                <Grid item>
                    <RecipeResultRating name={name} />
                </Grid>
            </>
        )}
    </Grid>
)
