import { Avatar, createStyles, Dialog, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { memo, useEffect, useState } from 'react'

import { ReactComponent as FirebaseIcon } from '../../icons/firebase.svg'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Progress from '../Shared/Progress'
import { SlideUp } from '../Shared/Transitions'
import DialogContentAuth from './DialogContentAuth'
import DialogContentEditor from './DialogContentEditor'

const useStyles = makeStyles(theme =>
    createStyles({
        firebaseAvatar: {
            backgroundColor: '#2C384A',
            padding: theme.spacing(1),
            width: theme.spacing(8),
            height: theme.spacing(8),
            right: 0,
            left: 0,
            margin: '0 auto',
            boxShadow: theme.shadows[8],
            zIndex: 3,
        },
        absoluteAvatar: {
            position: 'absolute',
            top: theme.spacing(-4),
        },
        dialogPaper: {
            paddingTop: (props: { isDialogFullscreen: boolean }) =>
                props.isDialogFullscreen ? theme.spacing(2) : theme.spacing(4),
            overflowY: 'unset',
        },
    })
)

interface Props {
    open: boolean
    onClose: () => void
}

export interface UserDialogContentProps {
    onDialogClose: () => void
    onDialogLoading: (loading: boolean) => void
}

const UserDialog = ({ open, onClose }: Props) => {
    const [loading, setLoading] = useState(false)

    const { user } = useFirebaseAuthContext()
    const { isDialogFullscreen } = useBreakpointsContext()

    const classes = useStyles({ isDialogFullscreen })

    useEffect(() => {
        setLoading(false)
    }, [user])

    return (
        <Dialog
            TransitionComponent={SlideUp}
            PaperProps={{
                className: classes.dialogPaper,
            }}
            fullScreen={isDialogFullscreen}
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}>
            <Avatar
                className={clsx(
                    classes.firebaseAvatar,
                    !isDialogFullscreen && classes.absoluteAvatar
                )}>
                <FirebaseIcon height="100%" />
            </Avatar>

            {loading && <Progress variant="cover" />}

            {user ? (
                <DialogContentEditor
                    user={user}
                    onDialogClose={onClose}
                    onDialogLoading={setLoading}
                />
            ) : (
                <DialogContentAuth onDialogClose={onClose} onDialogLoading={setLoading} />
            )}
        </Dialog>
    )
}

export default memo(UserDialog, (prev, next) => prev.open === next.open)
