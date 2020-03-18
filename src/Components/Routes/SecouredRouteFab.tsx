import { Fab, Tooltip } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import FabContainer from '../Shared/FabContainer'

interface Props {
    icon: JSX.Element
    tooltipTitle: React.ReactNode
    onClick?: () => void
    pathname?: string
}

export const SecouredRouteFab = ({ icon, tooltipTitle, onClick, pathname }: Props) => {
    const history = useHistory()
    const { user } = useFirebaseAuthContext()

    const handleClick = () => {
        if (onClick) onClick()
        if (pathname) history.push(pathname)
    }

    return (
        <>
            {user && (
                <FabContainer>
                    <Tooltip title={tooltipTitle} placement="right">
                        <Fab onClick={handleClick} color="secondary">
                            {icon}
                        </Fab>
                    </Tooltip>
                </FabContainer>
            )}
        </>
    )
}
