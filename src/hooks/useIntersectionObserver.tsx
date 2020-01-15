import React, { useEffect } from 'react'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
}

const useIntersectionObserver = ({ onIsIntersecting }: useIntersectionObserverOptions) => {
    useEffect(() => {
        const trigger = document.getElementById('intersection-observer-trigger')
        if (!trigger) return

        const observer = new IntersectionObserver(entries => {
            const [lastRecipeTrigger] = entries
            if (lastRecipeTrigger.isIntersecting) onIsIntersecting()
        })
        observer.observe(trigger)

        return () => observer.unobserve(trigger)
    }, [onIsIntersecting])

    return {
        IntersectionObserverTrigger: () => <div id="intersection-observer-trigger" />,
    }
}

export default useIntersectionObserver
