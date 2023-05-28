import { Avatar, ButtonBase, ButtonBaseProps, Theme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { User } from '@/model/model'

type StyleProps = { isUserSelected: boolean }

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  accountAvatarRoot: {
    borderRadius: '50%',
  },
  avatar: props => ({
    transition: theme.transitions.create('opacity'),
    opacity: props.isUserSelected ? 1 : 0.3,
  }),
}))

type Props = { isUserSelected: boolean; user: User } & Pick<
  ButtonBaseProps,
  'onClick'
>

const AccountAvatar = (props: Props) => {
  const classes = useStyles({
    isUserSelected: props.isUserSelected,
  })

  return (
    <ButtonBase onClick={props.onClick} className={classes.accountAvatarRoot}>
      <Avatar className={classes.avatar} src={props.user.profilePicture}>
        {props.user.username.slice(0, 1)}
      </Avatar>
    </ButtonBase>
  )
}

export default AccountAvatar
