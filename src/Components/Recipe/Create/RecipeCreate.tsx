import {
    Box,
    createStyles,
    Grid,
    IconButton,
    InputBase,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
import SpeedDialIcon from '@material-ui/icons/ClassRounded'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import EyeIcon from '@material-ui/icons/RemoveRedEyeTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { createWorker } from 'tesseract.js'

import { getRefPaths } from '../../../hooks/useAttachementRef'
import { useCategorySelect } from '../../../hooks/useCategorySelect'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import CategoryWrapper from '../../Category/CategoryWrapper'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'
import RecipeResult from '../Result/RecipeResult'
import { RecipeResultRelated } from '../Result/RecipeResultRelated'
import { RecipeCreateAttachements } from './Attachements/RecipeCreateAttachements'
import { useAttachementDropzone } from './Attachements/useAttachementDropzone'
import { AttachementName, CreateChangeKey, useRecipeCreateReducer } from './RecipeCreateReducer'
import { RecipeCreateRelatedDialog } from './RecipeCreateRelatedDialog'
import { useRecipeCreate } from './useRecipeCreate'

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1),
            width: '100%',
            ...theme.typography.h5,
        },
        cardHeader: {
            paddingBottom: 0,
        },
        speedDial: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(4.5),
        },
        iconButtonSubtitle: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
    })
)

