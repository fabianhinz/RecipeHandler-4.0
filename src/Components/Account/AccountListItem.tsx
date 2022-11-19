import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Switch,
  TypographyProps,
} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/EmailRounded'

import { useUsersContext } from '@/Components/Provider/UsersProvider'
import { User } from '@/model/model'

interface Props {
  uid: string
  checked: boolean
  onChange: (uid: string) => void
  variant: 'user' | 'admin'
}

const useStyles = makeStyles(theme => ({
  itemAvatar: {
    minWidth: 66,
  },
  avatar: {
    width: 50,
    height: 50,
    margin: '8px 0px',
  },
  itemTextPrimary: {
    display: 'flex',
    alignItems: 'center',
  },
  itemTextPrimaryIcon: {
    marginLeft: theme.spacing(1),
  },
}))

const AccountListItem = ({ uid, onChange, checked, variant }: Props) => {
  const { getByUid } = useUsersContext()
  const { username, profilePicture, emailVerified } = getByUid(uid) as User

  const classes = useStyles()

  return (
    <ListItem>
      <ListItemAvatar className={classes.itemAvatar}>
        <Avatar variant="rounded" className={classes.avatar} src={profilePicture}>
          {username.slice(0, 1)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div className={classes.itemTextPrimary}>
            {username}
            {variant === 'admin' && (
              <EmailIcon
                className={classes.itemTextPrimaryIcon}
                color={emailVerified ? 'primary' : 'error'}
              />
            )}
          </div>
        }
        primaryTypographyProps={{ component: 'div' } as TypographyProps}
      />
      <ListItemSecondaryAction>
        <Switch checked={checked} onChange={() => onChange(uid)} edge="start" />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default AccountListItem
