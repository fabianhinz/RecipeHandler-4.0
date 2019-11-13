import { Grow, Slide, Zoom } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import React from 'react'

export const SlideUp = React.forwardRef<unknown, TransitionProps>((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
))

export const ZoomIn = React.forwardRef<unknown, TransitionProps>((props, ref) => (
    <Zoom ref={ref} {...props} />
))

export const GrowIn = React.forwardRef<unknown, TransitionProps>((props, ref) => (
    <Grow ref={ref} {...props} />
))
