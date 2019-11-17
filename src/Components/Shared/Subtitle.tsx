import { Box, Grid, Typography } from '@material-ui/core'
import React, { FC } from 'react'

interface SubtitleProps {
    noMargin?: boolean
    icon?: JSX.Element
    text: React.ReactNode
}

export const Subtitle: FC<SubtitleProps> = ({ icon, text, children, noMargin }) => (
    <Box marginTop={noMargin ? 0 : 2} paddingBottom={1} paddingTop={1}>
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <Typography variant="h5">{text}</Typography>
            </Grid>
            {children && <Grid item>{children}</Grid>}
        </Grid>
    </Box>
)
