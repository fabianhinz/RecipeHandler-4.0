import { Fab, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import FabContainer from '@/Components/Shared/FabContainer'

interface Props {
  icon: JSX.Element
  tooltipTitle: React.ReactText
  onClick?: () => void
  pathname?: string
}

export const SecouredRouteFab = ({
  icon,
  tooltipTitle,
  onClick,
  pathname,
}: Props) => {
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
