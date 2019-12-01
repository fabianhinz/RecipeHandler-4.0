import {
    Avatar,
    Box,
    Button,
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
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import Progress from '../../Shared/Progress'
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
        dialogPaper: {
            paddingTop: theme.spacing(3),
            overflowY: 'unset',
        },
        form: {
            overflowY: 'auto',
            maxHeight: '100%',
        },
    })
)

const HeaderLoginDialog = ({ dispatch, ...props }: HeaderLoginDialogProps) => {
    const [passwordRepeatValue, setPasswordRepeatValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [newUser, setNewUser] = useState(false)

    const { user } = useFirebaseAuthContext()
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setLoading(false)
    }, [user])

    const handleAuthError = (error: { code: string }) => {
        let snackbarMessage: string | null = null
        switch (error.code) {
            case 'auth/invalid-email': {
                snackbarMessage = 'ungültige Email Adresse'
                break
            }
            case 'auth/wrong-password': {
                snackbarMessage = 'falsches Passwort'
                break
            }
            case 'auth/weak-password': {
                snackbarMessage = 'Passwort zu schwach'
                break
            }
            case 'auth/user-not-found': {
                snackbarMessage = 'Benutzer nicht gefunden'
                setNewUser(true)
                break
            }
            case 'app/passwords-not-equal': {
                snackbarMessage = 'Passwörter stimmen nicht überein'
                break
            }
            default:
                snackbarMessage = 'unbekannter Fehler aufgetreten'
        }
        enqueueSnackbar(snackbarMessage, { variant: 'error' })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault()

        if (newUser) {
            if (props.password === passwordRepeatValue)
                FirebaseService.auth
                    .createUserWithEmailAndPassword(props.email, props.password)
                    .then(() => setNewUser(false))
                    .catch(error => handleAuthError(error))
                    .finally(() => setLoading(false))
            else {
                handleAuthError({ code: 'app/passwords-not-equal' })
                setLoading(false)
            }
        } else {
            FirebaseService.auth
                .signInWithEmailAndPassword(props.email, props.password)
                .catch(error => handleAuthError(error))
                .finally(() => setLoading(false))
        }
    }

    const handleLogout = () => {
        setLoading(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleDialogChange = () => {
        setNewUser(false)
        dispatch({ type: 'dialogChange' })
    }

    const handleTextFieldChange = (key: HeaderChangeKey) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        dispatch({ type: 'textFieldChange', key, value: event.target.value })
    }

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

            {loading && <Progress variant="cover" />}

            {user && !user.isAnonymous ? (
                <DialogContent>
                    <DialogContent>
                        <Typography color="textPrimary">
                            Angemeldet als {user.email}. Rezepte können nun angelegt und bearbeitet
                            werden.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box
                            flexGrow={1}
                            display="flex"
                            justifyContent="space-evenly"
                            alignItems="center">
                            <Button startIcon={<CloseIcon />} onClick={handleDialogChange}>
                                Schließen
                            </Button>

                            <Button
                                color="secondary"
                                startIcon={<AccountIcon />}
                                onClick={handleLogout}>
                                ausloggen
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            ) : (
                <>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <DialogContent>
                            {newUser && (
                                <Typography align="center" color="textSecondary">
                                    Daten vervollständigen um Benutzer anzulegen
                                </Typography>
                            )}

                            <TextField
                                autoFocus
                                autoComplete="username"
                                value={props.email}
                                onChange={handleTextFieldChange('email')}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Email"
                            />
                            <TextField
                                autoComplete="current-password"
                                value={props.password}
                                onChange={handleTextFieldChange('password')}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                type="password"
                                label="Passwort"
                            />
                            {newUser && (
                                <TextField
                                    onChange={e => setPasswordRepeatValue(e.target.value)}
                                    value={passwordRepeatValue}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label="Passwort wiederholen"
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Box
                                flexGrow={1}
                                display="flex"
                                justifyContent="space-evenly"
                                alignItems="center">
                                <Button startIcon={<CloseIcon />} onClick={handleDialogChange}>
                                    Schließen
                                </Button>

                                <Button color="secondary" startIcon={<AccountIcon />} type="submit">
                                    {newUser ? 'registrieren' : 'einloggen'}
                                </Button>
                            </Box>
                        </DialogActions>
                    </form>
                </>
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
