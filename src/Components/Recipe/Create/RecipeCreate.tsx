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
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import MenuIcon from '@material-ui/icons/MenuBookTwoTone'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import EyeIcon from '@material-ui/icons/RemoveRedEyeTwoTone'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, FC, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'

import { FirebaseService } from '../../../firebase'
import { getRefPaths } from '../../../hooks/useAttachementRef'
import { useCategorySelect } from '../../../hooks/useCategorySelect'
import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import CategoryWrapper from '../../Category/CategoryWrapper'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeResult from '../Result/RecipeResult'
import { RecipeResultRelated } from '../Result/RecipeResultRelated'
import { RecipeCreateAttachements } from './Attachements/RecipeCreateAttachements'
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
    })
)

interface RecipeCreateProps extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe<AttachementMetadata> | null
    edit?: boolean
}

const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe)

    const recipeCreateService = useRecipeCreateService(state, props.edit)
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe)
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const classes = useStyles()

    useEffect(() => {
        if (!user) history.push(PATHS.home)
    }, [history, user])

    useEffect(() => {
        dispatch({ type: 'categoriesChange', selectedCategories })
    }, [dispatch, selectedCategories])

    const handleAttachementsDrop = (newAttachements: AttachementData[]) => {
        dispatch({ type: 'attachementsDrop', newAttachements })
    }

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

    const handleSaveClick = async () => {
        const valid = await recipeCreateService.validate(selectedCategories)
        if (!valid) return

        const attachmentMetadata = await recipeCreateService.uploadAttachments()
        await recipeCreateService.saveRecipeDocument(attachmentMetadata)
    }

    return (
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
                <Subtitle firstChild icon={<MenuIcon />} text="Kategorien" />
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
                            <Typography variant="h6">Person/en</Typography>
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

                <Subtitle icon={<LabelIcon />} text="Passt gut zu (optional)">
                    <IconButton
                        onClick={() => dispatch({ type: 'openRelatedRecipesDialog' })}
                        size="small">
                        <SwapIcon />
                    </IconButton>
                </Subtitle>
                <RecipeResultRelated relatedRecipes={state.relatedRecipes} />
                <RecipeCreateRelatedDialog
                    defaultValues={state.relatedRecipes}
                    currentRecipeName={state.name}
                    open={state.relatedRecipesDialog}
                    onClose={relatedRecipes =>
                        dispatch({ type: 'relatedRecipesChange', relatedRecipes })
                    }
                />
            </CardContent>

            <CardActions>
                <Box padding={1} flexGrow={1}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item xs={2}>
                            <IconButton onClick={() => dispatch({ type: 'previewChange' })}>
                                <EyeIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={10}>
                            <Grid container justify="flex-end" spacing={2}>
                                <Grid item>
                                    <Navigate to={PATHS.home}>
                                        <Button>Abbrechen</Button>
                                    </Navigate>
                                </Grid>

                                <Grid item>
                                    <Button
                                        disabled={recipeCreateService.loading}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveClick}>
                                        Speichern
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </CardActions>

            <Collapse in={state.preview} timeout="auto" mountOnEnter unmountOnExit>
                <>
                    <Divider />
                    <CardContent>
                        <RecipeResult
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
                    </CardContent>
                </>
            </Collapse>
        </Card>
    )
}

export default RecipeCreate
