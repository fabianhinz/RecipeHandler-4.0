import { Card, CardContent, createStyles, Fade, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: '100%',
        },
        header: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            padding: '0px 8px',
            borderRadius: 0,
            boxShadow: theme.shadows[0],
            minHeight: theme.typography.pxToRem(48),
            display: 'flex',
        },
    })
)

interface Props {
    header?: React.ReactNode
    children: React.ReactNode
}

const StyledCard = ({ header, children }: Props) => {
    const classes = useStyles()

    return (
        <Fade in>
            <Card className={classes.root}>
                {header && <div className={classes.header}>{header}</div>}
                <CardContent>{children}</CardContent>
            </Card>
        </Fade>
    )
}

export default StyledCard
