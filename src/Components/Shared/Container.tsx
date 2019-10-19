import { Container as MuiContainer } from '@material-ui/core'
import React from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'

type Props = { children: React.ReactNode }

export const Container = ({ children }: Props) => {
    const { isHighRes } = useBreakpointsContext()

    return <MuiContainer maxWidth={isHighRes ? 'xl' : 'lg'}>{children}</MuiContainer>
}
