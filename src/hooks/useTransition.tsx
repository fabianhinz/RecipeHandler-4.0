import { TransitionProps } from '@material-ui/core/transitions'
import { useState } from 'react'

const TRANSITION_DURATION = 250

export const getTransitionTimeoutProps = (transitionOrder: number) =>
    ({
        enter: TRANSITION_DURATION * transitionOrder,
        exit: TRANSITION_DURATION,
    } as TransitionProps['timeout'])

export const useTransition = () => {
    const [transition, setTransition] = useState(true)

    const transitionChange = async () =>
        new Promise(resolve => {
            setTransition(false)
            setTimeout(resolve, TRANSITION_DURATION)
        })

    return { transition, transitionChange }
}
