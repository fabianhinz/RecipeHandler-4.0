import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import EyeIcon from "@material-ui/icons/RemoveRedEyeTwoTone";
import React, { FC, useCallback, useEffect, ChangeEvent } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    createStyles,
    Divider,
    Fade,
    Grid,
    IconButton,
    makeStyles,
    TextField
} from "@material-ui/core";
import { RecipeCreateAttachements } from "./Attachements/RecipeCreateAttachements";
import { RecipeResult } from "../Result/RecipeResult";
import { useSnackbar } from "notistack";
import { AttachementData, AttachementMetadata, Recipe, CategoryAs } from "../../../model/model";
import { isData } from "../../../model/modelUtil";
import { PATHS } from "../../Routes/Routes";
import { Subtitle } from "../../Shared/Subtitle";
import { FirebaseService } from "../../../firebase";
import { CategoryWrapper } from "../../Category/CategoryWrapper";
import { RouteComponentProps } from "react-router";
import { useRecipeCreateReducer, CreateChangeKey, AttachementName } from "./RecipeCreateReducer";

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1)
        }
    })
);
// Todo instead of multipel state and effects lets make a hook which manages loading states
// ToDo loading data from firbase only occures in the recipe edit component --> extract logic
interface RecipeCreateProps extends Pick<RouteComponentProps, "history" | "location"> {
    recipe?: Recipe<AttachementMetadata> | null;
}

