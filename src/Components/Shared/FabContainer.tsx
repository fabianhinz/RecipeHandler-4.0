import { createStyles, makeStyles, Zoom } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            width: 95,
            display: 'flex',
            padding: theme.spacing(2),
            justifyContent: 'center',
            alignItems: 'center',
            left: 0,
            bottom: `env(safe-area-inset-bottom)`,
        },
    })
)

const FabContainer: FC = ({ children }) => {
    const classes = useStyles()

    return (
        <Zoom in>
            <div className={classes.container}>{children}</div>
        </Zoom>
    )
}

export default FabContainer
