import { Container as MuiContainer } from '@material-ui/core'
import React from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'

type Props = { children: React.ReactNode; className?: string }

export const Container = ({ children, className }: Props) => {
    const { isHighRes } = useBreakpointsContext()

    return (
        <MuiContainer className={className} maxWidth={isHighRes ? 'xl' : 'lg'}>
            {children}
        </MuiContainer>
    )
}
