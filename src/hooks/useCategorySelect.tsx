import { useState } from 'react'

import { AttachmentMetadata, Recipe } from '../model/model'
import ConfigService from '../services/configService'

export const useCategorySelect = (recipe?: Recipe<AttachmentMetadata> | null) => {
    const [state, setState] = useState<Map<string, string>>(() => {
        if (!recipe || !recipe.categories) return ConfigService.selectedCategories
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

            if (!recipe) ConfigService.selectedCategories = newState
            return newState
        })
    }

    return {
        selectedCategories: state,
        setSelectedCategories: handleChange,
    }
}
