import { createStyles, makeStyles } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'

import ElementIdService from '../services/elementIdService'

interface useIntersectionObserverOptions {
    onIsIntersecting: () => void
    onLeave?: () => void
}

const useStyles = makeStyles(() =>
    createStyles({
        trigger: {
            minWidth: 1,
            minHeight: 1,
        },
    })
)

const useIntersectionObserver = ({ onIsIntersecting, onLeave }: useIntersectionObserverOptions) => {
    const idRef = useRef(ElementIdService.getId())
    const classes = useStyles()

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
        IntersectionObserverTrigger: () => <div className={classes.trigger} id={idRef.current} />,
    }
}

export default useIntersectionObserver
