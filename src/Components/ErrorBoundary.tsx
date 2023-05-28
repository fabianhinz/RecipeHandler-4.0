/* eslint-disable react/no-multi-comp */
import { Box, Button, CardActions, Container, LinearProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Alert, AlertTitle } from '@mui/material';
import { Timestamp } from 'firebase/firestore'
import { Component } from 'react'
import { useHistory } from 'react-router-dom'
import StackTrace from 'stacktrace-js'

import { addDocTo } from '@/firebase/firebaseQueries'

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
  },
  message: {
    flex: 1,
    minWidth: 0,
  },
}))

const ErrorComponent = (props: BoundaryProps & BoundaryState) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Container maxWidth={props.root ? 'sm' : false}>
      <Box marginTop={4}>
        <Alert severity="error" classes={classes}>
          <AlertTitle>Fehler</AlertTitle>

          {props.errorLogged ? (
            <Typography noWrap gutterBottom color="textSecondary">
              {props.error}
            </Typography>
          ) : (
            <LinearProgress />
          )}

          <CardActions style={{ justifyContent: 'flex-end' }}>
            {props.root !== true && (
              <Button
                disabled={!props.errorLogged}
                color="inherit"
                onClick={() => history.goBack()}>
                zurück
              </Button>
            )}
            <Button
              disabled={!props.errorLogged}
              color="inherit"
              onClick={() => window.location.reload()}>
              neu laden
            </Button>
          </CardActions>
        </Alert>
      </Box>
    </Container>
  )
}

interface BoundaryProps {
  root?: boolean
}

interface BoundaryState {
  error: string | null
  errorLogged: boolean
}

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props)
    this.state = { error: null, errorLogged: false }
  }

  public async componentDidCatch(minError: Error, _errorInfo: React.ErrorInfo) {
    // ? this might help iOS 13 (https://github.com/firebase/firebase-js-sdk/issues/2581)
    if (minError.message.includes('INTERNAL ASSERTION FAILED')) {
      window.location.reload()
    }

    const trace = await StackTrace.fromError(minError)

    this.setState({
      error: `${minError.toString()} ${trace.toString()}`,
      errorLogged: false,
    })

    if (!import.meta.env.PROD) {
      return this.setState({ errorLogged: true })
    }

    await addDocTo('errors', {
      version: RECIPE_HANDLER_APP_VERSION,
      minError: minError.toString(),
      trace: trace.toString(),
      agent: window.navigator.userAgent,
      timestamp: Timestamp.fromDate(new Date()),
    })
    this.setState({ errorLogged: true })
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent {...this.state} {...this.props} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
