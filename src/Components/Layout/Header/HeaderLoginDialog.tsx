import React, { FC, ChangeEvent } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Typography
} from "@material-ui/core";

import { SlideUp } from "../../Shared/Transitions";
import { useSnackbar } from "notistack";
import { HeaderState, HeaderChangeKey, HeaderDispatch } from "./HeaderReducer";
import { FirebaseService } from "../../../firebase";
import { useFirebaseAuthContext } from "../../Provider/FirebaseAuthProvider";

type HeaderLoginDialogProps = HeaderState<"email" | "dialog" | "password"> & HeaderDispatch;

export const HeaderLoginDialog: FC<HeaderLoginDialogProps> = ({ dispatch, ...props }) => {
    const { user } = useFirebaseAuthContext();

    const { enqueueSnackbar } = useSnackbar();

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
            TransitionComponent={SlideUp}
            fullWidth
            maxWidth="xs"
            open={props.dialog}
            onClose={handleDialogChange}
        >
            {user ? (
                <>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            Angemeldet als {user.email}. Rezepte können nun bearbeitet und erstellt
                            werden.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box width="100%" display="flex" justifyContent="space-evenly">
                            <Button onClick={handleDialogChange}>Schließen</Button>
                            <Button color="primary" onClick={handleLogout}>
                                logout
                            </Button>
                        </Box>
                    </DialogActions>
                </>
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
                        <Box flexGrow={1} display="flex" justifyContent="space-evenly">
                            <Button onClick={handleDialogChange}>Schließen</Button>
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
