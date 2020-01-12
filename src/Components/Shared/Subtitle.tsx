import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import React, { FC } from 'react'

interface SubtitleProps {
    icon?: JSX.Element
    text: React.ReactNode
}

const useStyles = makeStyles(theme =>
    createStyles({
        iconGridItem: {
            display: 'flex',
        },
        h5: {
            lineHeight: 1,
        },
    })
)

export const Subtitle: FC<SubtitleProps> = ({ icon, text, children }) => {
    const classes = useStyles()

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid className={classes.iconGridItem} item xs="auto">
                {icon}
            </Grid>
            <Grid item xs="auto">
                <Typography classes={{ h5: classes.h5 }} variant="h5">
                    {text}
                </Typography>
            </Grid>

            {children && <Grid item>{children}</Grid>}
        </Grid>
    )
}
