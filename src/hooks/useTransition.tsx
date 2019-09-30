import { useState } from 'react'

export const useTransition = () => {
    const [visible, setVisible] = useState(true)

    const componentTransition = (callback: () => void) => {
        setVisible(false)
        setTimeout(callback, 200)
    }

    return { componentVisible: visible, componentTransition }
}
