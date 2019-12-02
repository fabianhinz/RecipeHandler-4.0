import {
    Avatar,
    Box,
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
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
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [newUser, setNewUser] = useState(false)

    const { user, editor } = useFirebaseAuthContext()
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
            case 'app/username-empty': {
                snackbarMessage = 'Benutzername nicht angeben'
                break
            }
            default:
                snackbarMessage = 'unbekannter Fehler aufgetreten'
        }
        enqueueSnackbar(snackbarMessage, { variant: 'warning' })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault()

        if (newUser) {
            if (props.password === passwordRepeat && username.length > 0) {
                FirebaseService.auth
                    .createUserWithEmailAndPassword(props.email, props.password)
                    .then(createdUser => {
                        setNewUser(false)
                        // save the username - this allows admins to enable/disable editors by username
                        FirebaseService.firestore
                            .collection('users')
                            .doc(createdUser.user!.uid)
                            .set({ username })
                    })
                    .catch(error => handleAuthError(error))
                    .finally(() => setLoading(false))
            } else {
                if (props.password !== passwordRepeat)
                    handleAuthError({ code: 'app/passwords-not-equal' })
                if (username.length === 0) handleAuthError({ code: 'app/username-empty' })
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

    const handleDialogChange = () => dispatch({ type: 'dialogChange' })

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

            {user && !user.isAnonymous && editor ? (
                <DialogContent>
                    <DialogContent>
                        <Typography align="justify" color="textPrimary">
                            Willkommen zurück {editor.username}. Sofern entsprechende Berechtigungen
                            gegeben worden sind, können Rezepte angelegt und bearbeitet werden.
                            Zurzeit ist lediglich die Bearbeitung eigener Rezepte freigeschalten.
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
                                    Daten vervollständigen um neuen Benutzer anzulegen
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
                                <>
                                    <TextField
                                        onChange={e => setPasswordRepeat(e.target.value)}
                                        value={passwordRepeat}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        type="password"
                                        label="Passwort wiederholen"
                                    />
                                    <TextField
                                        helperText="Rezepte weisen ihren Ersteller anhand des Benutzernamens aus"
                                        onChange={e => setUsername(e.target.value)}
                                        value={username}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Benutzername"
                                    />
                                </>
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
