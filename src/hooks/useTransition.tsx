import { useState } from 'react'

export const TRANSITION_DURATION = 250

export const useTransition = () => {
    const [visible, setVisible] = useState(true)

    const componentTransition = (callback: () => void) => {
        setVisible(false)
        setTimeout(callback, TRANSITION_DURATION)
    }

    return { componentVisible: visible, componentTransition }
}
