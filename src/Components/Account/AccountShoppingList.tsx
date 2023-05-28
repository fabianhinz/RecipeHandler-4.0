import { Grid, List } from '@mui/material'
import { setDoc } from 'firebase/firestore'
import React, { useLayoutEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import RecipeChip from '@/Components/Recipe/RecipeChip'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import NotFound from '@/Components/Shared/NotFound'
import useDocumentTitle from '@/hooks/useDocumentTitle'

import AccountShoppingListInput from './AccountShoppingListInput'
import AccountShoppingListItem from './AccountShoppingListItem'

const AccountUserShoppingList = () => {
  const [recipeRefs, setRecipeRefs] = useState<Set<string>>(new Set())
  const [tagFilter, setTagFilter] = useState<string | undefined>()

  const { shoppingList, reorderShoppingList, shoppingListRef } =
    useFirebaseAuthContext()

  useDocumentTitle(
    `Einkaufsliste (${shoppingList.filter(item => !item.checked).length})`
  )

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

  const handleCheckboxChange = (index: number) => {
    return async (
      _event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
    ) => {
      const list = [...shoppingList]
      list[index].checked = checked

      if (shoppingListRef.current) {
        await setDoc(shoppingListRef.current, { list })
      }
    }
  }

  const handleDelete = (index: number) => {
    return async () => {
      if (!shoppingListRef.current) {
        throw new Error('cannot set shoppinglist without a document reference')
      }

      await setDoc(shoppingListRef.current, {
        list: shoppingList.filter((_, itemIndex) => itemIndex !== index),
      })
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return
    }
    await reorderShoppingList({
      array: shoppingList,
      from: result.source.index,
      to: result.destination.index,
    })
  }

  return (
    <EntryGridContainer>
      <Grid item xs={12}>
        <AccountShoppingListInput
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
        />
      </Grid>

      {recipeRefs.size > 0 && (
        <Grid item xs={12}>
          <Grid
            style={{ overflowX: 'auto' }}
            wrap="nowrap"
            container
            spacing={1}>
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
                    tagFilter={tagFilter}
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
