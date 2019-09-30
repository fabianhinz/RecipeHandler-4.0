import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { RecipeComments } from './Comments/RecipeComments'
import { RecipeResultPin } from './RecipeResultPin'
import { RecipeResultRating } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

interface RecipeResultActionProps {
    name: string
    source: 'fromCreate' | 'fromDraggable' | 'fromExpansionSummary' | 'fromRecentlyAdded'
    numberOfComments: number
}

export const RecipeResultAction: FC<RecipeResultActionProps> = ({
    name,
    source,
    numberOfComments,
}) => {
    return (
        <Grid item>
            <Grid container>
                {source !== 'fromDraggable' && source !== 'fromCreate' && (
                    <Grid item>
                        <RecipeResultPin name={name} />
                    </Grid>
                )}
                <Grid item>
                    <RecipeResultShare name={name} />
                </Grid>
                <Grid>
                    <RecipeComments numberOfComments={numberOfComments} name={name} />
                </Grid>
                <Grid>
                    <RecipeResultRating name={name} />
                </Grid>
            </Grid>
        </Grid>
    )
}
