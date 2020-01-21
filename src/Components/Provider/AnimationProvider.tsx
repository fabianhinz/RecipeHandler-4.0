import { createStyles, makeStyles, useTheme } from '@material-ui/core'
import clsx from 'clsx'
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
        background: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
            opacity: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.enteringScreen,
            }),
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        backgroundVisible: {
            zIndex: theme.zIndex.appBar,
            opacity: 1,
        },
        destination: {
            [theme.breakpoints.only('xs')]: {
                width: 320,
                height: 320,
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
            borderRadius: BORDER_RADIUS,
        },
    })
)
// ! ToDo: handle img ratio
const AnimationProvider: FC = ({ children }) => {
    const [originId, setOriginId] = useState<string | undefined>()
    const animationRef = useRef<Animation | undefined>()

    const { location } = useRouterContext()
    const classes = useStyles()
    const theme = useTheme()

    useEffect(() => {
        setOriginId(undefined)
        animationRef.current = undefined
    }, [location.pathname])

    useEffect(() => {
        const root = document.getElementsByTagName('html')[0]
        if (originId) root.setAttribute('style', 'overflow: hidden;')
        if (!originId) root.removeAttribute('style')
    }, [originId])

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
                zIndex: theme.zIndex.appBar + 1,
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
                zIndex: theme.zIndex.appBar + 1,
            },
        ]

        const options: KeyframeAnimationOptions = {
            duration: theme.transitions.duration.enteringScreen,
            fill: 'forwards',
        }

        animationRef.current = origin.animate(keyframes, options)
    }

    const handleAnimation = (newOriginId?: string) => {
        if (animationRef.current) {
            animationRef.current.reverse()
            animationRef.current = undefined
            setOriginId(undefined)
        } else {
            initAnimation(newOriginId)
        }
    }

    return (
        <>
            <Context.Provider value={{ handleAnimation }}>{children}</Context.Provider>
            <div
                onClick={() => handleAnimation()}
                className={clsx(classes.background, originId && classes.backgroundVisible)}>
                <div id="destination" className={classes.destination} />
            </div>
        </>
    )
}

export default AnimationProvider
