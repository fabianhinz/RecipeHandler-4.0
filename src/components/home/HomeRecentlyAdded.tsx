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
import { Recipe, AttachementMetadata } from "../../model/model";

interface HomeRecentlyAddedProps {
    recipes: Array<Recipe<AttachementMetadata>>;
}

export const HomeRecentlyAdded: FC<HomeRecentlyAddedProps> = ({ recipes }) => {
    return (
        <Box margin={2}>
            <Card>
                <CardHeader title="Zuletzt hinzugefügt" />
                <CardContent>
                    <Grid container spacing={2}>
                        {recipes.map(({ name }) => (
                            <Grid item key={name}>
                                <Chip
                                    onClick={() => alert("TBD")}
                                    avatar={
                                        <Avatar>
                                            <LinkIcon />
                                        </Avatar>
                                    }
                                    label={<Typography variant="subtitle2">{name}</Typography>}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
