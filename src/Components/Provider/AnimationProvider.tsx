import { createStyles, makeStyles, Tab, Tabs, useTheme } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useAttachmentRef } from '../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../model/model'
import { isMetadata } from '../../model/modelUtil'
import { BORDER_RADIUS } from '../../theme'
import { stopPropagationProps } from '../../util/constants'
import { useRouterContext } from './RouterProvider'

interface AnimationHandler {
    handleAnimation: (
        originId: string,
        attachments: (AttachmentMetadata | AttachmentData)[],
        activeAttachment: number
    ) => void
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
            zIndex: theme.zIndex.modal + 2,
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
            [theme.breakpoints.between('md', 'lg')]: {
                height: 600,
                width: 600,
            },
            [theme.breakpoints.up('xl')]: {
                height: 800,
                width: 800,
            },
            borderRadius: BORDER_RADIUS,
            position: 'relative',
        },
    })
)

interface AttachmentProps {
    attachment: AttachmentMetadata | AttachmentData
}

const Attachment = ({ attachment }: AttachmentProps) => {
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)

    return (
        <img
            alt=""
            width="100%"
            style={{ borderRadius: BORDER_RADIUS }}
            src={
                attachmentRefLoading
                    ? ''
                    : isMetadata(attachment)
                    ? attachmentRef.fullDataUrl
                    : attachment.dataUrl
            }
        />
    )
}
// ToDo Rename to SwipeableAttachmentProvider
const AnimationProvider: FC = ({ children }) => {
    const [originId, setOriginId] = useState<string | undefined>()
    const [attachments, setAttachments] = useState<
        (AttachmentMetadata | AttachmentData)[] | undefined
    >()
    const [tab, setTab] = useState(0)

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

    const initAnimation = (
        newOriginId?: string,
        attachments?: (AttachmentMetadata | AttachmentData)[],
        activeAttachment?: number
    ) => {
        if (!newOriginId) return

        setOriginId(newOriginId)
        setAttachments(attachments)
        setTab(activeAttachment || 0)

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
                boxShadow: 'unset',
                // zIndex: theme.zIndex.modal + 3,
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
                boxShadow: 'unset',
                // zIndex: theme.zIndex.modal + 3,
            },
        ]

        const options: KeyframeAnimationOptions = {
            duration: theme.transitions.duration.enteringScreen,
            fill: 'forwards',
        }

        animationRef.current = origin.animate(keyframes, options)
    }

    const handleAnimation = (
        newOriginId?: string,
        attachments?: (AttachmentMetadata | AttachmentData)[],
        activeAttachment?: number
    ) => {
        if (animationRef.current) {
            animationRef.current.reverse()
            animationRef.current = undefined
            setOriginId(undefined)
            setAttachments([])
            setTab(0)
        } else {
            initAnimation(newOriginId, attachments, activeAttachment)
        }
    }

    return (
        <>
            <Context.Provider value={{ handleAnimation }}>{children}</Context.Provider>
            <div
                onClick={() => handleAnimation()}
                className={clsx(classes.background, originId && classes.backgroundVisible)}>
                <div id="destination" className={classes.destination}>
                    <Tabs
                        {...stopPropagationProps}
                        variant="scrollable"
                        scrollButtons="on"
                        style={{ position: 'absolute', top: -56, width: '100%' }}
                        value={tab}
                        onChange={(_e, newValue) => setTab(newValue)}>
                        {attachments?.map((attachment, index) => (
                            <Tab key={index} label={attachment.name} />
                        ))}
                    </Tabs>
                    {attachments && (
                        <SwipeableViews index={tab}>
                            {attachments.map((attachment, index) => (
                                <Attachment key={index} attachment={attachment} />
                            ))}
                        </SwipeableViews>
                    )}
                </div>
            </div>
        </>
    )
}

export default AnimationProvider
