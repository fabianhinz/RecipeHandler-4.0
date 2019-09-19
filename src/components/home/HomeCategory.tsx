import EditIcon from "@material-ui/icons/EditTwoTone";
import React, { useState } from "react";
import { Box, Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import { CategoryDialog } from "../Category/CategoryDialog";
import { CategoryWrapper } from "../Category/CategoryWrapper";
import { RecipeCategories } from "../../model/model";

export const HomeCategory = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [categories, setCategories] = useState<RecipeCategories>({ a: true, b: false });

    const handleCategoryChange = (key: string) => {
        setCategories(previous => ({ ...previous, [key]: !previous[key] }));
    };

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
                            variant="changeableCategory"
                            categories={categories}
                            onCategoryChange={handleCategoryChange}
                        />
                    </CardContent>
                </Card>
            </Box>

            <CategoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};
