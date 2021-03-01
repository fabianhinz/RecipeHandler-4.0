import {
    Checkbox,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    TextField,
    Tooltip,
    useTheme,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import clsx from 'clsx'
import { CartOff } from 'mdi-material-ui'
import React, { useCallback, useMemo, useState } from 'react'
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import RecipeDetailsButton from '../Recipe/RecipeDetailsButton'
import EntryGridContainer from '../Shared/EntryGridContainer'
import FabContainer from '../Shared/FabContainer'
import NotFound from '../Shared/NotFound'
import StyledCard from '../Shared/StyledCard'

const useStyles = makeStyles(theme => ({
    checked: {
        textDecoration: 'line-through',
    },
    sonstigesRoot: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 150,
    },
    listSubHeader: {
        fontSize: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
}))

const getListStyle = (isDraggingOver: any) => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
})

const AccountUserShoppingList = () => {
    const [textFieldValue, setTextFieldValue] = useState('')
    const theme = useTheme()
    const classes = useStyles()

    const { user, shoppingList, shoppingTracker } = useFirebaseAuthContext()
    const { gridBreakpointProps } = useGridContext()

    useDocumentTitle(`Einkaufsliste (${shoppingList.size})`)

    const shoppingListDocRef = useMemo(
        () =>
            FirebaseService.firestore.collection('users').doc(user?.uid).collection('shoppingList'),
        [user]
    )

    const handleCheckboxChange = (recipe: string, grocery: string) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        let tracker = shoppingTracker.get(recipe)?.tracker

        if (!tracker) tracker = [grocery]
        else if (checked) tracker.push(grocery)
        else tracker = tracker.filter(trackerEl => trackerEl !== grocery)

        await shoppingListDocRef.doc(recipe).set({ tracker }, { merge: true })
    }

    const handleRemove = (recipe: string) => () => shoppingListDocRef.doc(recipe).delete()

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setTextFieldValue('')

        let list = shoppingList.get('Sonstiges')?.list

        if (!list) list = [textFieldValue]
        else if (!list.some(el => el === textFieldValue)) list.push(textFieldValue)
        else list = list.filter(listEl => listEl !== textFieldValue)

        if (list.length === 0) await shoppingListDocRef.doc('Sonstiges').delete()
        else await shoppingListDocRef.doc('Sonstiges').set({ list }, { merge: true })
    }

    const listItemChecked = (recipe: string, grocery: string) =>
        Boolean(shoppingTracker.get(recipe)?.tracker?.some(trackerEl => trackerEl === grocery))

    const handleDragEnd = (result: DropResult) => {
        console.log(result.source.index, result.destination?.index)
    }

    const getItemStyle = useCallback(
        (isDragging: boolean, draggableStyle?: DraggingStyle | NotDraggingStyle) => ({
            // styles we need to apply on draggables
            ...draggableStyle,

            ...(isDragging && {
                background:
                    theme.palette.type === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)',
            }),
        }),
        [theme.palette.type]
    )

    return (
        <>
            <EntryGridContainer>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {[...shoppingList.entries()].map(([recipeName, groceries]) => (
                            <Grid item {...gridBreakpointProps} key={recipeName}>
                                <StyledCard
                                    header={recipeName}
                                    action={
                                        <>
                                            {recipeName !== 'Sonstiges' && (
                                                <RecipeDetailsButton name={recipeName} />
                                            )}
                                            <Tooltip
                                                title={`${recipeName} von Einkaufsliste entfernen`}>
                                                <IconButton onClick={handleRemove(recipeName)}>
                                                    <CartOff />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }>
                                    <div
                                        className={clsx(
                                            recipeName === 'Sonstiges' && classes.sonstigesRoot
                                        )}>
                                        <DragDropContext onDragEnd={handleDragEnd}>
                                            <Droppable droppableId="shoppingListDroppable">
                                                {(provided, snapshot) => (
                                                    <List
                                                        innerRef={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver
                                                        )}>
                                                        {groceries?.list.map((grocery, index) => (
                                                            <Draggable
                                                                key={grocery}
                                                                draggableId={grocery}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    <ListItem
                                                                        innerRef={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={getItemStyle(
                                                                            snapshot.isDragging,
                                                                            provided.draggableProps
                                                                                .style
                                                                        )}>
                                                                        <ListItemIcon>
                                                                            <Checkbox
                                                                                checked={listItemChecked(
                                                                                    recipeName,
                                                                                    grocery
                                                                                )}
                                                                                onChange={handleCheckboxChange(
                                                                                    recipeName,
                                                                                    grocery
                                                                                )}
                                                                                edge="start"
                                                                            />
                                                                        </ListItemIcon>
                                                                        <ListItemText
                                                                            classes={{
                                                                                primary: clsx(
                                                                                    listItemChecked(
                                                                                        recipeName,
                                                                                        grocery
                                                                                    ) &&
                                                                                        classes.checked
                                                                                ),
                                                                            }}
                                                                            primary={grocery}
                                                                        />
                                                                    </ListItem>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </List>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                        {recipeName === 'Sonstiges' && (
                                            <form onSubmit={handleFormSubmit}>
                                                <TextField
                                                    value={textFieldValue}
                                                    onChange={e =>
                                                        setTextFieldValue(e.target.value)
                                                    }
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Ergänzen"
                                                />
                                            </form>
                                        )}
                                    </div>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                    <NotFound visible={shoppingList.size === 0} />
                </Grid>
            </EntryGridContainer>

            <FabContainer in={!shoppingList.get('Sonstiges')}>
                <Tooltip title="Liste ergänzen" placement="left">
                    <Fab
                        onClick={() => shoppingListDocRef.doc('Sonstiges').set({ list: [] })}
                        color="secondary">
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </FabContainer>
        </>
    )
}

export default AccountUserShoppingList
