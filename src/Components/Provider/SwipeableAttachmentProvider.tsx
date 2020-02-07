import {
    Chip,
    createStyles,
    Fab,
    Grid,
    IconButton,
    makeStyles,
    Slide,
    useTheme,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import { CalendarMonth, ChevronLeft, ChevronRight, Download, Sd } from 'mdi-material-ui'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import AccountChip from '../Account/AccountChip'
import { useBreakpointsContext } from './BreakpointsProvider'
import { useRouterContext } from './RouterProvider'

interface AnimationHandler {
    handleAnimation: (
        originId: string,
        attachments: AttachmentDoc[],
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
            [theme.breakpoints.only('md')]: {
                width: 700,
                height: 393.75,
            },
            [theme.breakpoints.only('lg')]: {
                width: 900,
                height: 506.25,
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
        btnContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            padding: theme.spacing(2),
        },
    })
)

interface SwipeableAttachmentProps {
    attachment: AttachmentDoc
}

const SwipeableAttachment = ({ attachment }: SwipeableAttachmentProps) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const { attachmentRef, attachmentRefLoading } = useAttachment(attachment)
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
                    src={attachmentRef.fullDataUrl}
                />
            )}
            <Slide direction="up" in={attachmentRef.timeCreated.length > 0}>
                <div className={classes.attachmentMetadata}>
                    <Grid container justify="flex-end" spacing={1}>
                        <Grid item>
                            <Chip
                                size="small"
                                className={classes.attachmentChipMetadata}
                                icon={<CalendarMonth />}
                                label={attachmentRef.timeCreated}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                size="small"
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
    const [attachments, setAttachments] = useState<AttachmentDoc[] | undefined>()
    const [activeAttachment, setActiveAttachment] = useState(0)

    const animationRef = useRef<Animation | undefined>()

    const classes = useStyles()
    const theme = useTheme()

    const { location } = useRouterContext()
    const { isMobile } = useBreakpointsContext()

    useEffect(() => {
        if (!attachments) return
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && activeAttachment !== 0) {
                setActiveAttachment(prev => --prev)
            } else if (event.key === 'ArrowRight' && activeAttachment !== attachments.length - 1) {
                setActiveAttachment(prev => ++prev)
            } else if (event.key === 'Escape') {
                handleAnimation()
            }
        }
        document.addEventListener('keydown', handleKeydown)
        return () => document.removeEventListener('keydown', handleKeydown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAttachment, attachments])

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
        attachments?: AttachmentDoc[],
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
        attachments?: AttachmentDoc[],
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

    const handleDelete = () => {
        if (!attachments) return

        const attachment = attachments[activeAttachment]

        if (attachment.fullPath) console.log(FirebaseService.storageRef.child(attachment.fullPath))
    }

    const handleDownload = async () => {
        if (!attachments) return

        const link = document.createElement('a')
        link.href = await FirebaseService.storageRef
            .child(attachments[activeAttachment].fullPath)
            .getDownloadURL()

        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                <div id="destination" className={classes.destination}>
                    {attachments && (
                        <SwipeableViews index={activeAttachment}>
                            {attachments.map((attachment, index) => (
                                <SwipeableAttachment key={index} attachment={attachment} />
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
                <Grid container justify="flex-end" spacing={1} className={classes.btnContainer}>
                    <Grid item>
                        <IconButton onClick={() => handleAnimation()}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleDownload}>
                            <Download />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default SwipeableAttachmentProvider
