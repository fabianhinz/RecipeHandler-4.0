import { Box, Typography } from '@material-ui/core'
import React, { FC } from 'react'

interface SubtitleProps {
    icon?: JSX.Element
    text: React.ReactNode
}

export const Subtitle: FC<SubtitleProps> = ({ icon, text, children }) => (
    <Box paddingBottom={1} paddingTop={1} display="flex" alignItems="center">
        {icon}
        <Box marginRight={1} />
        <Typography variant="h5">{text}</Typography>
        <Box marginRight={1} />
        {children && children}
    </Box>
)
