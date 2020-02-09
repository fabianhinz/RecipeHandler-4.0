import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { stopPropagationProps } from '../../../../util/constants'
import { Comments } from '../../../Comments/Comments'
import { RecipeResultBookmark } from './RecipeResultBookmark'
import { RecipeResultCookCounter } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

export type RecipeVariants = { variant: 'details' | 'preview' | 'related' }

interface RecipeResultActionProps {
    name: string
    numberOfComments: number
}

export const RecipeResultAction: FC<RecipeResultActionProps> = ({ name, numberOfComments }) => (
    <Grid justify="flex-end" container spacing={1} {...stopPropagationProps}>
        <Grid item>
            <RecipeResultBookmark name={name} />
        </Grid>

        <Grid item>
            <RecipeResultShare name={name} />
        </Grid>
        <Grid item>
            <Comments collection="recipes" numberOfComments={numberOfComments} name={name} />
        </Grid>
        <Grid item>
            <RecipeResultCookCounter name={name} />
        </Grid>
    </Grid>
)
