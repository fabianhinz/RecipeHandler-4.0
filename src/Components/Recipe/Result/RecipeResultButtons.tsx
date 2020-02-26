import { Grid } from '@material-ui/core'
import React from 'react'

import { stopPropagationProps } from '../../../util/constants'
import { Comments } from '../../Comments/Comments'
import RecipeBookmarkButton from '../RecipeBookmarkButton'
import RecipeCookCounterButton from '../RecipeCookCounterButton'
import RecipeShareButton from '../RecipeShareButton'

interface Props {
    name: string
    numberOfComments: number
}

const RecipeResultButtons = ({ name, numberOfComments }: Props) => (
    <Grid justify="space-evenly" container spacing={1} {...stopPropagationProps}>
        <Grid item>
            <RecipeBookmarkButton name={name} />
        </Grid>

        <Grid item>
            <RecipeShareButton name={name} />
        </Grid>
        <Grid item>
            <Comments collection="recipes" numberOfComments={numberOfComments} name={name} />
        </Grid>
        <Grid item>
            <RecipeCookCounterButton name={name} />
        </Grid>
    </Grid>
)

export default RecipeResultButtons