interface RecipeCreateProps extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe<AttachementMetadata> | null
    edit?: boolean
}
// ! this is a mess, split into multiple components
const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe)
    const { attachements, dropzoneProps } = useAttachementDropzone(state.attachements)
    const [speedDialOpen, setSpeedDialOpen] = useState(false)

    const recipeCreateService = useRecipeCreate(state, props.edit)
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe)
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const classes = useStyles()

    const ocr = useCallback(async () => {
        if (attachements.length === 0) return

        console.time('tesseract')
        const worker = createWorker({
            logger: m => console.log(m),
        })

        await worker.load()
        await worker.loadLanguage('deu')
        await worker.initialize('deu')

        try {
            const {
                data: { text },
            } = await worker.recognize(attachements[0].dataUrl)
            console.log(text)
        } catch (e) {
            console.error(e)
        }

        console.timeEnd('tesseract')
        worker.terminate()
    }, [attachements])

    useEffect(() => {
        ocr()
    }, [attachements, ocr])

    useEffect(() => {
        dispatch({ type: 'attachementsDrop', newAttachements: attachements })
    }, [attachements, dispatch])

    useEffect(() => {
        if (!user) history.push(PATHS.home)
    }, [history, user])

    useEffect(() => {
        dispatch({ type: 'categoriesChange', selectedCategories })
    }, [dispatch, selectedCategories])

    const handleSaveClick = useCallback(async () => {
        const valid = await recipeCreateService.validate(selectedCategories)
        if (!valid) return

        const attachmentMetadata = await recipeCreateService.uploadAttachments()
        await recipeCreateService.saveRecipeDocument(attachmentMetadata)
        // eslint-disable-next-line prettier/prettier
    },[recipeCreateService, selectedCategories] )

    const handleRemoveAttachement = (name: string) => {
        dispatch({ type: 'removeAttachement', name })
    }

    const handleDeleteAttachement = (name: string, fullPath: string) => {
        const { smallPath, mediumPath } = getRefPaths(fullPath)

        const full = FirebaseService.storageRef.child(fullPath)
        const medium = FirebaseService.storageRef.child(smallPath)
        const small = FirebaseService.storageRef.child(mediumPath)

        handleRemoveAttachement(name)
        dispatch({ type: 'storageDeleteRefsChange', refs: [full, medium, small] })
    }

    const handleSaveAttachement = (name: AttachementName) => {
        closeSnackbar()
        if (state.attachements.filter(a => a.name === name.new).length > 0) {
            enqueueSnackbar('Änderung wird nicht gespeichert. Name bereits vorhanden', {
                variant: 'warning',
            })
        } else {
            dispatch({ type: 'attachementNameChange', name })
            enqueueSnackbar(`Name von '${name.old}' auf '${name.new}' geändert`, {
                variant: 'success',
            })
        }
    }

    const handleTextFieldChange = (key: CreateChangeKey) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        dispatch({ type: 'textFieldChange', key, value: event.target.value })
    }

    const warnOnLocationChange = () => {
        if (props.recipe && !recipeCreateService.changesSaved) return true
        else if (state.name.length !== 0 && !recipeCreateService.changesSaved) return true
        else return false
    }

    return (
        <>
            {state.preview ? (
                <RecipeResult
                    variant="preview"
                    recipe={{
                        name: state.name,
                        createdDate: FirebaseService.createTimestampFromDate(new Date()),
                        numberOfComments: 0,
                        categories: state.categories,
                        attachements: state.attachements,
                        ingredients: state.ingredients,
                        amount: state.amount,
                        description: state.description,
                        relatedRecipes: state.relatedRecipes,
                    }}
                />
            ) : (
                <Grid container spacing={4} alignContent="stretch">
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <InputBase
                                    autoFocus
                                    disabled={props.edit}
                                    className={classes.textFieldName}
                                    value={state.name}
                                    placeholder="Name"
                                    onChange={handleTextFieldChange('name')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component="span" color="textSecondary">
                                    Ein Rezept sollte mindestens einen Namen und Kategorie
                                    aufweißen. Nach erfolgter Speicherung ist die Änderung des
                                    Rezeptnamens nicht mehr möglich
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <CategoryWrapper
                            selectedCategories={selectedCategories}
                            onCategoryChange={setSelectedCategories}
                        />
                    </Grid>

                    {state.attachements.length > 0 && (
                        <Grid item xs={12}>
                            <RecipeCreateAttachements
                                onDeleteAttachement={handleDeleteAttachement}
                                onRemoveAttachement={handleRemoveAttachement}
                                onSaveAttachement={handleSaveAttachement}
                                attachements={state.attachements}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} lg={6} xl={4}>
                        <RecipeCard
                            variant="preview"
                            header={
                                <Subtitle icon={<AssignmentIcon />} text="Zutaten für">
                                    {/* ToDo extract */}
                                    <Box display="flex" alignItems="center">
                                        <IconButton
                                            className={classes.iconButtonSubtitle}
                                            onClick={() => dispatch({ type: 'decreaseAmount' })}
                                            size="small">
                                            <RemoveIcon />
                                        </IconButton>
                                        <Box
                                            marginLeft={0.5}
                                            marginRight={0.5}
                                            width={25}
                                            textAlign="center">
                                            <Typography variant="h6">{state.amount}</Typography>
                                        </Box>
                                        <IconButton
                                            className={classes.iconButtonSubtitle}
                                            onClick={() => dispatch({ type: 'increaseAmount' })}
                                            size="small">
                                            <AddIcon />
                                        </IconButton>
                                        <Box
                                            marginLeft={0.5}
                                            marginRight={0.5}
                                            width={25}
                                            textAlign="center">
                                            <Typography variant="h5">
                                                {state.amount < 2 ? 'Person' : 'Personen'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Subtitle>
                            }
                            content={
                                <TextField
                                    label="optional"
                                    value={state.ingredients}
                                    onChange={handleTextFieldChange('ingredients')}
                                    fullWidth
                                    rows={15}
                                    multiline
                                    variant="outlined"
                                    margin="dense"
                                />
                            }
                        />
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4}>
                        <RecipeCard
                            variant="preview"
                            header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
                            content={
                                <TextField
                                    label="optional"
                                    value={state.description}
                                    rows={15}
                                    onChange={handleTextFieldChange('description')}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    margin="dense"
                                />
                            }
                        />
                    </Grid>

                    {state.relatedRecipes.length > 0 && (
                        <Grid item xs={12} lg={6} xl={4}>
                            <RecipeCard
                                variant="preview"
                                header={<Subtitle icon={<LabelIcon />} text="Passt gut zu" />}
                                content={
                                    <RecipeResultRelated relatedRecipes={state.relatedRecipes} />
                                }
                            />
                        </Grid>
                    )}
                </Grid>
            )}

            <RecipeCreateRelatedDialog
                defaultValues={state.relatedRecipes}
                currentRecipeName={state.name}
                open={state.relatedRecipesDialog}
                onClose={relatedRecipes =>
                    dispatch({ type: 'relatedRecipesChange', relatedRecipes })
                }
            />

            <Prompt
                when={warnOnLocationChange()}
                message="Nicht gespeicherte Änderungen gehen verloren. Trotzdem die Seite verlassen?"
            />

            {/* ToDo extract */}
            <SpeedDial
                className={classes.speedDial}
                FabProps={{ color: 'secondary' }}
                ariaLabel="recipe create speed dial"
                open={speedDialOpen}
                onOpen={() => setSpeedDialOpen(true)}
                onClose={() => setSpeedDialOpen(false)}
                icon={<SpeedDialIcon />}
                openIcon={<SpeedDialIcon />}>
                <SpeedDialAction
                    {...dropzoneProps.getRootProps()}
                    icon={
                        <>
                            <input {...dropzoneProps.getInputProps()} />
                            <CameraIcon />
                        </>
                    }
                    FabProps={{ size: 'medium' }}
                    tooltipTitle="Bild hinzufügen"
                />
                <SpeedDialAction
                    onClick={() => dispatch({ type: 'openRelatedRecipesDialog' })}
                    tooltipTitle="Passt gut zu bearbeiten"
                    FabProps={{ size: 'medium' }}
                    icon={<SwapIcon />}
                />
                <SpeedDialAction
                    icon={<EyeIcon />}
                    onClick={() => dispatch({ type: 'previewChange' })}
                    tooltipTitle="Vorschau umschalten"
                    FabProps={{ size: 'medium' }}
                />
                <SpeedDialAction
                    icon={<SaveIcon />}
                    onClick={handleSaveClick}
                    tooltipTitle="Rezept speichern"
                    FabProps={{ size: 'medium' }}
                />
            </SpeedDial>
        </>
    )
}

export default RecipeCreate
