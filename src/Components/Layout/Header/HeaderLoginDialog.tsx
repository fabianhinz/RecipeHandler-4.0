import {
    Avatar,
    Box,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, memo, useEffect, useState } from 'react'

import { ReactComponent as FirebaseIcon } from '../../../icons/firebase.svg'
import { FirebaseService } from '../../../services/firebase'
import { BORDER_RADIUS } from '../../../theme'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { SlideUp } from '../../Shared/Transitions'
import { HeaderChangeKey, HeaderDispatch, HeaderState } from './HeaderReducer'

type HeaderLoginDialogProps = HeaderState<'email' | 'dialogOpen' | 'password'> & HeaderDispatch

const useStyles = makeStyles(theme =>
    createStyles({
        firebaseAvatar: {
            backgroundColor: '#2C384A',
            padding: theme.spacing(1),
            width: theme.spacing(8),
            height: theme.spacing(8),
            position: 'absolute',
            top: theme.spacing(-4),
            right: 0,
            left: 0,
            margin: '0 auto',
            boxShadow: theme.shadows[8],
            zIndex: 3,
        },
        progressContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: BORDER_RADIUS,
            zIndex: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        },
        dialogPaper: {
            paddingTop: theme.spacing(3),
            overflowY: 'unset',
        },
    })
)

const HeaderLoginDialog = ({ dispatch, ...props }: HeaderLoginDialogProps) => {
    const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
    })
    const [loading, setLoading] = useState(false)
    const { user } = useFirebaseAuthContext()
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (user || errors.email || errors.password) setLoading(false)
    }, [user, errors])

    useEffect(() => {
        if (user && !user.isAnonymous) setErrors({ email: false, password: false })
    }, [user])

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault()
        FirebaseService.auth
            .signInWithEmailAndPassword(props.email, props.password)
            .catch(error => {
                // eslint-disable-next-line no-empty
                switch (error.code) {
                    case 'auth/invalid-email': {
                        setErrors({ email: true, password: false })
                        break
                    }
                    case 'auth/wrong-password': {
                        setErrors({ password: true, email: false })
                        break
                    }
                }
            })
    }

    const handleLogout = () => {
        setLoading(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleDialogChange = () => dispatch({ type: 'dialogChange' })

    const handleTextFieldChange = (key: HeaderChangeKey) => (
        event: ChangeEvent<HTMLInputElement>
    ) => dispatch({ type: 'textFieldChange', key, value: event.target.value })

    return (
        <Dialog
            TransitionComponent={SlideUp}
            PaperProps={{ className: classes.dialogPaper }}
            fullWidth
            maxWidth="xs"
            open={props.dialogOpen}
            onClose={handleDialogChange}>
            <Avatar className={classes.firebaseAvatar}>
                <FirebaseIcon height="100%" />
            </Avatar>

            {loading && (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" disableShrink size={60} thickness={5.4} />
                </div>
            )}

            {user && !user.isAnonymous ? (
                <DialogContent>
                    <DialogContent>
                        <Typography color="textPrimary">
                            Angemeldet als {user.email}. Rezepte können nun angeleget und bearbeitet
                            werden.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box
                            flexGrow={1}
                            display="flex"
                            justifyContent="space-evenly"
                            alignItems="center">
                            <IconButton onClick={handleDialogChange}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton onClick={handleLogout}>
                                <AccountIcon />
                            </IconButton>
                        </Box>
                    </DialogActions>
                </DialogContent>
            ) : (
                <form onSubmit={handleLogin}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            helperText={errors.email && 'ungültige Email'}
                            error={errors.email}
                            autoComplete="username"
                            onChange={handleTextFieldChange('email')}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Email"
                        />
                        <TextField
                            helperText={errors.password && 'ungültiges Passwort'}
                            error={errors.password}
                            autoComplete="current-password"
                            onChange={handleTextFieldChange('password')}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="password"
                            label="Passwort"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Box
                            flexGrow={1}
                            display="flex"
                            justifyContent="space-evenly"
                            alignItems="center">
                            <IconButton onClick={handleDialogChange}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton type="submit">
                                <AccountIcon />
                            </IconButton>
                        </Box>
                    </DialogActions>
                </form>
            )}
        </Dialog>
    )
}

export default memo(
    HeaderLoginDialog,
    (prev, next) =>
        prev.dialogOpen === next.dialogOpen &&
        prev.email === next.email &&
        prev.password === next.password
)
