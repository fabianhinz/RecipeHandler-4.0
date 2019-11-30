import { useState } from 'react'

import { AttachmentMetadata, Recipe } from '../model/model'

export const useCategorySelect = (recipe?: Recipe<AttachmentMetadata> | null) => {
    const [state, setState] = useState<Map<string, string>>(() => {
        if (!recipe || !recipe.categories) return new Map()
        return new Map(Object.keys(recipe.categories).map(type => [type, recipe.categories[type]]))
    })

    const handleChange = (type: string, value: string) => {
        setState(previous => {
            if (previous.get(type) === value) {
                previous.delete(type)
                return new Map(previous)
            } else {
                return new Map(previous.set(type, value))
            }
        })
    }

    return {
        selectedCategories: state,
        setSelectedCategories: handleChange,
    }
}
