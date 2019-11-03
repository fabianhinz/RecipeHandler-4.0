import { ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import Highlighter from 'react-highlight-words'

import { Hit } from '../../../model/model'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'

const getHighlightedDescription = (description: string) => {
    const descriptionArray = description.split(/1\.|- |\*{1,}|#{1,}/gi)
    const displayResults: Array<string> = []
    const displayResultsNice: Array<string> = []

    descriptionArray.forEach(step => {
        if (step.indexOf('<em>') !== -1) {
            displayResults.push('...')
            displayResults.push(step)
        }
    })

    displayResults.forEach(recipeFragment => {
        displayResultsNice.push(recipeFragment.replace(/<\/?em>/gi, ''))
    })

    return displayResultsNice
}

const getHighlightedIngredients = (ingredients: string) => {
    const ingredientsArray = ingredients.split('- ')

    const displayResults: Array<string> = []
    const displayResultsNice: Array<string> = []

    ingredientsArray.forEach(ingredient => {
        if (ingredient.indexOf('<em>') !== -1) {
            displayResults.push('...')
            displayResults.push(ingredient)
        }
    })

    displayResults.forEach(recipeFragment => {
        displayResultsNice.push(recipeFragment.replace(/<\/?em>/gi, ''))
    })

    return displayResultsNice
}

interface Props {
    recipeHit: Hit
    debouncedSearchValue: string
}

export const HomeSearchHit = ({ recipeHit, debouncedSearchValue }: Props) => {
    const { history } = useRouterContext()

    return (
        <ListItem
            button
            onClick={() => history.push(PATHS.details(recipeHit.name))}
            key={recipeHit.name}>
            <ListItemText
                primary={recipeHit.name}
                secondary={
                    <>
                        <b>Zutaten:</b>{' '}
                        {getHighlightedIngredients(
                            recipeHit._highlightResult.ingredients.value
                        ).map((recipeFragment, index) => (
                            <Highlighter
                                searchWords={[debouncedSearchValue]}
                                textToHighlight={recipeFragment}
                                key={index}
                            />
                        ))}
                        <br />
                        <b>Beschreibung:</b>{' '}
                        {getHighlightedDescription(
                            recipeHit._highlightResult.description.value
                        ).map((recipeFragment, index) => (
                            <Highlighter
                                searchWords={[debouncedSearchValue]}
                                textToHighlight={recipeFragment}
                                key={index}
                            />
                        ))}
                    </>
                }
            />
        </ListItem>
    )
}
