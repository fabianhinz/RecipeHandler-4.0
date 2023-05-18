import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import { ReactNode } from 'react'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { SlideUp } from '@/Components/Shared/Transitions'

interface Props {
  title: ReactNode
  open: boolean
  disabled: boolean
  onConfirm: () => void
  onAbort: () => void
}

const TrialsDeleteAlert = ({
  open,
  onConfirm,
  onAbort,
  title,
  disabled,
}: Props) => {
  const { isDialogFullscreen } = useBreakpointsContext()

  return (
    <Dialog
      fullScreen={isDialogFullscreen}
      open={open}
      onClose={onAbort}
      TransitionComponent={SlideUp}>
      <DialogTitle>Rezeptidee löschen?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Möglicherweise werden Ideen anderer Benutzer gelöscht. Gelöschte
          Dateien können im Gegensatz zu den Kommentaren nicht wiederhergestellt
          werden. Trotzdem fortfahren?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} startIcon={<CloseIcon />} onClick={onAbort}>
          Nein
        </Button>
        <Button
          disabled={disabled}
          startIcon={<DeleteIcon />}
          onClick={onConfirm}
          color="secondary">
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TrialsDeleteAlert
