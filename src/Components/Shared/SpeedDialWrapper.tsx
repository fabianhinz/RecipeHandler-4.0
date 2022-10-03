import { makeStyles } from '@material-ui/core'
import SpeedDialIcon from '@material-ui/icons/ClassRounded'
import { SpeedDial } from '@material-ui/lab'
import { useState } from 'react'

const useStyles = makeStyles(theme => ({
  speedDial: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    width: 95,
    display: 'flex',
    padding: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: `env(safe-area-inset-bottom)`,
    right: 0,
  },
}))

interface Props {
  children: React.ReactNode
}

const SpeedDialWrapper = ({ children }: Props) => {
  const [speedDialOpen, setSpeedDialOpen] = useState(false)
  const classes = useStyles()

  return (
    <SpeedDial
      className={classes.speedDial}
      FabProps={{ color: 'secondary' }}
      ariaLabel="recipe create speed dial"
      open={speedDialOpen}
      onOpen={() => setSpeedDialOpen(true)}
      onClose={() => setSpeedDialOpen(false)}
      icon={<SpeedDialIcon />}
      openIcon={<SpeedDialIcon />}>
      {children}
    </SpeedDial>
  )
}

export default SpeedDialWrapper
