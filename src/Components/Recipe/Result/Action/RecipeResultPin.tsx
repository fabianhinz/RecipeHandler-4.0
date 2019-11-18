import { IconButton } from '@material-ui/core/'
import DetailsIcon from '@material-ui/icons/RemoveRedEyeRounded'
import { Pin, PinOff } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useBreakpointsContext } from '../../../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../../../Provider/PinnedRecipesProvider'
import { useRouterContext } from '../../../Provider/RouterProvider'
import { PATHS } from '../../../Routes/Routes'

interface RecipeResultPinProps {
    name: string
}

export const RecipeResultPin: FC<RecipeResultPinProps> = ({ name }) => {
    const { handlePinnedChange, pinnedContains } = usePinnedRecipesContext()
    const { isPinnable } = useBreakpointsContext()
    const { history } = useRouterContext()

    const handleClick = () => {
        if (isPinnable) handlePinnedChange(name)
        else history.push(PATHS.details(name))
    }

    return (
        <IconButton onClick={handleClick}>
            {!isPinnable ? <DetailsIcon /> : pinnedContains(name) ? <PinOff /> : <Pin />}
        </IconButton>
    )
}
