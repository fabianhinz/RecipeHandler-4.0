import React, { FC, useEffect, ChangeEvent } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    useTheme,
    useMediaQuery,
    TextField,
    DialogActions,
    Button
} from "@material-ui/core";

import { SlideUp } from "../../Shared/Transitions";
import { useSnackbar } from "notistack";
import { HeaderState, HeaderChangeKey, HeaderDispatch } from "./HeaderReducer";
import { FirebaseService } from "../../../firebase";

type HeaderLoginDialogProps = HeaderState<"currentUser" | "email" | "dialog" | "password"> &
    HeaderDispatch;

export const HeaderLoginDialog: FC<HeaderLoginDialogProps> = ({ dispatch, ...props }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(user =>
            dispatch({ type: "userChange", user })
        );
    }, [dispatch]);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        FirebaseService.auth
            .signInWithEmailAndPassword(props.email, props.password)
            .catch(error => enqueueSnackbar(error.message, { variant: "error" }));
    };

    const handleLogout = () => {
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: "error" }));
    };

    const handleDialogChange = () => dispatch({ type: "dialogChange" });

    const handleTextFieldChange = (key: HeaderChangeKey) => (
        event: ChangeEvent<HTMLInputElement>
    ) => dispatch({ type: "textFieldChange", key, value: event.target.value });

    return (
        <Dialog
            hideBackdrop={fullScreen}
            TransitionComponent={SlideUp}
            fullWidth
            maxWidth="xs"
            fullScreen={fullScreen}
            open={props.dialog}
            onClose={handleDialogChange}
        >
            {props.currentUser ? (
                <DialogActions>
                    <Box width="100%" display="flex" justifyContent="center">
                        <Button onClick={handleLogout}>logout</Button>
                    </Box>
                </DialogActions>
            ) : (
                <form onSubmit={handleLogin}>
                    <DialogContent>
                        <TextField
                            autoComplete="username"
                            onChange={handleTextFieldChange("email")}
                            variant="filled"
                            margin="dense"
                            fullWidth
                            label="email"
                        />
                        <TextField
                            autoComplete="current-password"
                            onChange={handleTextFieldChange("password")}
                            variant="filled"
                            margin="dense"
                            fullWidth
                            type="password"
                            label="password"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Box width="100%" display="flex" justifyContent="space-evenly">
                            <Button onClick={handleDialogChange}>Abbrechen</Button>
                            <Button color="primary" type="submit">
                                Login
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            )}
        </Dialog>
    );
};
