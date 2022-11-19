import { Chip, Link, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { memo } from 'react'

import { ReactComponent as FirebaseIcon } from '@/icons/firebase.svg'

const useStyles = makeStyles(theme => ({
  chip: {
    boxShadow: theme.shadows[4],
    backgroundColor: '#2C384A',
    height: theme.spacing(10),
    borderRadius: theme.spacing(5),
  },
  chipLabel: {
    paddingRight: 36,
    paddingLeft: 0,
    '& > *': {
      color: theme.palette.getContrastText('#2C384A'),
    },
  },
  link: {
    color: '#FFCA28',
  },
  '@keyframes icon-loading': {
    '0%': {
      transform: 'scale(1.1)',
    },
    '50%': {
      transform: 'scale(1.3)',
    },
    '100%': {
      transform: 'scale(1.1)',
    },
  },
  icon: {
    transform: 'scale(1.1)',
  },
  iconLoading: {
    animation: `$icon-loading 2s infinite linear`,
  },
}))

interface Props {
  loading?: boolean
}

const BuiltWithFirebase = ({ loading }: Props) => {
  const classes = useStyles()

  return (
    <Chip
      classes={{ root: classes.chip, label: classes.chipLabel }}
      icon={
        <FirebaseIcon
          className={clsx(classes.icon, loading && classes.iconLoading)}
          height="100%"
        />
      }
      label={
        <>
          <Typography variant="h6" gutterBottom>
            Recipe Handler 4.0
          </Typography>
          <Typography>
            Built with{' '}
            <Link className={classes.link} target="_blank" href="https://firebase.google.com/">
              Firebase
            </Link>
          </Typography>
        </>
      }
    />
  )
}

export default memo(BuiltWithFirebase)
