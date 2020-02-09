import React, { useEffect } from 'react'

import ElementIdService from '../services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
    onLeave?: () => void
}

const intersectionObserverId = ElementIdService.getId()

const useIntersectionObserver = ({ onIsIntersecting, onLeave }: useIntersectionObserverOptions) => {
    useEffect(() => {
        const trigger = document.getElementById(intersectionObserverId)
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
        IntersectionObserverTrigger: () => <div id={intersectionObserverId} />,
    }
}

export default useIntersectionObserver
