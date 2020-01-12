import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import React from 'react'

import { SlideUp } from '../Shared/Transitions'

interface Props {
    open: boolean
    onConfirm: () => void
    onAbort: () => void
}

const TrialsDeleteAlert = ({ open, onConfirm, onAbort }: Props) => (
    <Dialog open={open} onClose={onAbort} TransitionComponent={SlideUp}>
        <DialogContent>
            <DialogContentText>
                Möglicherweise werden Ideen anderer Benutzer gelöscht. Gelöschte Dateien können im
                Gegensatz zu den Kommentaren nicht wiederhergestellt werden. Trotzdem fortfahren?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button startIcon={<CloseIcon />} onClick={onAbort}>
                Nein
            </Button>
            <Button startIcon={<DeleteIcon />} onClick={onConfirm} color="secondary" autoFocus>
                Ja
            </Button>
        </DialogActions>
    </Dialog>
)

export default TrialsDeleteAlert
