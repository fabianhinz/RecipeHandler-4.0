import {
  Chip,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Slide,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import { Alert, AlertProps, Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import { CalendarMonth, ChevronLeft, ChevronRight, Download, FileImage, Sd } from 'mdi-material-ui'
import React, { FC, ReactText, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { isSafari } from '../../util/constants'
import AccountChip from '../Account/AccountChip'
import { PATHS } from '../Routes/Routes'
import { useRouterContext } from './RouterProvider'

interface AnimationHandler {
  handleAnimation: (
    originId: string,
    attachments: AttachmentDoc[],
    activeAttachment: number
  ) => void
}

const Context = React.createContext<AnimationHandler | null>(null)

export const useAttachmentGalleryContext = () => useContext(Context) as AnimationHandler

const useStyles = makeStyles(theme => ({
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.modal + 2,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },

  destination: {
    [theme.breakpoints.only('xs')]: {
      width: 320,
      height: 180,
    },
    [theme.breakpoints.only('sm')]: {
      width: 480,
      height: 270,
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
    display: 'flex',
    justifyContent: 'center',
  },
  attachmentImg: {
    height: '100%',
    objectFit: 'contain',
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
    top: `calc(0px + env(safe-area-inset-top))`,
    right: 0,
    padding: theme.spacing(2),
  },
  alertContainer: {
    position: 'absolute',
    padding: theme.spacing(3),
    top: `calc(0px + env(safe-area-inset-top))`,
    right: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
  },
}))

interface SwipeableAttachmentProps {
  attachment: AttachmentDoc
  index: number
  onPossiblePreviewLoad: (index: number, smallDataUrl: string) => void
}

const SwipeableAttachment = ({
  attachment,
  onPossiblePreviewLoad,
  index,
}: SwipeableAttachmentProps) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const { attachmentRef, attachmentRefLoading } = useAttachment(attachment)
  const classes = useStyles()

  useEffect(() => {
    if (attachmentRef.smallDataUrl) onPossiblePreviewLoad(index, attachmentRef.smallDataUrl)
  }, [attachmentRef.smallDataUrl, index, onPossiblePreviewLoad])

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
          alt="test"
          className={classes.attachmentImg}
          onLoad={() => setImgLoaded(true)}
          src={attachmentRef.fullDataUrl}
        />
      )}
      <Slide direction="up" in={attachmentRef.timeCreated.length > 0}>
        <div className={classes.attachmentMetadata}>
          <Grid container justifyContent="flex-end" spacing={1}>
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
      <AccountChip position="absolute" placement="top" uid={attachment.editorUid} />
    </div>
  )
}

