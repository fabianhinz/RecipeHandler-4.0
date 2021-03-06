import {
    Checkbox,
    Fade,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    TextField,
    useTheme,
} from '@material-ui/core'
import { Clear, DeleteSweep } from '@material-ui/icons'
import clsx from 'clsx'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecipeChip from '../Recipe/RecipeChip'
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
    const [recipeRefs, setRecipeRefs] = useState<Set<string>>(new Set())

    const theme = useTheme()
    const classes = useStyles()

    const { shoppingList, shoppingListRef, reorderShoppingList } = useFirebaseAuthContext()

    useDocumentTitle(`Einkaufsliste (${shoppingList.filter(item => !item.checked).length})`)

    useLayoutEffect(() => {
        setRecipeRefs(
            new Set(
                shoppingList
                    .map(item => item.recipeNameRef)
                    .filter(Boolean)
                    .sort() as string[]
            )
        )
    }, [shoppingList])

    const handleCheckboxChange = (index: number) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        const list = [...shoppingList]
        list[index].checked = checked
        shoppingListRef.current?.set({ list })
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!textFieldValue.trim()) return

        const list = [
            {
                checked: false,
                value: textFieldValue,
            },
            ...shoppingList,
        ]
        shoppingListRef.current?.set({ list })

        setTextFieldValue('')
    }

    const handleDelete = (index: number) => () => {
        shoppingListRef.current?.set({
            list: shoppingList.filter((_, itemIndex) => itemIndex !== index),
        })
    }

    const handleDeleteAll = () => {
        shoppingListRef.current?.set({ list: [] })
    }

    const handleDragEnd = (result: DropResult) => {
        if (result.destination === undefined) return
        reorderShoppingList({
            array: shoppingList,
            from: result.source.index,
            to: result.destination.index,
        })
    }

    const getItemStyle = useCallback(
        (isDragging: boolean, draggableStyle?: DraggingStyle | NotDraggingStyle) => ({
            ...draggableStyle,
            ...(isDragging &&
                ({
                    background: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[4],
                } as React.CSSProperties)),
        }),
        [theme.palette.background.default, theme.shadows, theme.shape.borderRadius]
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
                        label="Liste ergänzen"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleDeleteAll} size="small">
                                        <DeleteSweep />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
            </Grid>

            {recipeRefs.size > 0 && (
                <Grid item xs={12}>
                    <Grid style={{ overflowX: 'auto' }} wrap="nowrap" container spacing={1}>
                        {[...recipeRefs.values()].map(recipeRef => (
                            <Grid item key={recipeRef}>
                                <RecipeChip recipeName={recipeRef} />
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
                                        key={`${index}-${item.value}`}
                                        draggableId={`${index}-${item.value}`}
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
                                                        onChange={handleCheckboxChange(index)}
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
                                                <Fade in={!snapshot.isDragging}>
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            onClick={handleDelete(index)}
                                                            size="small">
                                                            <Clear />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </Fade>
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
