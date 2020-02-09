import React, { useEffect, useRef } from 'react'

import ElementIdService from '../services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
    onLeave?: () => void
}

const useIntersectionObserver = ({ onIsIntersecting, onLeave }: useIntersectionObserverOptions) => {
    const idRef = useRef(ElementIdService.getId())

    useEffect(() => {
        const trigger = document.getElementById(idRef.current)
        if (!trigger) return

        const observer = new IntersectionObserver(entries => {
            const [lastRecipeTrigger] = entries
            if (lastRecipeTrigger.isIntersecting) onIsIntersecting()
            else if (onLeave) onLeave()
        })
        observer.observe(trigger)

        return () => observer.unobserve(trigger)
    }, [onIsIntersecting, onLeave])

    return {
        IntersectionObserverTrigger: () => <div id={idRef.current} />,
    }
}

export default useIntersectionObserver
