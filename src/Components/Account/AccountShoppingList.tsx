import {
    Checkbox,
    Chip,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    TextField,
    useTheme,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { DocumentId, ShoppingListItem, ShoppingListWithId } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'

const useStyles = makeStyles(() => ({
    checked: {
        textDecoration: 'line-through',
    },

    listSubHeader: {
        fontSize: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
    },
}))

const AccountUserShoppingList = () => {
    const [textFieldValue, setTextFieldValue] = useState('')
    const theme = useTheme()
    const classes = useStyles()
    const [shoppingList, setShoppingList] = useState<ShoppingListWithId>([])
    const [recipeRefs, setRecipeRefs] = useState<Set<string>>(new Set())
    const { activeItemsInShoppingList } = useFirebaseAuthContext()

    const { user } = useFirebaseAuthContext()

    useDocumentTitle(`Einkaufsliste (${activeItemsInShoppingList})`)

    const shoppingListCollection = useMemo(() => {
        if (!user) return

        return FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .collection('shoppingList')
    }, [user])

    useEffect(
        () =>
            shoppingListCollection?.onSnapshot(snapshot => {
                const newShoppingList = snapshot.docs.map(doc => ({
                    documentId: doc.id,
                    ...(doc.data() as ShoppingListItem),
                }))
                setShoppingList(newShoppingList)
                setRecipeRefs(
                    new Set(
                        newShoppingList.map(item => item.recipeNameRef).filter(Boolean) as string[]
                    )
                )
            }),
        [shoppingListCollection]
    )

    const handleCheckboxChange = (documentId: DocumentId) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        shoppingListCollection?.doc(documentId).set({ checked }, { merge: true })
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newListItem: ShoppingListItem = { checked: false, value: textFieldValue }
        shoppingListCollection?.add(newListItem)
        setTextFieldValue('')
    }

    const handleDelete = (documentId: DocumentId) => () => {
        shoppingListCollection?.doc(documentId).delete()
    }

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
        <EntryGridContainer>
            <Grid item xs={12}>
                <form onSubmit={handleFormSubmit}>
                    <TextField
                        value={textFieldValue}
                        onChange={e => setTextFieldValue(e.target.value)}
                        variant="outlined"
                        fullWidth
                        placeholder="Liste ergänzen"
                    />
                </form>
            </Grid>
            {recipeRefs.size > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        {[...recipeRefs.values()].map(recipeRef => (
                            <Grid item key={recipeRef}>
                                <Chip label={recipeRef} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}
            <Grid item xs={12}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="shoppingListDroppable">
                        {provided => (
                            <List disablePadding innerRef={provided.innerRef}>
                                {shoppingList.map((item, index) => (
                                    <Draggable
                                        key={item.documentId}
                                        draggableId={item.documentId}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                innerRef={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={item.checked}
                                                        onChange={handleCheckboxChange(
                                                            item.documentId
                                                        )}
                                                        edge="start"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    classes={{
                                                        primary: clsx(
                                                            item.checked && classes.checked
                                                        ),
                                                    }}
                                                    primary={item.value}
                                                    secondary={item.recipeNameRef}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        onClick={handleDelete(item.documentId)}
                                                        size="small">
                                                        <Clear />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>

                <NotFound visible={shoppingList.length === 0} />
            </Grid>
        </EntryGridContainer>
    )
}

export default AccountUserShoppingList
