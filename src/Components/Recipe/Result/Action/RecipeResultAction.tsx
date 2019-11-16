import { Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { useBreakpointsContext } from '../../../Provider/BreakpointsProvider'
import { Comments } from '../../../Shared/Comments/Comments'
import { RecipeResultPin } from './RecipeResultPin'
import { RecipeResultRating } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

export type RecipeActions = {
    pinned?: boolean
    actions?: boolean
}

interface RecipeResultActionProps {
    name: string
    numberOfComments: number
}

const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>
) => event.stopPropagation()

export const RecipeResultAction: FC<RecipeResultActionProps> = ({ name, numberOfComments }) => {
    const { isPinnable } = useBreakpointsContext()

    return (
        <Grid
            justify="flex-end"
            container
            spacing={1}
            onClick={stopPropagation}
            onFocus={stopPropagation}>
            <Grid item>{isPinnable && <RecipeResultPin name={name} />}</Grid>
            <Grid item>
                <RecipeResultShare name={name} />
            </Grid>
            <Grid item>
                <Comments collection="recipes" numberOfComments={numberOfComments} name={name} />
            </Grid>
            <Grid item>
                <RecipeResultRating name={name} />
            </Grid>
        </Grid>
    )
}
