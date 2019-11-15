import React, { FC } from 'react'

import { useBreakpointsContext } from '../../../Provider/BreakpointsProvider'
import { Comments } from '../../../Shared/Comments/Comments'
import { RecipeResultPin } from './RecipeResultPin'
import { RecipeResultRating } from './RecipeResultRating'
import { RecipeResultShare } from './RecipeResultShare'

export type RecipeActions = {
    pinned?: boolean
    actionsEnabled?: boolean
}

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
    actionsEnabled,
}) => {
    const { isLowRes } = useBreakpointsContext()

    return (
        <>
            {actionsEnabled && (
                <div onClick={stopPropagation} onFocus={stopPropagation}>
                    {!isLowRes && <RecipeResultPin name={name} />}
                    <RecipeResultShare name={name} />
                    <Comments
                        collection="recipes"
                        numberOfComments={numberOfComments}
                        name={name}
                    />
                    <RecipeResultRating name={name} />
                </div>
            )}
        </>
    )
}
