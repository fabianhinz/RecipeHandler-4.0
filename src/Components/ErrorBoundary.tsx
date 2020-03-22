import {
    Box,
    Card,
    CardContent,
    Container,
    LinearProgress,
    Slide,
    Typography,
} from '@material-ui/core'
import React from 'react'
import StackTrace from 'stacktrace-js'

import { ReactComponent as ErrorIcon } from '../icons/error.svg'
import { FirebaseService } from '../services/firebase'

interface ErrorBoundaryState {
    error: string | null
    errorLogged: boolean
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: any) {
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

        if (process.env.NODE_ENV !== 'production') return this.setState({ errorLogged: true })

        FirebaseService.firestore
            .collection('errors')
            .add({
                version: __VERSION__,
                minError: minError.toString(),
                trace: trace.toString(),
                agent: window.navigator.userAgent,
                timestamp: FirebaseService.createTimestampFromDate(new Date()),
            })
            .then(() => this.setState({ errorLogged: true }))
    }

    public render() {
        if (this.state.error) {
            return (
                <Container maxWidth="sm">
                    <Box marginTop={4}>
                        <Slide in direction="down" timeout={500}>
                            <Card raised>
                                <CardContent>
                                    <Box margin={1} display="flex" justifyContent="center">
                                        <ErrorIcon height={100} />
                                    </Box>

                                    <Typography gutterBottom color="textSecondary">
                                        {this.state.error}
                                    </Typography>
                                    {this.state.errorLogged ? (
                                        <Typography color="primary">
                                            Protokollierung des Fehlers abgeschlossen
                                        </Typography>
                                    ) : (
                                        <LinearProgress title="Fehler wird protokolliert" />
                                    )}
                                </CardContent>
                            </Card>
                        </Slide>
                    </Box>
                </Container>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
