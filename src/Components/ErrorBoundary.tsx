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

import { ReactComponent as ErrorIcon } from '../icons/error.svg'
import { FirebaseService } from '../services/firebase'

interface ErrorBoundaryState {
    error: Error | null
    errorInfo: React.ErrorInfo | null
    errorLogged: boolean
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: any) {
        super(props)
        this.state = { error: null, errorInfo: null, errorLogged: false }
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
            errorLogged: false,
        })

        if (process.env.NODE_ENV !== 'production') return

        FirebaseService.firestore
            .collection('errors')
            .add({
                error: error.toString(),
                componentStack: errorInfo.componentStack,
                timestamp: FirebaseService.createTimestampFromDate(new Date()),
            })
            .then(() => this.setState({ errorLogged: true }))
    }

    public render() {
        if (this.state.errorInfo && this.state.error) {
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
                                        {this.state.error.toString()}
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
