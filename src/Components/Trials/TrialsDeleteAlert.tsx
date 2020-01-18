import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import React, { ReactNode } from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { SlideUp } from '../Shared/Transitions'

interface Props {
    title: ReactNode
    open: boolean
    onConfirm: () => void
    onAbort: () => void
}

const TrialsDeleteAlert = ({ open, onConfirm, onAbort, title }: Props) => {
    const { isDialogFullscreen } = useBreakpointsContext()

    return (
        <Dialog
            fullScreen={isDialogFullscreen}
            open={open}
            onClose={onAbort}
            TransitionComponent={SlideUp}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Möglicherweise werden Ideen anderer Benutzer gelöscht. Gelöschte Dateien können
                    im Gegensatz zu den Kommentaren nicht wiederhergestellt werden. Trotzdem
                    fortfahren?
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
}

export default TrialsDeleteAlert
