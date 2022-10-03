import { Avatar, Chip, makeStyles } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import clsx from 'clsx'

import { useUsersContext } from '@/Components/Provider/UsersProvider'
import { User } from '@/model/model'

const useStyles = makeStyles(theme => ({
  absolute: {
    boxShadow: theme.shadows[4],
    position: 'absolute',
    left: ' 50%',
    transform: 'translate(-50%, 0)',
    zIndex: 1,
  },
  top: {
    top: theme.spacing(1),
  },
  bottom: {
    bottom: theme.spacing(1),
  },
}))

interface Props extends Pick<ChipProps, 'variant'> {
  uid: string
  position?: 'default' | 'absolute'
  placement?: 'top' | 'bottom'
  onFilterChange?: (uid: string) => void
  selected?: boolean
  enhanceLabel?: string
}

const AccountChip = ({ uid, variant, position, enhanceLabel, placement }: Props) => {
  const { getByUid } = useUsersContext()
  const user: User | undefined = getByUid(uid)

  const classes = useStyles()

  if (position === 'absolute' && !placement)
    console.error('When positioning absolute, placement is required')

  return (
    <>
      {user && (
        <Chip
          variant={variant}
          className={clsx(
            position === 'absolute' && classes.absolute,
            placement && classes[placement]
          )}
          avatar={<Avatar src={user.profilePicture}>{user.username.slice(0, 1)}</Avatar>}
          label={`${user.username} ${enhanceLabel || ''}`}
        />
      )}
    </>
  )
}

export default AccountChip
