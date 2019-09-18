import LinkIcon from "@material-ui/icons/LinkTwoTone";
import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    Typography
} from "@material-ui/core";

export const HomeRecentlyAdded = () => {
    return (
        <Box margin={2}>
            <Card>
                <CardHeader title="Zuletzt hinzugefügt" />
                <CardContent>
                    <Grid container spacing={2}>
                        {["Pfannkuche", "Kekse"].map(category => (
                            <Grid item key={category}>
                                <Chip
                                    onClick={() => alert("TBD")}
                                    avatar={
                                        <Avatar>
                                            <LinkIcon />
                                        </Avatar>
                                    }
                                    label={<Typography variant="subtitle2">{category}</Typography>}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
