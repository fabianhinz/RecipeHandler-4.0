import CloseIcon from '@mui/icons-material/Close'
import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Drawer,
  IconButton,
  Theme,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { ReactText, useEffect, useRef, useState } from 'react'

const useStyles = makeStyles<Theme>(theme => ({
  paper: {
    [theme.breakpoints.between('xs', 'lg')]: {
      width: 320,
    },
    [theme.breakpoints.up('lg')]: {
      width: 480,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    userSelect: 'none',
  },
  header: {
    padding: theme.spacing(1),
    paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingTop: 0,
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  action: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: theme.spacing(1),
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
  },
}))

type RenderProp = (closeDrawer: () => void) => React.ReactNode

interface Props {
  buttonProps: Omit<ButtonProps, 'children' | 'startIcon'> & {
    label: React.ReactText
    icon: React.ReactNode
  }
  legend?: ReactText
  highlight?: boolean
  children: React.ReactNode | RenderProp
  header?: React.ReactNode
  action?: React.ReactNode
  onOpen?: () => void
  onClose?: () => void
}

const SelectionDrawer = ({
  buttonProps,
  children,
  header,
  onOpen,
  onClose,
  action,
  legend,
  highlight,
}: Props) => {
  const [open, setOpen] = useState(false)
  const prevOpen = useRef(open)

  const classes = useStyles()

  useEffect(() => {
    if (prevOpen.current === open) return

    if (open && onOpen) onOpen()
    else if (!open && onClose) onClose()

    prevOpen.current = open
  }, [open, onOpen, onClose])

  const closeDrawer = () => setOpen(false)
  const openDrawer = () => setOpen(true)

  const { label, icon, ...muiButtonProps } = buttonProps

  return (
    <>
      <Button
        onClick={openDrawer}
        variant="contained"
        size="large"
        {...muiButtonProps}>
        <div>
          <Box display="flex" alignItems="center">
            <Box mr={1} lineHeight={1}>
              <Badge
                overlap="rectangular"
                color="secondary"
                variant="dot"
                invisible={!highlight}>
                {icon}
              </Badge>
            </Box>
            {label}
          </Box>

          {legend && <Typography variant="caption">{legend}</Typography>}
        </div>
      </Button>

      <Drawer
        PaperProps={{ className: classes.paper }}
        open={open}
        onClose={closeDrawer}
        anchor="right"
        keepMounted>
        <div className={classes.header}>{header}</div>
        <div className={classes.container}>
          {typeof children === 'function' ? children(closeDrawer) : children}
        </div>
        <div className={classes.action}>
          <IconButton onClick={closeDrawer} size="large">
            <CloseIcon />
          </IconButton>
          {action && <div onClick={closeDrawer}>{action}</div>}
        </div>
      </Drawer>
    </>
  )
}

export default SelectionDrawer
