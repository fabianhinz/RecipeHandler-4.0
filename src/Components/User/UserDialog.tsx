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
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import React, { memo, useEffect, useState } from 'react'

import { ReactComponent as FirebaseIcon } from '../../icons/firebase.svg'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Progress from '../Shared/Progress'
import { SlideUp } from '../Shared/Transitions'

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
            paddingTop: theme.spacing(3),
            overflowY: 'unset',
        },
        form: {
            overflowY: 'auto',
            maxHeight: '100%',
        },
    })
)

interface Props {
    open: boolean
    onClose: () => void
}

const UserDialog = ({ open, onClose }: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [newUser, setNewUser] = useState(false)

    const classes = useStyles()

    const { enqueueSnackbar } = useSnackbar()
    const { user, editor } = useFirebaseAuthContext()
    const { isDialogFullscreen } = useBreakpointsContext()

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
            if (password === passwordRepeat && username.length > 0) {
                FirebaseService.auth
                    .createUserWithEmailAndPassword(email, password)
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
                if (password !== passwordRepeat)
                    handleAuthError({ code: 'app/passwords-not-equal' })
                if (username.length === 0) handleAuthError({ code: 'app/username-empty' })
                setLoading(false)
            }
        } else {
            FirebaseService.auth
                .signInWithEmailAndPassword(email, password)
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

    return (
        <Dialog
            TransitionComponent={SlideUp}
            PaperProps={{ className: classes.dialogPaper }}
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

            {user && !user.isAnonymous && editor ? (
                <>
                    <DialogContent>
                        <Typography align="justify" color="textPrimary">
                            Willkommen zurück {editor.username}. Sofern berechtigt können Rezepte
                            angelegt und bearbeitet werden. Zurzeit ist lediglich die Bearbeitung
                            eigener Rezepte freigeschalten.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box
                            flexGrow={1}
                            display="flex"
                            justifyContent="space-evenly"
                            alignItems="center">
                            <Button startIcon={<CloseIcon />} onClick={onClose}>
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
                </>
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
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Email"
                            />
                            <TextField
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
                                <Button startIcon={<CloseIcon />} onClick={onClose}>
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

export default memo(UserDialog, (prev, next) => prev.open === next.open)
