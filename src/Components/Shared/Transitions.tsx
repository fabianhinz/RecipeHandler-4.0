import { Grow, Slide, Zoom } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import React from 'react'

const SlideUp = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ZoomIn = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />
})

const GrowIn = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} />
})

export { SlideUp, ZoomIn, GrowIn }
