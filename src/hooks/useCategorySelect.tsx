import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { PATHS } from '../Components/Routes/Routes'
import { Recipe } from '../model/model'
import ConfigService from '../services/configService'

export const useCategorySelect = (recipe?: Recipe | null) => {
    const match = useRouteMatch()

    const [state, setState] = useState<Map<string, string>>(() => {
        if (match.path === PATHS.home) return ConfigService.selectedCategories
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

            if (match.path === PATHS.home) ConfigService.selectedCategories = newState
            return newState
        })
    }

    return {
        selectedCategories: state,
        setSelectedCategories: handleChange,
    }
}
