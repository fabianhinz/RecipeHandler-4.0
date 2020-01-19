import { createStyles, makeStyles, useTheme } from '@material-ui/core'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'

import { BORDER_RADIUS } from '../../theme'
import { useRouterContext } from './RouterProvider'

interface AnimationHandler {
    handleAnimation: (originId: string) => void
}

const Context = React.createContext<AnimationHandler | null>(null)

export const useAnimationContext = () => useContext(Context) as AnimationHandler

const useStyles = makeStyles(theme =>
    createStyles({
        destination: {
            zIndex: -1,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            [theme.breakpoints.only('xs')]: {
                height: 300,
                width: 300,
            },
            [theme.breakpoints.only('sm')]: {
                height: 500,
                width: 500,
            },
            [theme.breakpoints.only('md')]: {
                height: 600,
                width: 600,
            },
            [theme.breakpoints.only('lg')]: {
                height: 700,
                width: 700,
            },
            [theme.breakpoints.up('xl')]: {
                height: 900,
                width: 900,
            },
        },
    })
)
// ! ToDo: handle img ratio
const AnimationProvider: FC = ({ children }) => {
    const [originId, setOriginId] = useState<string | undefined>()
    const animationRef = useRef<Animation | null>(null)

    const { location } = useRouterContext()
    const classes = useStyles()
    const theme = useTheme()

    useEffect(() => {
        setOriginId(undefined)
    }, [location.pathname])

    const initAnimation = (newOriginId?: string) => {
        if (!newOriginId) return

        setOriginId(newOriginId)

        const origin = document.getElementById(newOriginId)
        const destination = document.getElementById('destination')

        if (!origin || !destination) return

        const originRect = origin.getBoundingClientRect()
        const destinationRect = destination.getBoundingClientRect()

        const keyframes: Keyframe[] = [
            {
                top: `${originRect.top}px`,
                left: `${originRect.left}px`,
                position: 'fixed',
                transform: `
                    translate(0px,0px)
                    scale(1,1)
                `,
                borderRadius: '50%',
                zIndex: 1,
            },
            {
                transform: `
                    translate(-50%,-50%)
                    scale(${destinationRect.width / originRect.width},${destinationRect.height /
                    originRect.height})
                `,
                position: 'fixed',
                top: '50%',
                left: '50%',
                borderRadius: `${BORDER_RADIUS}px`,
                zIndex: 1,
            },
        ]

        const options: KeyframeAnimationOptions = {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
            fill: 'forwards',
        }

        animationRef.current = origin.animate(keyframes, options)
    }

    const handleAnimation = (newOriginId?: string) => {
        if (animationRef.current) {
            animationRef.current.reverse()
            animationRef.current = null

            // ? if a new originId comes around we wait till the old origin is reversed
            if (originId !== newOriginId)
                setTimeout(() => {
                    initAnimation(newOriginId)
                }, theme.transitions.duration.complex)
        } else {
            initAnimation(newOriginId)
        }
    }

    return (
        <>
            <Context.Provider value={{ handleAnimation }}>{children}</Context.Provider>
            <div
                onClick={() => handleAnimation()}
                id="destination"
                className={classes.destination}
            />
        </>
    )
}

export default AnimationProvider
