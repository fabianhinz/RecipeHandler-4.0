import { Container as MuiContainer, createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../Provider/PinnedRecipesProvider'

type Props = { children: React.ReactNode }

const useStyles = makeStyles(theme =>
    createStyles({
        pinnedContainer: {
            marginLeft: 320,
        },
    })
)

export const Container = ({ children }: Props) => {
    const { isHighRes } = useBreakpointsContext()
    const pinnedContext = usePinnedRecipesContext()
    const classes = useStyles()

    return (
        <MuiContainer
            className={clsx(
                !isHighRes && pinnedContext && pinnedContext.pinned && classes.pinnedContainer
            )}
            maxWidth={isHighRes ? 'xl' : 'lg'}>
            {children}
        </MuiContainer>
    )
}
