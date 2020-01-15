import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { stopPropagationProps } from '../../../../util/constants'
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

export const RecipeResultAction: FC<RecipeResultActionProps> = ({
    name,
    numberOfComments,
    pinOnly,
}) => (
    <Grid justify="flex-end" container spacing={1} {...stopPropagationProps}>
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
