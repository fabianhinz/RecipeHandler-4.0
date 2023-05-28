import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Breakpoint,
  Card,
  CardActionArea,
  CardMedia,
  Fab,
  Grid,
  GridSize,
  Slide,
  Theme,
  Tooltip,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { deleteDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState } from 'react'

import AccountChip from '@/Components/Account/AccountChip'
import { Comments } from '@/Components/Comments/Comments'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { useSelectedAttachementContext } from '@/Components/Provider/SelectedAttachementProvider'
import { storage } from '@/firebase/firebaseConfig'
import { resolveDoc } from '@/firebase/firebaseQueries'
import { getResizedImagesWithMetadata } from '@/hooks/useAttachment'
import { AllDataUrls, Trial } from '@/model/model'
import { BORDER_RADIUS } from '@/theme'

import TrialsDeleteAlert from './TrialsDeleteAlert'

const useStyles = makeStyles<Theme>(theme => ({
  cardMedia: {
    [theme.breakpoints.down('md')]: {
      height: 283,
    },
    [theme.breakpoints.between('md', 'xl')]: {
      height: 333,
    },
    [theme.breakpoints.up('xl')]: {
      height: 383,
    },
  },
  card: {
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    width: 'fit-content',
  },
  selectionRoot: {
    borderRadius: BORDER_RADIUS,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary.main,
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.standard,
    }),
  },
  selectionActive: {
    zIndex: 2,
    opacity: 1,
  },
  selectionCheckIcon: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    fontSize: theme.typography.pxToRem(60),
  },
}))

interface Props {
  trial: Trial
  onDelete?: (trialName: string) => void
  // ? selectionProps are used to overwrite the default click behaviour and also result in some layout changes
  selectionProps?: {
    onClick: (trial: Trial) => void
    selected?: boolean
  }
}

const TrialsCard = ({ trial, selectionProps, onDelete }: Props) => {
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [dataUrls, setDataUrls] = useState<AllDataUrls | undefined>()
  const [deleteDisabled, setDeleteDisabled] = useState(false)

  const { user } = useFirebaseAuthContext()
  const { gridBreakpointProps, gridLayout } = useGridContext()
  const { enqueueSnackbar } = useSnackbar()
  const { setSelectedAttachment } = useSelectedAttachementContext()

  const classes = useStyles({ fixedCardHeight: gridLayout === 'list' })

  useEffect(() => {
    let mounted = true
    void getResizedImagesWithMetadata(trial.fullPath).then(
      ({ fullDataUrl, mediumDataUrl, smallDataUrl }) => {
        if (!mounted) return
        setDataUrls({ fullDataUrl, mediumDataUrl, smallDataUrl })
      }
    )
    return () => {
      mounted = false
    }
  }, [trial.fullPath])

  const handleDeleteBtnClick = async () => {
    // ! this does not delete the comments collection --> should use https://firebase.google.com/docs/firestore/solutions/delete-collections
    // ! --> which is fine, we can recover comments even if the trial is lost
    try {
      setDeleteDisabled(true)

      await Promise.all([
        deleteDoc(resolveDoc('trials', trial.name)),
        deleteObject(ref(storage, trial.fullPath)),
      ])

      setDeleteAlert(false)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    } finally {
      setDeleteDisabled(false)
      if (onDelete) onDelete(trial.name)
    }
  }

  const selectionAwareBreakpoints: Partial<
    Record<Breakpoint, boolean | GridSize>
  > = useMemo(
    () => (selectionProps ? { xs: 12 } : gridBreakpointProps),
    [gridBreakpointProps, selectionProps]
  )

  const handleAttachmentClick = useCallback(() => {
    if (selectionProps) {
      selectionProps.onClick(trial)
    } else if (dataUrls) {
      setSelectedAttachment(dataUrls)
    }
  }, [dataUrls, selectionProps, setSelectedAttachment, trial])

  return (
    <>
      <Grid item {...selectionAwareBreakpoints}>
        <Card className={classes.card}>
          <AccountChip
            uid={trial.editorUid}
            enhanceLabel={`am ${trial.createdDate
              .toDate()
              .toLocaleDateString()}`}
            position="absolute"
            placement="top"
          />

          <CardActionArea disabled={!dataUrls} onClick={handleAttachmentClick}>
            <div
              className={clsx(
                classes.selectionRoot,
                selectionProps?.selected && classes.selectionActive
              )}>
              <CheckIcon className={classes.selectionCheckIcon} />
            </div>

            <CardMedia
              image={dataUrls?.mediumDataUrl}
              className={classes.cardMedia}>
              {/* make mui happy */}
              <></>
            </CardMedia>
          </CardActionArea>

          {user && (
            <Slide direction="up" in>
              <Grid
                container
                justifyContent="flex-end"
                spacing={1}
                className={classes.actions}>
                <Grid item xs="auto">
                  <Comments
                    highContrast
                    collection="trials"
                    numberOfComments={trial.numberOfComments}
                    name={trial.name}
                  />
                </Grid>

                {!selectionProps && (
                  <Grid item xs="auto">
                    <Tooltip title="Löschen">
                      <Fab size="small" onClick={() => setDeleteAlert(true)}>
                        <DeleteIcon />
                      </Fab>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </Slide>
          )}
        </Card>
      </Grid>
      <TrialsDeleteAlert
        open={deleteAlert}
        disabled={deleteDisabled}
        title={trial.name}
        onAbort={() => setDeleteAlert(false)}
        onConfirm={handleDeleteBtnClick}
      />
    </>
  )
}

export default TrialsCard
