import { Grid, IconButton, InputAdornment, List, TextField } from '@material-ui/core'
import { DeleteSweep } from '@material-ui/icons'
import React, { useLayoutEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import RecipeChip from '../Recipe/RecipeChip'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import AccountShoppingListItem from './AccountShoppingListItem'

const AccountUserShoppingList = () => {
    const [textFieldValue, setTextFieldValue] = useState('')
    const [recipeRefs, setRecipeRefs] = useState<Set<string>>(new Set())

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

    const handleCheckboxChange = (index: number) => (
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
                                    <AccountShoppingListItem
                                        key={`${index}-${item.value}`}
                                        onCheckboxChange={handleCheckboxChange}
                                        onDelete={handleDelete}
                                        item={item}
                                        index={index}
                                    />
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
