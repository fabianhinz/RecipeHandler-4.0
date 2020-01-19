import React, { useEffect } from 'react'

import ElementIdService from '../services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
}

const intersectionObserverId = ElementIdService.getId()

const useIntersectionObserver = ({ onIsIntersecting }: useIntersectionObserverOptions) => {
    useEffect(() => {
        const trigger = document.getElementById(intersectionObserverId)
        if (!trigger) return

        const observer = new IntersectionObserver(entries => {
            const [lastRecipeTrigger] = entries
            if (lastRecipeTrigger.isIntersecting) onIsIntersecting()
        })
        observer.observe(trigger)

        return () => observer.unobserve(trigger)
    }, [onIsIntersecting])

    return {
        IntersectionObserverTrigger: () => <div id={intersectionObserverId} />,
    }
}

export default useIntersectionObserver
