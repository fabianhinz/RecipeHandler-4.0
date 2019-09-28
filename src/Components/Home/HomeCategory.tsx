import React, { FC } from "react";
import { Box, Card, CardContent } from "@material-ui/core";
import CategoryWrapper from "../Category/CategoryWrapper";

interface HomeCategoryProps {
    selectedCategories: Map<string, string>;
    onCategoryChange: (type: string, value: string) => void;
}

export const HomeCategory: FC<HomeCategoryProps> = ({ onCategoryChange, selectedCategories }) => (
    <Box marginBottom={2}>
        <Card>
            <CardContent>
                <CategoryWrapper
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                />
            </CardContent>
        </Card>
    </Box>
);
