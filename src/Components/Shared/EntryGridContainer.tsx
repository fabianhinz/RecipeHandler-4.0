import { Grid, makeStyles } from '@material-ui/core'

interface Props {
  children: React.ReactNode
  header?: React.ReactNode
}

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },
  container: {
    overflowX: 'hidden',
  },
}))

const EntryGridContainer = (props: Props) => {
  const classes = useStyles()

  return (
    <>
      {props.header}
      <div className={classes.root}>
        <Grid container className={classes.container} spacing={4}>
          {props.children}
        </Grid>
      </div>
    </>
  )
}

export default EntryGridContainer
