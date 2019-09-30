import { Box, Grid, Typography } from '@material-ui/core'
import React, { FC } from 'react'

interface SubtitleProps {
    firstChild?: boolean
    icon?: JSX.Element
    text: string
}

export const Subtitle: FC<SubtitleProps> = ({ icon, text, children, firstChild }) => (
    <Box marginTop={firstChild ? 0 : 4} paddingBottom={1} paddingTop={1}>
        <Grid container spacing={1} alignItems="flex-end">
            {icon && <Grid item>{icon}</Grid>}
            <Grid item>
                <Typography variant="h6">{text}</Typography>
            </Grid>
            {children && <Grid item>{children}</Grid>}
        </Grid>
    </Box>
)
