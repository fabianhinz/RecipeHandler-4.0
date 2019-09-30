import { Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import React from 'react'

export const SlideUp = React.forwardRef<unknown, TransitionProps>((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
))
