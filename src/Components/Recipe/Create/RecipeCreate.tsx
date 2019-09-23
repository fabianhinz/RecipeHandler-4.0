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
import { AttachementData, AttachementMetadata, Recipe } from "../../../model/model";
import { isData } from "../../../model/modelUtil";
import { PATHS } from "../../Routes/Routes";
import { Subtitle } from "../../Shared/Subtitle";
import { FirebaseService } from "../../../firebase";
import { RouteComponentProps, Redirect } from "react-router";
import { useRecipeCreateReducer, CreateChangeKey, AttachementName } from "./RecipeCreateReducer";
import { CategoryWrapper } from "../../Category/CategoryWrapper";
import { useCategorySelect } from "../../../hooks/useCategorySelect";
import { useFirebaseAuthContext } from "../../Provider/FirebaseAuthProvider";
import { useCategoriesCollectionContext } from "../../Provider/CategoriesCollectionProvider";
import { Navigate } from "../../Routes/Navigate";

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1)
        }
    })
);

interface RecipeCreateProps extends Pick<RouteComponentProps, "history" | "location"> {
    recipe?: Recipe<AttachementMetadata> | null;
}

const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe);
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe);
    const { categoriesCollection } = useCategoriesCollectionContext();
    const { user } = useFirebaseAuthContext();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(() => {
        dispatch({ type: "categoriesChange", selectedCategories });
    }, [dispatch, selectedCategories]);

    useEffect(() => {
        if (state.attachementsUploading)
            enqueueSnackbar(<>Bilder werden verarbeitet</>, {
                persist: true,
                variant: "info",
                key: "ATTACHEMENT_UPLOAD_IN_PROGRESS"
            });
        else closeSnackbar("ATTACHEMENT_UPLOAD_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, state.attachementsUploading]);

    useEffect(() => {
        if (state.recipeUploading)
            enqueueSnackbar(<>Rezept wird gespeichert</>, {
                persist: true,
                variant: "info",
                key: "RECIPE_CREATION_IN_PROGRESS"
            });
        else closeSnackbar("RECIPE_CREATION_IN_PROGRESS");
        return () => closeSnackbar("RECIPE_CREATION_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, state.recipeUploading]);

    const handleSaveClick = async () => {
        if (!categoriesCollection) return;

        const documentSnapshot = await FirebaseService.firestore
            .collection("recipes")
            .doc(state.name)
            .get();

        if (documentSnapshot.exists && document.location.pathname.includes("create"))
            return enqueueSnackbar(<>Rezept mit dem Namen {state.name} existiert bereits</>, {
                variant: "info"
            });

        if (selectedCategories.size === 0 || state.name.length === 0)
            return enqueueSnackbar(
                <>Das Rezept sollte um mindestens eine Kategorie und den Namen ergänzt werden</>,
                {
                    variant: "warning"
                }
            );

        dispatch({ type: "attachementsUploadingChange", now: true });
        const uploadTasks: Array<PromiseLike<any>> = [];
        const oldMetadata: Array<AttachementMetadata> = [];
        for (const attachement of state.attachements) {
            if (!isData(attachement)) {
                // ? old Metadata indicates that those attachements are already uploaded
                oldMetadata.push(attachement);
                continue;
            }
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
        const newMetadata: Array<AttachementMetadata> = [];
        finishedTaks.forEach((snapshot: firebase.storage.UploadTaskSnapshot) => {
            // ? on "storage/unauthorized" snapshot is not of type "object"
            if (typeof snapshot !== "object") return;
            const { fullPath, size, name } = snapshot.metadata;
            newMetadata.push({
                fullPath,
                name,
                size
            });
        });

        dispatch({ type: "recipeUploadingChange", now: true });
        const { name, ingredients, description, categories } = state;
        try {
            await FirebaseService.firestore
                .collection("recipes")
                .doc(name)
                .set({
                    name,
                    ingredients,
                    description,
                    attachements: [...oldMetadata, ...newMetadata],
                    categories,
                    createdDate: FirebaseService.createTimestampFrom(new Date())
                });

            await FirebaseService.firestore
                .collection("rating")
                .doc(state.name)
                .set({ value: 0 });

            props.history.push(PATHS.home);
            enqueueSnackbar(<>{state.name} gespeichert</>, {
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
        dispatch({ type: "removeAttachement", name });
    };

    const handleDeleteAttachement = async (name: string, path: string) => {
        await FirebaseService.storageRef.child(path).delete();
        dispatch({ type: "removeAttachement", name });
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

    if (!user) return <Redirect to={PATHS.home} />;

    return (
        <Fade in>
            <Box margin={2}>
                <Card>
                    <CardHeader
                        title={
                            <TextField
                                disabled={document.location.pathname.includes("edit")}
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
                            selectedCategories={selectedCategories}
                            onCategoryChange={setSelectedCategories}
                        />

                        <Box marginTop={2} marginBottom={2}>
                            <Divider />
                        </Box>

                        <Subtitle icon={<CameraIcon />} text="Bilder" />
                        <RecipeCreateAttachements
                            onAttachements={handleAttachementsDrop}
                            onDeleteAttachement={handleDeleteAttachement}
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
                                <Navigate to={PATHS.home}>
                                    <Button size="small">Abbrechen</Button>
                                </Navigate>

                                <Button
                                    disabled={state.attachementsUploading}
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
                                recipe={{
                                    name: state.name,
                                    createdDate: FirebaseService.createTimestampFrom(new Date()),
                                    categories: state.categories,
                                    attachements: state.attachements,
                                    ingredients: state.ingredients,
                                    description: state.description
                                }}
                            />
                        </CardContent>
                    </Collapse>
                </Card>
            </Box>
        </Fade>
    );
};

export default RecipeCreate;
