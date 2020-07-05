import { makeStyles } from '@material-ui/core'
import React, { useLayoutEffect, useRef } from 'react'

import ElementIdService from '../services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
    onLeave?: () => void
}

const useStyles = makeStyles(() => ({
    trigger: {
        minWidth: 1,
        minHeight: 1,
    },
}))

const useIntersectionObserver = ({ onIsIntersecting, onLeave }: useIntersectionObserverOptions) => {
    const idRef = useRef(ElementIdService.getId())
    const classes = useStyles()

    useLayoutEffect(() => {
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
        IntersectionObserverTrigger: () => <div className={classes.trigger} id={idRef.current} />,
    }
}

export default useIntersectionObserver