interface AttachmentAlert extends Partial<Pick<AlertProps, 'severity' | 'action'>> {
  text?: ReactText
  open: boolean
}
// ? Redo this...
const AttachmentGalleryProvider: FC = ({ children }) => {
  const [originId, setOriginId] = useState<string | undefined>()
  const [attachments, setAttachments] = useState<AttachmentDoc[] | undefined>()
  const [activeAttachment, setActiveAttachment] = useState(0)
  const [alert, setAlert] = useState<AttachmentAlert>({ open: false })
  const [possiblePreviews, setPossiblePreviews] = useState<Map<number, string>>(new Map())

  const routeMatch = useRouteMatch<{ name: string }>(PATHS.details())

  const animationRef = useRef<Animation | undefined>()

  const classes = useStyles()
  const theme = useTheme()

  const { location } = useRouterContext()

  useEffect(() => {
    if (!attachments || attachments.length === 0) return
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

  const handlePossiblePreviewLoad = useCallback((loadIndex: number, possiblePreview: string) => {
    setPossiblePreviews(prev => new Map(prev.set(loadIndex, possiblePreview)))
  }, [])

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

    // this component is going to day anyway
    const keyframes: Keyframe[] = []

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
      setAlert({ open: false })
    } else {
      initAnimation(newOriginId, attachments, activeAttachment)
    }
  }

  const requestDeleteConfirmation = () => {
    if (!attachments) return
    const attachment = attachments[activeAttachment]

    setAlert({
      open: true,
      text: `${attachment.name} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
      severity: 'warning',
      action: (
        <Grid container wrap="nowrap" spacing={3}>
          <Grid item>
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setAlert(prev => ({ ...prev, open: false }))}>
              <ClearIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="inherit" size="small" onClick={() => handleDelete(attachment)}>
              <CheckIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    })
  }

  const handleDelete = async (attachment: AttachmentDoc) => {
    setAlert({ open: true, text: `löschen wird vorbereitet`, severity: 'info' })
    try {
      await FirebaseService.firestore.doc(attachment.docPath as string).delete()
      await FirebaseService.storageRef.child(attachment.fullPath).delete()

      setAttachments(prev => {
        // ? we are deleting the last image >> reverse the animation
        if (prev?.length === 1) handleAnimation()
        return prev?.filter(prevAttachment => prevAttachment.fullPath !== attachment.fullPath)
      })
      setActiveAttachment(prev => (prev !== 0 ? --prev : prev))
      setAlert({ open: true, text: `${attachment.name} wurde gelöscht`, severity: 'success' })
    } catch (e) {
      console.error(e)
      setAlert({
        open: true,
        text: 'Nur eigene Bilder können gelöscht werden',
        severity: 'info',
      })
    } finally {
      setTimeout(() => setAlert(prev => ({ ...prev, open: false })), 4000)
    }
  }

  const handleDownload = async () => {
    if (!attachments) return
    // ToDo: does not work on iOS 13, just don't render the button for now
    const link = document.createElement('a')
    link.href = await FirebaseService.storageRef
      .child(attachments[activeAttachment].fullPath)
      .getDownloadURL()

    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreviewChange = async () => {
    if (!attachments || !routeMatch?.params.name) return

    setAlert({ open: true, text: 'Vorschaubild wird gesetzt', severity: 'info' })
    await FirebaseService.firestore
      .collection('recipes')
      .doc(routeMatch.params.name)
      .update({
        previewAttachment: possiblePreviews.get(activeAttachment),
      } as Recipe)
    setTimeout(() => setAlert(prev => ({ ...prev, open: false })), 500)
  }

  return (
    <>
      <Context.Provider value={{ handleAnimation }}>{children}</Context.Provider>
      <Slide in={Boolean(originId)} direction="up">
        <div className={classes.background}>
          <Fab
            size="medium"
            onClick={() => setActiveAttachment(prev => --prev)}
            disabled={activeAttachment === 0}>
            <ChevronLeft />
          </Fab>
          <div id="destination" className={classes.destination}>
            {attachments && (
              <SwipeableViews disabled index={activeAttachment}>
                {attachments.map((attachment, index) => (
                  <SwipeableAttachment
                    onPossiblePreviewLoad={handlePossiblePreviewLoad}
                    index={index}
                    key={index}
                    attachment={attachment}
                  />
                ))}
              </SwipeableViews>
            )}
          </div>
          <Fab
            size="medium"
            onClick={() => setActiveAttachment(prev => ++prev)}
            disabled={attachments && activeAttachment === attachments.length - 1}>
            <ChevronRight />
          </Fab>

          <Grid className={classes.btnContainer} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Tooltip placement="bottom" title="Schließen">
                <div>
                  <IconButton disabled={alert.open} onClick={() => handleAnimation()}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip placement="bottom" title="Als Vorschaubild setzen">
                <IconButton disabled={alert.open} onClick={handlePreviewChange}>
                  <FileImage />
                </IconButton>
              </Tooltip>
            </Grid>
            {!isSafari && (
              <Grid item>
                <Tooltip placement="bottom" title="Herunterladen">
                  <div>
                    <IconButton disabled={alert.open} onClick={handleDownload}>
                      <Download />
                    </IconButton>
                  </div>
                </Tooltip>
              </Grid>
            )}
            <Grid item>
              <Tooltip placement="bottom" title="Löschen">
                <div>
                  <IconButton disabled={alert.open} onClick={requestDeleteConfirmation}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Tooltip>
            </Grid>
          </Grid>

          <Slide direction="down" in={alert.open}>
            <div className={classes.alertContainer}>
              <Alert
                severity={alert?.severity}
                action={alert.action}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
                {alert?.text}
              </Alert>
            </div>
          </Slide>
        </div>
      </Slide>
    </>
  )
}

export default AttachmentGalleryProvider
