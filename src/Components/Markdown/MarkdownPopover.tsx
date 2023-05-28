import { Popover, PopoverProps } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: 300,
    maxHeight: 300,
    overflowY: 'auto',
  },
}))

const MarkdownPopover = ({
  children,
  ...popoverProps
}: Omit<PopoverProps, 'classes' | 'anchorOrigin' | 'transformOrigin'>) => {
  const classes = useStyles()

  return (
    <Popover
      classes={{ paper: classes.popoverPaper }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...popoverProps}>
      {children}
    </Popover>
  )
}

export default MarkdownPopover
