import React, { FC } from "react";
import { Box, Grid, Typography } from "@material-ui/core";

interface SubtitleProps {
    icon?: JSX.Element;
    text: string;
}

export const Subtitle: FC<SubtitleProps> = ({ icon, text }) => (
    <Box marginTop={1} marginBottom={1}>
        <Grid container spacing={1} alignItems="flex-end">
            {icon && <Grid item>{icon}</Grid>}
            <Grid item>
                <Typography variant="h6">{text}</Typography>
            </Grid>
        </Grid>
    </Box>
);
