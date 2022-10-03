import { makeStyles } from '@material-ui/core'
import { useLayoutEffect, useRef } from 'react'

import ElementIdService from '@/services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
    onLeave?: () => void
    options?: IntersectionObserverInit
}

const useStyles = makeStyles(() => ({
    trigger: {
        minWidth: 1,
        minHeight: 1,
    },
}))

const useIntersectionObserver = ({
    onIsIntersecting,
    onLeave,
    options,
}: useIntersectionObserverOptions) => {
    const idRef = useRef(ElementIdService.getId())
    const classes = useStyles()

    useLayoutEffect(() => {
        const trigger = document.getElementById(idRef.current)
        if (!trigger) return

        const observer = new IntersectionObserver(entries => {
            const [lastRecipeTrigger] = entries
            if (lastRecipeTrigger.isIntersecting) onIsIntersecting()
            else if (onLeave) onLeave()
        }, options)
        observer.observe(trigger)

        return () => observer.unobserve(trigger)
    }, [onIsIntersecting, onLeave, options])

    return {
        IntersectionObserverTrigger: () => <div className={classes.trigger} id={idRef.current} />,
    }
}

export default useIntersectionObserver
