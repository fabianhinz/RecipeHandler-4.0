import { makeStyles, Zoom, ZoomProps } from '@material-ui/core'
import React, { ReactNode } from 'react'

const useStyles = makeStyles(theme => ({
    container: {
        zIndex: theme.zIndex.drawer + 1,
        position: 'fixed',
        width: 95,
        display: 'flex',
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        bottom: `env(safe-area-inset-bottom)`,
        right: 0,
    },
}))

interface Props extends Pick<ZoomProps, 'in'> {
    children: ReactNode
}

const FabContainer = ({ children, in: zoomin }: Props) => {
    const classes = useStyles()

    return (
        <Zoom in={zoomin === undefined ? true : zoomin}>
            <div className={classes.container}>{children}</div>
        </Zoom>
    )
}

export default FabContainer
