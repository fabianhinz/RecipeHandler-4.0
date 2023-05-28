import { Avatar, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Rating } from '@mui/material';
import { RatingProps } from '@mui/lab';

import { useUsersContext } from '@/Components/Provider/UsersProvider'

import SatisfactionIconContainer from './SatisfactionIconContainer'

const useStyles = makeStyles(() => ({
  avatar: {
    width: 50,
    height: 50,
    margin: '8px 0px',
  },
}))

interface Props extends Pick<RatingProps, 'value' | 'onChange' | 'disabled'> {
  uid: string
}

const SatisfactionUser = ({ uid, ...ratingProps }: Props) => {
  const classes = useStyles()

  const { getByUid } = useUsersContext()
  const user = getByUid(uid)

  if (!user) return <></>

  return (
    <Grid container wrap="nowrap" spacing={2} alignItems="center">
      <Grid item>
        <Avatar
          variant="rounded"
          className={classes.avatar}
          src={user.profilePicture}>
          {user.username.slice(0, 1)}
        </Avatar>
      </Grid>
      <Grid item zeroMinWidth>
        <Typography gutterBottom noWrap>
          {user.username}
        </Typography>
        <Rating
          {...ratingProps}
          name="recipe-user-satisfaction"
          size="large"
          IconContainerComponent={SatisfactionIconContainer}
        />
      </Grid>
    </Grid>
  )
}

export default SatisfactionUser
