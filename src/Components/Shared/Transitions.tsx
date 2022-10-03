/* eslint-disable react/no-multi-comp */
import { Grow, Slide, Zoom } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import { forwardRef } from 'react'

const SlideUp = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ZoomIn = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />
})

const GrowIn = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} />
})

export { GrowIn, SlideUp, ZoomIn }
