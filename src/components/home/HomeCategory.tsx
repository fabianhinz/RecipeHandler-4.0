import React, { FC } from "react";
import { Box, Card, CardContent, CardHeader } from "@material-ui/core";
import { CategoryWrapper } from "../Category/CategoryWrapper";

interface HomeCategoryProps {
    selectedCategories: Map<string, string>;
    onCategoryChange: (type: string, value: string) => void;
}

export const HomeCategory: FC<HomeCategoryProps> = ({ onCategoryChange, selectedCategories }) => (
    <Box margin={2}>
        <Card>
            <CardHeader title="Kategorien" />
            <CardContent>
                <CategoryWrapper
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                />
            </CardContent>
        </Card>
    </Box>
);
