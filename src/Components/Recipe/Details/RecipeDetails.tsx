import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { RecipeResult } from "../Result/RecipeResult";
import { Card, CardContent, Box, Fade } from "@material-ui/core";

const RecipeEdit: FC<RouteComponentProps> = ({ location }) => {
    return (
        <Fade in>
            <Box margin={2}>
                <Card>
                    <CardContent>
                        <RecipeResult recipe={location.state.recipe} />
                    </CardContent>
                </Card>
            </Box>
        </Fade>
    );
};

export default RecipeEdit;
