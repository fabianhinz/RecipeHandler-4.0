import { ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import Highlighter from 'react-highlight-words'

import { Hit } from '../../model/model'
import { useRouterContext } from '../Provider/RouterProvider'
import { PATHS } from '../Routes/Routes'

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
    result: Hit
    searchValue: string
}

const SearchResult = ({ result, searchValue }: Props) => {
    const { history } = useRouterContext()

    const handleListItemClick = () => {
        history.push(PATHS.details(result.name))
    }

    return (
        <ListItem button onClick={handleListItemClick} key={result.name}>
            <ListItemText
                primary={result.name}
                secondary={
                    <>
                        <b>Zutaten:</b>{' '}
                        {getHighlightedIngredients(result._highlightResult.ingredients.value).map(
                            (recipeFragment, index) => (
                                <Highlighter
                                    searchWords={[searchValue]}
                                    textToHighlight={recipeFragment}
                                    key={index}
                                />
                            )
                        )}
                        <br />
                        <b>Beschreibung:</b>{' '}
                        {getHighlightedDescription(result._highlightResult.description.value).map(
                            (recipeFragment, index) => (
                                <Highlighter
                                    searchWords={[searchValue]}
                                    textToHighlight={recipeFragment}
                                    key={index}
                                />
                            )
                        )}
                    </>
                }
            />
        </ListItem>
    )
}

export default SearchResult
