import { Box, Typography } from '@material-ui/core'
import React, { FC } from 'react'

interface SubtitleProps {
    noMargin?: boolean
    icon?: JSX.Element
    text: React.ReactNode
}

export const Subtitle: FC<SubtitleProps> = ({ icon, text, children, noMargin }) => (
    <Box
        marginTop={noMargin ? 0 : 2}
        paddingBottom={1}
        paddingTop={1}
        display="flex"
        alignItems="center">
        {icon}
        <Box marginRight={1} />
        <Typography variant="h5">{text}</Typography>
        <Box marginRight={1} />
        {children && children}
    </Box>
)
