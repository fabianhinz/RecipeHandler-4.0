import { Badge } from '@mui/material/';
import makeStyles from '@mui/styles/makeStyles';
import { BadgeProps } from '@mui/material/Badge'
import { FC } from 'react'
import { blueGrey } from '@mui/material/colors';

const useStyles = makeStyles(theme => {
  const background =
    theme.palette.mode === 'light' ? blueGrey[900] : theme.palette.grey[600]

  return {
    badge: {
      background,
      color: theme.palette.getContrastText(background),
    },
  }
})

export const BadgeWrapper: FC<BadgeProps> = ({
  children,
  badgeContent,
  anchorOrigin,
}) => {
  const classes = useStyles()

  return (
    <Badge
      overlap="rectangular"
      anchorOrigin={anchorOrigin}
      classes={classes}
      badgeContent={badgeContent}
      max={100}>
      {children}
    </Badge>
  )
}
