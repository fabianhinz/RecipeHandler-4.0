import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import OpenDrawerIcon from "@material-ui/icons/KeyboardArrowUpTwoTone";
import AccountIcon from "@material-ui/icons/AccountCircleTwoTone";
import React, { FC, useState, useEffect } from "react";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    Hidden,
    IconButton,
    makeStyles,
    PaletteType,
    Paper,
    SwipeableDrawer,
    Dialog,
    DialogContent,
    useTheme,
    useMediaQuery,
    TextField,
    DialogActions,
    Button
} from "@material-ui/core";
import { Navigate } from "../routes/Navigate";
import { PATHS } from "../routes/Routes";
import { auth } from "../util/Firebase";
import { SlideUp } from "../util/Transitions";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            borderRadius: "0 0 10px 10px",
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: theme.zIndex.appBar,
            padding: theme.spacing(1)
        },
        openDrawerIcon: {
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: theme.zIndex.drawer + 1
        }
    })
);

interface HeaderProps {
    onThemeToggle: () => void;
    themeType: PaletteType;
}

export const Header: FC<HeaderProps> = props => {
    const [drawer, setDrawer] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        return auth.onAuthStateChanged(nextOrObserver => console.log(nextOrObserver))
    }, [])

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => enqueueSnackbar(error.message, { variant: "error" }));
    }

    const navigationElements = (
        <>
            <Navigate to={PATHS.home}>
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Navigate>
            <IconButton onClick={props.onThemeToggle}>
                <BrightnessIcon />
            </IconButton>
            <Navigate to={PATHS.recipeCreate}>
                <IconButton>
                    <AddIcon />
                </IconButton>
            </Navigate>
            <IconButton onClick={() => setDialog(true)}>
                <AccountIcon />
            </IconButton>
        </>
    );

    return (
        <>
            <Hidden mdDown>
                <Paper className={classes.paper}>
                    <Box display="flex" flexDirection="column">
                        {navigationElements}
                    </Box>
                </Paper>
            </Hidden>
            <Hidden lgUp>
                <SwipeableDrawer
                    anchor="bottom"
                    open={drawer}
                    onClose={() => setDrawer(false)}
                    onOpen={() => setDrawer(true)}
                >
                    <Grid container justify="space-evenly">
                        {navigationElements}
                    </Grid>
                </SwipeableDrawer>
                {!drawer && (
                    <Fab
                        size="small"
                        className={classes.openDrawerIcon}
                        onClick={() => setDrawer(true)}
                    >
                        <OpenDrawerIcon />
                    </Fab>
                )}
            </Hidden>
            <Dialog
                hideBackdrop={fullScreen}
                TransitionComponent={SlideUp}
                fullWidth
                maxWidth="xs"
                fullScreen={fullScreen}
                open={dialog}
                onClose={() => setDialog(false)}
            >

                <DialogContent>
                    <form>
                        <TextField autoComplete="username" onChange={e => setEmail(e.target.value)} variant="filled" margin="dense" fullWidth label="email" />
                        <TextField autoComplete="current-password" onChange={e => setPassword(e.target.value)} variant="filled" margin="dense" fullWidth type="password" label="password" />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Box width="100%" display="flex" justifyContent="space-evenly">
                        <Button onClick={() => setDialog(false)}>Abbrechen</Button>
                        <Button color="primary" onClick={handleLogin}>Login</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};
