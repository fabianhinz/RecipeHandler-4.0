import { Dialog, DialogTitle } from '@material-ui/core'
import React, { memo, useState } from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Progress from '../Shared/Progress'
import { SlideUp } from '../Shared/Transitions'
import AccountContentAuth from './AccountContentAuth'
import AccountContentUser from './AccountContentUser'

interface Props {
    open: boolean
    onClose: () => void
}

export interface AccountContentProps {
    onDialogClose: () => void
    onDialogLoading: (loading: boolean) => void
}

const AccountDialog = ({ open, onClose }: Props) => {
    const [loading, setLoading] = useState(false)

    const { user } = useFirebaseAuthContext()
    const { isDialogFullscreen } = useBreakpointsContext()

    return (
        <Dialog
            TransitionComponent={SlideUp}
            fullScreen={isDialogFullscreen}
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}>
            {loading && <Progress variant="cover" />}
            <DialogTitle>Account</DialogTitle>
            {user ? (
                <AccountContentUser
                    user={user}
                    onDialogClose={onClose}
                    onDialogLoading={setLoading}
                />
            ) : (
                <AccountContentAuth onDialogClose={onClose} onDialogLoading={setLoading} />
            )}
        </Dialog>
    )
}

export default memo(AccountDialog, (prev, next) => prev.open === next.open)
