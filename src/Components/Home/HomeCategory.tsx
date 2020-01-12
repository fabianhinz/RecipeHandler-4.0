import React, { FC } from 'react'

import CategoryWrapper from '../Category/CategoryWrapper'

interface HomeCategoryProps {
    selectedCategories: Map<string, string>
    onCategoryChange: (type: string, value: string) => void
}

export const HomeCategory: FC<HomeCategoryProps> = ({ onCategoryChange, selectedCategories }) => (
    <CategoryWrapper selectedCategories={selectedCategories} onCategoryChange={onCategoryChange} />
)
