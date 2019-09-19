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
import { useRouter } from "../Routes/RouterContext";
import { PATHS } from "../Routes/Routes";

interface HomeRecentlyAddedProps {
    recipes: Array<Recipe<AttachementMetadata>>;
}

export const HomeRecentlyAdded: FC<HomeRecentlyAddedProps> = ({ recipes }) => {
    const { history } = useRouter();

    return (
        <Box margin={2}>
            <Card>
                <CardHeader title="Zuletzt hinzugefügt" />
                <CardContent>
                    <Grid container spacing={2}>
                        {recipes.map(recipe => (
                            <Grid item key={recipe.name}>
                                <Chip
                                    onClick={() =>
                                        history.push(PATHS.details(recipe.name), { recipe })
                                    }
                                    avatar={
                                        <Avatar>
                                            <LinkIcon />
                                        </Avatar>
                                    }
                                    label={
                                        <Typography variant="subtitle2">{recipe.name}</Typography>
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
