import EditIcon from "@material-ui/icons/EditTwoTone";
import React, { useState } from "react";
import { Box, Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import { CategoryWrapper } from "../Category/CategoryWrapper";
import { CategoryDialog } from "../Category/CategoryDialog";

export const HomeCategory = () => {
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
                        <CategoryWrapper />
                    </CardContent>
                </Card>
            </Box>

            <CategoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};