const RecipeCreate: FC<RecipeCreateProps> = ({ history, location, recipe }) => {
    const { state, dispatch } = useRecipeCreateReducer();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();
    // ToDo what should we do here
    const saveDisabled = state.name.length === 0 || state.attachementsUploading;

    useEffect(() => {
        if (recipe) dispatch({ type: "loadState", recipe });
    }, [dispatch, recipe]);

    useEffect(() => {
        if (state.attachementsUploading)
            enqueueSnackbar(<>Bilder werden hochgeladen</>, {
                persist: true,
                variant: "info",
                key: "ATTACHEMENT_UPLOAD_IN_PROGRESS"
            });
        else closeSnackbar("ATTACHEMENT_UPLOAD_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, state.attachementsUploading]);

    useEffect(() => {
        if (state.recipeUploading)
            enqueueSnackbar(<>Rezept wird engelegt</>, {
                persist: true,
                variant: "info",
                key: "RECIPE_CREATION_IN_PROGRESS"
            });
        else closeSnackbar("RECIPE_CREATION_IN_PROGRESS");
        return () => closeSnackbar("RECIPE_CREATION_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, state.recipeUploading]);

    const handleSaveClick = async () => {
        dispatch({ type: "attachementsUploadingChange", now: true });
        const uploadTasks: Array<PromiseLike<any>> = [];
        for (const attachement of state.attachements) {
            if (!isData(attachement)) continue;
            const uploadTask = FirebaseService.storageRef
                .child(`recipes/${state.name}/${attachement.name}`)
                .putString(attachement.dataUrl, "data_url")
                .catch(error =>
                    enqueueSnackbar(<>{error.message}</>, {
                        variant: "error"
                    })
                );
            uploadTasks.push(uploadTask);
        }

        const finishedTaks = await Promise.all(uploadTasks);

        dispatch({ type: "attachementsUploadingChange", now: false });
        const metadata: Array<AttachementMetadata> = [];
        finishedTaks.forEach((snapshot: firebase.storage.UploadTaskSnapshot) => {
            // ? on "storage/unauthorized" snapshot is not of type "object"
            if (typeof snapshot !== "object") return;
            const { fullPath, size, name } = snapshot.metadata;
            metadata.push({
                fullPath,
                name,
                size
            });
        });

        dispatch({ type: "recipeUploadingChange", now: true });
        const { name, ingredients, description, categories } = state;
        try {
            await FirebaseService.firestore.collection("recipes").add({
                name,
                ingredients,
                description,
                attachements: metadata,
                categories,
                createdDate: FirebaseService.createTimestampFrom(new Date())
            });

            await FirebaseService.firestore
                .collection("rating")
                .doc(state.name)
                .set({ value: 0 });

            history.push(PATHS.home);
            enqueueSnackbar(<>{state.name} angelegt</>, {
                variant: "success"
            });
        } catch (e) {
            enqueueSnackbar(<>{e.message}</>, { variant: "error" });
        }
    };

    const handleAttachementsDrop = (newAttachements: AttachementData[]) => {
        dispatch({ type: "attachementsDrop", newAttachements });
    };

    const handleRemoveAttachement = (name: string) => {
        // ToDo delete ref from firestore and img from storage
        dispatch({ type: "removeAttachement", name });
    };

    const handleCategoriesChange = (categories: CategoryAs<Array<string>>) => {
        dispatch({ type: "categoryChange", categories });
    };

    // ? with useCallback  and memo chained together we improve performance
    const handleSaveAttachement = useCallback(
        (name: AttachementName) => {
            closeSnackbar();
            if (state.attachements.filter(a => a.name === name.new).length > 0) {
                enqueueSnackbar(<>Änderung wird nicht gespeichert. Name bereits vorhanden</>, {
                    variant: "warning"
                });
            } else {
                dispatch({ type: "attachementNameChange", name });
                enqueueSnackbar(
                    <>
                        Name von '{name.old}' auf '{name.new}' geändert
                    </>,
                    {
                        variant: "success"
                    }
                );
            }
        },
        [closeSnackbar, dispatch, enqueueSnackbar, state.attachements]
    );

    const handleTextFieldChange = (key: CreateChangeKey) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        dispatch({ type: "textFieldChange", key, value: event.target.value });
    };

    return (
        <Fade in>
            <Box margin={2}>
                <Card>
                    <CardHeader
                        title={
                            <TextField
                                className={classes.textFieldName}
                                label="Name"
                                value={state.name}
                                placeholder="Bitte eintragen"
                                onChange={handleTextFieldChange("name")}
                            />
                        }
                        subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten. Ein Teil der Beschreibung wird in der Rezeptübersicht auf der Startseite angezeigt."
                    />
                    <CardContent>
                        <Subtitle text="Kategorien" />
                        <CategoryWrapper
                            fromRecipe={state.categories}
                            onChange={handleCategoriesChange}
                        />

                        <Box marginTop={2} marginBottom={2}>
                            <Divider />
                        </Box>

                        <Subtitle icon={<CameraIcon />} text="Bilder" />
                        <RecipeCreateAttachements
                            onAttachements={handleAttachementsDrop}
                            onRemoveAttachement={handleRemoveAttachement}
                            onSaveAttachement={handleSaveAttachement}
                            attachements={state.attachements}
                        />

                        <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
                        <TextField
                            placeholder="Zutatenliste"
                            value={state.ingredients}
                            onChange={handleTextFieldChange("ingredients")}
                            fullWidth
                            rows={5}
                            multiline
                            variant="outlined"
                        />

                        <Subtitle icon={<BookIcon />} text="Beschreibung" />
                        <TextField
                            placeholder="Beschreibung"
                            value={state.description}
                            rows={5}
                            onChange={handleTextFieldChange("description")}
                            fullWidth
                            multiline
                            variant="outlined"
                        />
                    </CardContent>

                    <CardActions>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                <Button size="small" onClick={() => history.push(PATHS.home)}>
                                    Abbrechen
                                </Button>

                                <Button
                                    disabled={saveDisabled}
                                    size="small"
                                    color="primary"
                                    onClick={handleSaveClick}
                                >
                                    Speichern
                                </Button>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => dispatch({ type: "previewChange" })}>
                                    <EyeIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CardActions>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Collapse in={state.preview} timeout="auto" mountOnEnter>
                        <CardContent>
                            <RecipeResult
                                name={state.name}
                                created={new Date().toLocaleDateString()}
                                categories={state.categories}
                                attachements={state.attachements}
                                ingredients={state.ingredients}
                                description={state.description}
                            />
                        </CardContent>
                    </Collapse>
                </Card>
            </Box>
        </Fade>
    );
};

export default RecipeCreate;
