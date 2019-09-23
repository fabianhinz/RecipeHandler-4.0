import React from "react";
import { Box, Slide, Card, CardContent, CardHeader } from "@material-ui/core";
import { FirebaseService } from "../firebase";
import { ReactComponent as ErrorIcon } from "../icons/error.svg";

interface ErrorBoundaryState {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    state = {
        error: null,
        errorInfo: null
    };

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        if (process.env.NODE_ENV !== "production") return;

        FirebaseService.firestore.collection("errors").add({
            error: error.toString(),
            componentStack: errorInfo.componentStack,
            timestamp: FirebaseService.createTimestampFrom(new Date())
        });

        this.setState({
            error,
            errorInfo
        });
    }

    public render() {
        return (
            <>
                {this.state.errorInfo ? (
                    <Box margin={10}>
                        <Slide in direction="down" timeout={500}>
                            <Card raised>
                                <CardHeader title="Uups - das hat wohl nicht geklappt !!!" />
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
        );
    }
}
