import EditIcon from "@material-ui/icons/EditTwoTone";
import React, { useState, FC } from "react";
import { Box, Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import { CategoryDialog } from "../Category/CategoryDialog";
import { CategoryWrapper } from "../Category/CategoryWrapper";

interface HomeCategoryProps {
    selectedCategories: Map<string, string>;
    onCategoryChange: (type: string, value: string) => void;
}

export const HomeCategory: FC<HomeCategoryProps> = ({ onCategoryChange, selectedCategories }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Box margin={2}>
                <Card>
                    <CardHeader
                        title="Kategorien"
                        action={
                            <IconButton onClick={() => setDialogOpen(true)}>
                                <EditIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <CategoryWrapper
                            selectedCategories={selectedCategories}
                            onCategoryChange={onCategoryChange}
                        />
                    </CardContent>
                </Card>
            </Box>

            <CategoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};
