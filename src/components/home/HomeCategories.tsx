import EditIcon from "@material-ui/icons/EditTwoTone";
import React, { FC, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    IconButton
    } from "@material-ui/core";
import { Categories } from "../category/Categories";
import { CategoriesDialog } from "../category/CategoriesDialog";

export const HomeCategories: FC = () => {
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
                        <Categories />
                    </CardContent>
                </Card>
            </Box>

            <CategoriesDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </>
    );
};
