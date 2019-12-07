import {
    Box,
    Button,
    createStyles,
    DialogActions,
    DialogContent,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { UserDialogContentProps } from './UserDialog'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            overflowY: 'auto',
            maxHeight: '100%',
        },
    })
)

interface Props extends UserDialogContentProps {}

const DialogContentAuth = ({ onDialogClose, onDialogLoading }: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [username, setUsername] = useState('')
    const [newUser, setNewUser] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const classes = useStyles()

    const handleAuthError = (error: { code: string }) => {
        let snackbarMessage: string | null = null
        switch (error.code) {
            // ? firebase codes
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
            // ? app errors
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
        onDialogLoading(true)
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
                    .finally(() => onDialogLoading(false))
            } else {
                if (password !== passwordRepeat)
                    handleAuthError({ code: 'app/passwords-not-equal' })
                if (username.length === 0) handleAuthError({ code: 'app/username-empty' })
                onDialogLoading(false)
            }
        } else {
            FirebaseService.auth
                .signInWithEmailAndPassword(email, password)
                .catch(error => handleAuthError(error))
                .finally(() => onDialogLoading(false))
        }
    }

    return (
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
                <Box flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <Button startIcon={<CloseIcon />} onClick={onDialogClose}>
                        Schließen
                    </Button>

                    <Button color="secondary" startIcon={<AccountIcon />} type="submit">
                        {newUser ? 'registrieren' : 'einloggen'}
                    </Button>
                </Box>
            </DialogActions>
        </form>
    )
}

export default DialogContentAuth
