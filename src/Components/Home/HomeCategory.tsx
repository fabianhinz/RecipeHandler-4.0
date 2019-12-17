import { Box } from '@material-ui/core'
import React, { FC } from 'react'

import CategoryWrapper from '../Category/CategoryWrapper'

interface HomeCategoryProps {
    selectedCategories: Map<string, string>
    onCategoryChange: (type: string, value: string) => void
}

export const HomeCategory: FC<HomeCategoryProps> = ({ onCategoryChange, selectedCategories }) => (
    <Box marginBottom={2} paddingBottom={1}>
        <CategoryWrapper
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
        />
    </Box>
)
