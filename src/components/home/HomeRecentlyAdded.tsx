import LinkIcon from "@material-ui/icons/LinkTwoTone";
import React, { FC } from "react";
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
import { MOCK_RECIPES } from "../../util/Mock";


export const HomeRecentlyAdded: FC = () => {
    return (
        <Box margin={2}>
            <Card>
                <CardHeader title="Zuletzt hinzugefügt" />
                <CardContent>
                    <Grid container spacing={2}>
                        {MOCK_RECIPES.map(category => (
                            <Grid item key={category}>
                                <Chip
                                    onClick={() => alert("TBD")}
                                    avatar={
                                        <Avatar>
                                            <LinkIcon />
                                        </Avatar>
                                    }
                                    label={
                                        <Typography variant="subtitle2">{category}</Typography>
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
