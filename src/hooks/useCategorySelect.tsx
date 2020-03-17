import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { RecipeCreateState } from '../Components/Recipe/Create/RecipeCreateReducer'
import { PATHS } from '../Components/Routes/Routes'
import { Recipe } from '../model/model'
import recipeService from '../services/recipeService'
// ToDo we don't need this hook anymore, merge with categoryselection
export const useCategorySelect = (recipe?: Recipe | RecipeCreateState | null) => {
    const match = useRouteMatch()

    const [state, setState] = useState<Map<string, string>>(() => {
        if (match.path === PATHS.home) return recipeService.selectedCategories
        else if (!recipe) return new Map()

        return new Map(Object.keys(recipe.categories).map(type => [type, recipe.categories[type]]))
    })

    const handleChange = (type: string, value: string) => {
        setState(previous => {
            let newState: Map<string, string>

            if (previous.get(type) === value) {
                previous.delete(type)
                newState = new Map(previous)
            } else {
                newState = new Map(previous.set(type, value))
            }

            if (match.path === PATHS.home) recipeService.selectedCategories = newState
            return newState
        })
    }

    const removeSelectedCategories = () => {
        setState(new Map())
        recipeService.selectedCategories = new Map()
    }

    return {
        selectedCategories: state,
        setSelectedCategories: handleChange,
        removeSelectedCategories,
    }
}
