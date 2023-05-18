import { Badge, makeStyles } from '@material-ui/core/'
import { BadgeProps } from '@material-ui/core/Badge'
import blueGrey from '@material-ui/core/colors/blueGrey'
import { FC } from 'react'

const useStyles = makeStyles(theme => {
  const background =
    theme.palette.type === 'light' ? blueGrey[900] : theme.palette.grey[600]

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
