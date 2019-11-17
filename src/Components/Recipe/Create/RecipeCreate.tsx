import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    createStyles,
    Divider,
    IconButton,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
import SpeedDialIcon from '@material-ui/icons/ClassRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import MenuIcon from '@material-ui/icons/MenuBookTwoTone'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import EyeIcon from '@material-ui/icons/RemoveRedEyeTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'

import { getRefPaths } from '../../../hooks/useAttachementRef'
import { useCategorySelect } from '../../../hooks/useCategorySelect'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import CategoryWrapper from '../../Category/CategoryWrapper'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeResult from '../Result/RecipeResult'
import { RecipeResultRelated } from '../Result/RecipeResultRelated'
import { RecipeCreateAttachements } from './Attachements/RecipeCreateAttachements'
import { useAttachementDropzone } from './Attachements/useAttachementDropzone'
import { AttachementName, CreateChangeKey, useRecipeCreateReducer } from './RecipeCreateReducer'
import { RecipeCreateRelatedDialog } from './RecipeCreateRelatedDialog'
import { useRecipeCreateService } from './useRecipeCreateService'

const useStyles = makeStyles(theme =>
    createStyles({
        textFieldName: {
            marginBottom: theme.spacing(1),
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
    })
)

interface RecipeCreateProps extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe<AttachementMetadata> | null
    edit?: boolean
}

const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe)
    const { attachements, dropzoneProps } = useAttachementDropzone(state.attachements)
    const [speedDialOpen, setSpeedDialOpen] = useState(false)

    const recipeCreateService = useRecipeCreateService(state, props.edit)
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe)
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const classes = useStyles()

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

    const handleAttachementsDrop = (newAttachements: AttachementData[]) => {}

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

    return (
        <>
            <Card>
                <CardHeader
                    title={
                        <TextField
                            margin="none"
                            fullWidth
                            disabled={props.edit}
                            className={classes.textFieldName}
                            label="Name"
                            value={state.name}
                            placeholder="Bitte eintragen"
                            onChange={handleTextFieldChange('name')}
                        />
                    }
                    subheader="Ein Rezept sollte mindestens einen Namen und Kategorie aufweißen. Nach
                        erfolgter Speicherung ist die Änderung des Rezeptnamens nicht mehr
                        möglich"
                    className={classes.cardHeader}
                />
                <CardContent>
                    <Subtitle noMargin icon={<MenuIcon />} text="Kategorien" />
                    <CategoryWrapper
                        selectedCategories={selectedCategories}
                        onCategoryChange={setSelectedCategories}
                    />

                    <Subtitle icon={<CameraIcon />} text="Bilder" />
                    <RecipeCreateAttachements
                        onAttachements={handleAttachementsDrop}
                        onDeleteAttachement={handleDeleteAttachement}
                        onRemoveAttachement={handleRemoveAttachement}
                        onSaveAttachement={handleSaveAttachement}
                        attachements={state.attachements}
                    />

                    <Subtitle icon={<AssignmentIcon />} text="Zutaten für">
                        {/* ToDo extract */}
                        <Box display="flex" alignItems="center">
                            <IconButton
                                onClick={() => dispatch({ type: 'decreaseAmount' })}
                                size="small">
                                <RemoveIcon />
                            </IconButton>
                            <Box marginLeft={0.5} marginRight={0.5} width={25} textAlign="center">
                                <Typography variant="h6">{state.amount}</Typography>
                            </Box>
                            <IconButton
                                onClick={() => dispatch({ type: 'increaseAmount' })}
                                size="small">
                                <AddIcon />
                            </IconButton>
                            <Box marginLeft={0.5} marginRight={0.5} width={25} textAlign="center">
                                <Typography variant="h5">
                                    {state.amount < 2 ? 'Person' : 'Personen'}
                                </Typography>
                            </Box>
                        </Box>
                    </Subtitle>
                    <TextField
                        label="optional"
                        value={state.ingredients}
                        onChange={handleTextFieldChange('ingredients')}
                        fullWidth
                        rowsMax={10}
                        multiline
                        variant="filled"
                        margin="dense"
                    />

                    <Subtitle icon={<BookIcon />} text="Beschreibung" />
                    <TextField
                        label="optional"
                        value={state.description}
                        rowsMax={10}
                        onChange={handleTextFieldChange('description')}
                        fullWidth
                        multiline
                        variant="filled"
                        margin="dense"
                    />

                    <Subtitle icon={<LabelIcon />} text="Passt gut zu" />
                    <RecipeResultRelated relatedRecipes={state.relatedRecipes} />
                </CardContent>

                <Divider />

                <CardActions>
                    <Box
                        flexGrow={1}
                        display="flex"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <IconButton onClick={() => dispatch({ type: 'previewChange' })}>
                            <EyeIcon />
                        </IconButton>
                        <Navigate to={PATHS.home}>
                            <IconButton>
                                <CloseIcon />
                            </IconButton>
                        </Navigate>
                    </Box>
                </CardActions>
            </Card>

            {/* ToDo extract */}
            <Collapse in={state.preview} timeout="auto" mountOnEnter unmountOnExit>
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
            </Collapse>

            <RecipeCreateRelatedDialog
                defaultValues={state.relatedRecipes}
                currentRecipeName={state.name}
                open={state.relatedRecipesDialog}
                onClose={relatedRecipes =>
                    dispatch({ type: 'relatedRecipesChange', relatedRecipes })
                }
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
                    icon={<SaveIcon />}
                    onClick={handleSaveClick}
                    tooltipTitle="Rezept speichern"
                    FabProps={{ size: 'medium' }}
                />
                <SpeedDialAction
                    onClick={() => dispatch({ type: 'openRelatedRecipesDialog' })}
                    tooltipTitle="Passt gut zu bearbeiten"
                    FabProps={{ size: 'medium' }}
                    icon={<SwapIcon />}
                />
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
            </SpeedDial>
        </>
    )
}

export default RecipeCreate
