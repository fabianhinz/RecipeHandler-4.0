import {
    Card,
    CardActionArea,
    CardMedia,
    createStyles,
    Fab,
    Grid,
    GridSize,
    makeStyles,
    Slide,
    Tooltip,
} from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { getResizedImagesWithMetadata } from '../../hooks/useAttachment'
import { AllDataUrls, Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import AccountChip from '../Account/AccountChip'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { useSelectedAttachement } from '../Provider/SelectedAttachementProvider'
import TrialsDeleteAlert from './TrialsDeleteAlert'

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
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
        selectionCard: {
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
        selectionCardActive: {
            zIndex: 2,
            opacity: 1,
        },
        selectionCheckIcon: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            fontSize: theme.typography.pxToRem(60),
        },
    })
)

interface Props {
    trial: Trial
    // ? selectionProps are used to overwrite the default click behaviour and also result in some layout changes
    selectionProps?: {
        onClick: (trial: Trial) => void
        selected?: boolean
        loadSmallAttachment?: boolean
    }
}

const TrialsCard = ({ trial, selectionProps }: Props) => {
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [dataUrls, setDataUrls] = useState<AllDataUrls | undefined>()

    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { gridBreakpointProps } = useGridContext()
    const { enqueueSnackbar } = useSnackbar()
    const { setSelectedAttachment } = useSelectedAttachement()

    useEffect(() => {
        let mounted = true
        getResizedImagesWithMetadata(trial.fullPath).then(
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
            await FirebaseService.firestore
                .collection('trials')
                .doc(trial.name)
                .delete()

            await FirebaseService.storageRef.child(trial.fullPath).delete()
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }

    const selectionAwareBreakpoints: Partial<Record<
        Breakpoint,
        boolean | GridSize
    >> = selectionProps ? { xs: 12 } : gridBreakpointProps

    return (
        <>
            <Grid item {...selectionAwareBreakpoints}>
                <Card className={classes.card}>
                    <AccountChip
                        uid={trial.editorUid}
                        enhanceLabel={`am ${FirebaseService.createDateFromTimestamp(
                            trial.createdDate
                        ).toLocaleDateString()}`}
                        position="absolute"
                        placement="top"
                    />

                    <CardActionArea
                        disabled={!dataUrls}
                        onClick={() => {
                            if (selectionProps) selectionProps.onClick(trial)
                            else if (dataUrls)
                                setSelectedAttachment({ dataUrl: dataUrls.fullDataUrl })
                        }}>
                        <Card
                            className={clsx(
                                classes.selectionCard,
                                selectionProps?.selected && classes.selectionCardActive
                            )}>
                            <CheckIcon className={classes.selectionCheckIcon} />
                        </Card>

                        <CardMedia image={dataUrls?.mediumDataUrl} className={classes.img}>
                            {/* make mui happy */}
                            <></>
                        </CardMedia>
                    </CardActionArea>

                    {user && (
                        <Slide direction="up" in>
                            <Grid
                                container
                                justify="flex-end"
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
                title={trial.name}
                onAbort={() => setDeleteAlert(false)}
                onConfirm={handleDeleteBtnClick}
            />
        </>
    )
}

export default TrialsCard
