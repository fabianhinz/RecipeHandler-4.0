import { Box, Button, DialogActions, DialogContent, Typography } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import { useSnackbar } from 'notistack'
import React from 'react'

import { Editor } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import DialogContentAdmin from './DialogContentAdmin'
import { UserDialogContentProps } from './UserDialog'

interface Props extends UserDialogContentProps {
    editor: Editor
}

const DialogContentEditor = ({ editor, onDialogLoading, onDialogClose }: Props) => {
    const { enqueueSnackbar } = useSnackbar()

    const handleLogout = () => {
        onDialogLoading(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }
    return (
        <>
            {editor.admin ? (
                <DialogContentAdmin onDialogLoading={onDialogLoading} />
            ) : (
                <DialogContent>
                    <Typography align="justify" color="textPrimary">
                        Willkommen zurück {editor.username}. Sofern berechtigt können Rezepte
                        angelegt und bearbeitet werden. Zurzeit ist lediglich die Bearbeitung
                        eigener Rezepte freigeschalten.
                    </Typography>
                </DialogContent>
            )}

            <DialogActions>
                <Box flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <Button startIcon={<CloseIcon />} onClick={onDialogClose}>
                        Schließen
                    </Button>

                    <Button color="secondary" startIcon={<AccountIcon />} onClick={handleLogout}>
                        ausloggen
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}

export default DialogContentEditor
