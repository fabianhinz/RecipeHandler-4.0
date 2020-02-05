import {
    Button,
    Chip,
    createStyles,
    Fab,
    Grid,
    makeStyles,
    Slide,
    useTheme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import { CalendarMonth, ChevronLeft, ChevronRight, Sd } from 'mdi-material-ui'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useAttachmentRef } from '../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../model/model'
import { isMetadata } from '../../model/modelUtil'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import AccountChip from '../Account/AccountChip'
import { useBreakpointsContext } from './BreakpointsProvider'
import { useRouterContext } from './RouterProvider'

interface AnimationHandler {
    handleAnimation: (
        originId: string,
        attachments: (AttachmentMetadata | AttachmentData)[],
        activeAttachment: number
    ) => void
}

const Context = React.createContext<AnimationHandler | null>(null)

export const useSwipeableAttachmentContext = () => useContext(Context) as AnimationHandler

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
            backgroundColor: theme.palette.background.paper,
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.enteringScreen,
            }),
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        backgroundVisible: {
            zIndex: theme.zIndex.modal + 2,
            opacity: 1,
        },
        destination: {
            [theme.breakpoints.only('xs')]: {
                width: 300,
                height: 168.75,
            },
            [theme.breakpoints.only('sm')]: {
                width: 500,
                height: 337.5,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                width: 800,
                height: 450,
            },
            [theme.breakpoints.up('xl')]: {
                width: 1280,
                height: 720,
            },
            borderRadius: BORDER_RADIUS,
            position: 'relative',
        },
        attachment: {
            overflow: 'hidden',
        },
        attachmentMetadata: {
            position: 'absolute',
            bottom: theme.spacing(1),
            right: theme.spacing(1),
            width: '100%',
        },
        attachmentChipMetadata: {
            boxShadow: theme.shadows[4],
        },
        deleteBtn: {
            position: 'absolute',
            bottom: '10%',
        },
    })
)

interface AttachmentProps {
    attachment: AttachmentMetadata | AttachmentData
}

const Attachment = ({ attachment }: AttachmentProps) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
    const classes = useStyles()

    return (
        <div className={clsx(classes.destination, classes.attachment)}>
            {!imgLoaded && (
                <Skeleton
                    style={{ borderRadius: BORDER_RADIUS }}
                    variant="rect"
                    width="100%"
                    height="100%"
                />
            )}
            {!attachmentRefLoading && (
                <img
                    alt=""
                    width="100%"
                    onLoad={() => setImgLoaded(true)}
                    src={isMetadata(attachment) ? attachmentRef.fullDataUrl : attachment.dataUrl}
                />
            )}
            <Slide direction="up" in={attachmentRef.timeCreated.length > 0}>
                <div className={classes.attachmentMetadata}>
                    <Grid container justify="flex-end" spacing={1}>
                        <Grid item>
                            <Chip
                                className={classes.attachmentChipMetadata}
                                icon={<CalendarMonth />}
                                label={attachmentRef.timeCreated}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                className={classes.attachmentChipMetadata}
                                icon={<Sd />}
                                label={attachmentRef.size}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Slide>
            <AccountChip variant="absolute" uid={attachment.editorUid} />
        </div>
    )
}

const SwipeableAttachmentProvider: FC = ({ children }) => {
    const [originId, setOriginId] = useState<string | undefined>()
    const [attachments, setAttachments] = useState<
        (AttachmentMetadata | AttachmentData)[] | undefined
    >()
    const [activeAttachment, setActiveAttachment] = useState(0)

    const animationRef = useRef<Animation | undefined>()

    const classes = useStyles()
    const theme = useTheme()

    const { location } = useRouterContext()
    const { isMobile } = useBreakpointsContext()

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
        setActiveAttachment(activeAttachment || 0)

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
                zIndex: theme.zIndex.modal + 3,
                opacity: 1,
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
                zIndex: theme.zIndex.modal + 3,
                opacity: 0,
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
            setActiveAttachment(0)
        } else {
            initAnimation(newOriginId, attachments, activeAttachment)
        }
    }

    const handleDeleteBtnClick = () => {
        if (!attachments) return

        const attachment = attachments[activeAttachment]
        if (isMetadata(attachment)) {
            console.log(FirebaseService.storageRef.child(attachment.fullPath))
        } else {
            setAttachments(prev =>
                prev?.filter(prevAttachment => prevAttachment.name !== attachment.name)
            )
        }
    }

    return (
        <>
            <Context.Provider value={{ handleAnimation }}>{children}</Context.Provider>
            <div className={clsx(classes.background, originId && classes.backgroundVisible)}>
                <Fab
                    size={isMobile ? 'medium' : 'large'}
                    onClick={() => setActiveAttachment(prev => --prev)}
                    disabled={activeAttachment === 0}>
                    <ChevronLeft />
                </Fab>
                <div
                    onClick={() => handleAnimation()}
                    id="destination"
                    className={classes.destination}>
                    {attachments && (
                        <SwipeableViews index={activeAttachment}>
                            {attachments.map((attachment, index) => (
                                <Attachment key={index} attachment={attachment} />
                            ))}
                        </SwipeableViews>
                    )}
                </div>
                <Fab
                    size={isMobile ? 'medium' : 'large'}
                    onClick={() => setActiveAttachment(prev => ++prev)}
                    disabled={attachments && activeAttachment === attachments.length - 1}>
                    <ChevronRight />
                </Fab>
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    size={isMobile ? 'medium' : 'large'}
                    color="primary"
                    onClick={handleDeleteBtnClick}
                    className={classes.deleteBtn}>
                    löschen
                </Button>
            </div>
        </>
    )
}

export default SwipeableAttachmentProvider
