import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import EyeIcon from "@material-ui/icons/RemoveRedEyeTwoTone";
import React, {
    FC,
    useCallback,
    useEffect,
    useState
    } from "react";
import {
    AttachementData,
    AttachementMetadata,
    isData,
    Recipe
    } from "../../../util/Mock";
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
import { Categories, CategoriesAs } from "../../category/Categories";
import { firestore, storageRef } from "../../../util/Firebase";
import { PATHS } from "../../../routes/Routes";
import { RecipeCreateAttachements } from "./RecipeCreateAttachements";
import { RecipeResult } from "../result/RecipeResult";
import { Subtitle } from "../../../util/Subtitle";
import { useRouter } from "../../../routes/RouterContext";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1)
        }
    })
);

const RecipeCreate: FC = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { history, location } = useRouter();
    const classes = useStyles();

    const [ingredients, setIngredients] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [attachements, setAttachements] = useState<Array<AttachementData | AttachementMetadata>>([]);
    const [name, setName] = useState<string>("");
    const [preview, setPreview] = useState(false);
    const [categories, setSelectedCategories] = useState<CategoriesAs<Array<string>>>({ type: [], time: [] });

    const [attachementsUploading, setAttachementsUploading] = useState(false);
    const [recipeUploading, setRecipeUploading] = useState(false);

    const saveDisabled = name.length === 0 || attachementsUploading

    useEffect(() => {
        try {
            const {
                name,
                categories,
                attachements,
                ingredients,
                description
            } = location.state as Recipe<AttachementMetadata>;
            setName(name);
            setSelectedCategories(categories);
            setAttachements(attachements);
            setIngredients(ingredients);
            setDescription(description);
        } catch (e) {
            if (location.pathname.includes("/edit/"))
                enqueueSnackbar(
                    <>Rezept nicht gefunden, Bestimmt möchtest du eine neues erstellen</>,
                    { variant: "info" }
                );
        }
    }, [enqueueSnackbar, location.pathname, location.state]);

    useEffect(() => {
        if (attachementsUploading) enqueueSnackbar(<>Bilder werden hochgeladen</>, { variant: "info", key: "ATTACHEMENT_UPLOAD_IN_PROGRESS" });
        else closeSnackbar("ATTACHEMENT_UPLOAD_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, attachementsUploading])

    useEffect(() => {
        if (recipeUploading) enqueueSnackbar(<>Rezept wird engelegt</>, { variant: "info", key: "RECIPE_CREATION_IN_PROGRESS" })
        else closeSnackbar("RECIPE_CREATION_IN_PROGRESS");
    }, [closeSnackbar, enqueueSnackbar, recipeUploading])

    const handleSaveClick = () => {
        const tasks: Array<PromiseLike<any>> = [];
        setAttachementsUploading(true)

        attachements.forEach(attachement => {
            if (isData(attachement)) {
                const uploadTask = storageRef
                    .child(`recipes/${name}/${attachement.name}`)
                    .putString(attachement.dataUrl, "data_url");
                tasks.push(uploadTask);
            }
        });

        Promise.all(tasks)
            .then(finishedTaks => {
                setAttachementsUploading(false);

                const metadata: Array<AttachementMetadata> = []
                finishedTaks.forEach((snapshot: firebase.storage.UploadTaskSnapshot) => {
                    const { fullPath, size, name } = snapshot.metadata;
                    metadata.push({ fullPath, name, size })
                })

                setRecipeUploading(true)
                firestore
                    .collection("recipes")
                    .add({ name, ingredients, description, attachements: metadata, categories })
                    .then(() => {
                        setRecipeUploading(false)
                        history.push(PATHS.home);
                        enqueueSnackbar(<>{name} angelegt</>, { variant: "success" });
                    }
                    )
            })
            .catch(error => {
                setAttachementsUploading(false);
                setRecipeUploading(false)
                enqueueSnackbar(<>{error.message}</>, { variant: "error" })
            })
    };

    const handleAttachementsDrop = (newAttachements: AttachementData[]) => {
        setAttachements(previous => [...previous, ...newAttachements]);
    };

    const handleRemoveAttachement = (name: string) => {
        // ToDo delete ref from firestore and img from storage
        setAttachements(previous =>
            previous.filter(attachement => attachement.name !== name)
        );
    };

    const handleCategoriesChange = (categories: CategoriesAs<Array<string>>) => {
        setSelectedCategories(categories);
    };
    // ? with useCallback  and memo chained together we improve performance
    const handleSaveAttachement = useCallback(
        (name: { old: string; new: string }) => {
            // ! close all remaining snackbars - don't know if this is a good idea
            // ? useEffect --> see uploading state
            closeSnackbar();
            if (attachements.filter(a => a.name === name.new).length > 0) {
                enqueueSnackbar(
                    <>Änderung wird nicht gespeichert. Name bereits vorhanden</>,
                    {
                        variant: "warning"
                    }
                );
            } else {
                attachements.forEach(attachement => {
                    if (attachement.name === name.old) attachement.name = name.new;
                });
                setAttachements(attachements);
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
        [attachements, closeSnackbar, enqueueSnackbar]
    );

    return (
        <Fade in>
            <Box margin={2}>
                <Card>
                    <CardHeader
                        title={
                            <TextField
                                className={classes.textFieldName}
                                label="Name"
                                value={name}
                                placeholder="Bitte eintragen"
                                onChange={e => setName(e.target.value)}
                            />
                        }
                        subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten. Ein Teil der Beschreibung wird in der Rezeptübersicht auf der Startseite angezeigt."
                    />
                    <CardContent>
                        <Subtitle text="Kategorien" />
                        <Categories
                            fromRecipe={categories}
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
                            attachements={attachements}
                        />

                        <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
                        <TextField
                            placeholder="Zutatenliste"
                            value={ingredients}
                            onChange={e => setIngredients(e.target.value)}
                            fullWidth
                            rows={5}
                            multiline
                            variant="outlined"
                        />

                        <Subtitle icon={<BookIcon />} text="Beschreibung" />
                        <TextField
                            placeholder="Beschreibung"
                            value={description}
                            rows={5}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            variant="outlined"
                        />
                    </CardContent>

                    <CardActions>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                <Button size="small" onClick={() => history.goBack()}>
                                    Abbrechen
                                </Button>

                                <Button disabled={saveDisabled} size="small" color="primary" onClick={handleSaveClick}>
                                    Speichern
                                </Button>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => setPreview(previous => !previous)}>
                                    <EyeIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CardActions>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Collapse in={preview} timeout="auto" mountOnEnter>
                        <CardContent>
                            <RecipeResult
                                name={name}
                                created={new Date().toLocaleDateString()}
                                categories={categories}
                                attachements={attachements}
                                ingredients={ingredients}
                                description={description}
                            />
                        </CardContent>
                    </Collapse>
                </Card>

            </Box>
        </Fade>
    );
};

export default RecipeCreate;