import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, memo } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { SlideUp } from '../../Shared/Transitions'
import { HeaderChangeKey, HeaderDispatch, HeaderState } from './HeaderReducer'

type HeaderLoginDialogProps = HeaderState<'email' | 'dialogOpen' | 'password'> & HeaderDispatch

const HeaderLoginDialog = ({ dispatch, ...props }: HeaderLoginDialogProps) => {
    const { user } = useFirebaseAuthContext()

    const { enqueueSnackbar } = useSnackbar()

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        FirebaseService.auth
            .signInWithEmailAndPassword(props.email, props.password)
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleLogout = () => {
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
            fullWidth
            maxWidth="xs"
            open={props.dialogOpen}
            onClose={handleDialogChange}>
            {user && !user.isAnonymous ? (
                <>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            Angemeldet als {user.email}. Rezepte können nun bearbeitet und erstellt
                            werden.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box width="100%" display="flex" justifyContent="space-evenly">
                            <Button onClick={handleDialogChange}>Schließen</Button>
                            <Button variant="contained" color="primary" onClick={handleLogout}>
                                logout
                            </Button>
                        </Box>
                    </DialogActions>
                </>
            ) : (
                <form onSubmit={handleLogin}>
                    <DialogContent>
                        <TextField
                            autoComplete="username"
                            onChange={handleTextFieldChange('email')}
                            variant="filled"
                            margin="dense"
                            fullWidth
                            label="email"
                        />
                        <TextField
                            autoComplete="current-password"
                            onChange={handleTextFieldChange('password')}
                            variant="filled"
                            margin="dense"
                            fullWidth
                            type="password"
                            label="password"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Box flexGrow={1} display="flex" justifyContent="space-evenly">
                            <Button onClick={handleDialogChange}>Schließen</Button>
                            <Button variant="contained" color="primary" type="submit">
                                Login
                            </Button>
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
