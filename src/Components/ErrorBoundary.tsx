import { Box, Card, CardContent, Slide } from '@material-ui/core'
import React from 'react'

import { ReactComponent as ErrorIcon } from '../icons/error.svg'
import { FirebaseService } from '../services/firebase'

interface ErrorBoundaryState {
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    state = {
        error: null,
        errorInfo: null,
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        })

        if (process.env.NODE_ENV !== 'production') return

        FirebaseService.firestore.collection('errors').add({
            error: error.toString(),
            componentStack: errorInfo.componentStack,
            timestamp: FirebaseService.createTimestampFromDate(new Date()),
        })
    }

    public render() {
        return (
            <>
                {this.state.errorInfo ? (
                    <Box margin={10}>
                        <Slide in direction="down" timeout={500}>
                            <Card raised>
                                <CardContent>
                                    <Box display="flex" justifyContent="center">
                                        <ErrorIcon height={200} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Slide>
                    </Box>
                ) : (
                    this.props.children
                )}
            </>
        )
    }
}
