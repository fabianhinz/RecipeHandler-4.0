import { Container, makeStyles, Theme } from '@material-ui/core'
import { useRouteMatch } from 'react-router-dom'

import { PATHS, Routes } from '@/Components/Routes/Routes'
import { BORDER_RADIUS } from '@/theme'

const useStyles = makeStyles<Theme, { extraPadding?: boolean }>(theme => ({
  main: {
    minHeight: '60vh',
    backgroundColor: theme.palette.background.default,
    borderRadius: BORDER_RADIUS,
    [theme.breakpoints.only('xs')]: {
      boxShadow: theme.shadows[0],
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'calc(env(safe-area-inset-left) + 95px)',
    },
    [theme.breakpoints.up('md')]: {
      boxShadow: theme.shadows[4],
    },
  },
  container: {
    userSelect: 'none',
    padding: 0,
    paddingTop: props =>
      props.extraPadding ? theme.spacing(32) : theme.spacing(24),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(8),
      paddingTop: props =>
        props.extraPadding ? theme.spacing(40) : theme.spacing(32),
    },
    '@media (min-width: 1440px)': {
      maxWidth: 1440,
    },
    '@media (min-width: 2560px)': {
      maxWidth: 2560,
    },
  },
}))

const Main = () => {
  const match = useRouteMatch<{ name: string }>([
    PATHS.recipeEdit(),
    PATHS.details(),
  ])
  const classes = useStyles({ extraPadding: match?.isExact })

  return (
    <Container className={classes.container}>
      <main className={classes.main}>
        <Routes />
      </main>
    </Container>
  )
}

export default Main
