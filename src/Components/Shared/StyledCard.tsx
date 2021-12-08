import {
    Card,
    CardContent,
    Fab,
    makeStyles,
    SvgIconProps,
    Theme,
    Typography,
} from '@material-ui/core'
import { UnfoldLessHorizontal, UnfoldMoreHorizontal } from 'mdi-material-ui'
import React, { useState } from 'react'

const useStyles = makeStyles<Theme, { expanded: boolean }>(theme => ({
    root: {
        height: props => (props.expanded ? '100%' : 300),
        position: 'relative',
    },
    header: {
        padding: theme.spacing(1.5),
        paddingBottom: 0,
        maxHeight: 43,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backgroundIcon: {
        color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        fontSize: '10rem',
    },
    action: {
        display: 'flex',
    },
    cardContent: {
        zIndex: 1,
        position: 'relative',
        minHeight: 'calc(10rem + 16px)',
    },
    expandContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: theme.spacing(2),
    },
    expandBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        zIndex: props => (props.expanded ? -1 : 2),
        opacity: props => (props.expanded ? 0 : 1),
        transition: theme.transitions.create('opacity'),
        background:
            theme.palette.type === 'dark'
                ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
                : 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(0,0,0,0))',
    },
    expandFab: props => {
        if (props.expanded)
            return {
                boxShadow: theme.shadows[0],
                position: 'initial',
                zIndex: 1,
            }

        return {
            boxShadow: theme.shadows[0],
            position: 'absolute',
            bottom: theme.spacing(2),
            left: '50%',
            transform: 'translate(-50%)',
            zIndex: 2,
        }
    },
}))

interface Props {
    header?: React.ReactNode
    action?: React.ReactNode
    children: React.ReactNode
    BackgroundIcon?: (props: SvgIconProps) => JSX.Element
    expandable?: true
}

const StyledCard = (props: Props) => {
    const [expanded, setExpanded] = useState(props.expandable ? false : true)
    const classes = useStyles({ expanded })

    return (
        <Card className={classes.root}>
            {props.header && (
                <div className={classes.header}>
                    <Typography noWrap variant="h5">
                        {props.header}
                    </Typography>
                    {props.action && <div className={classes.action}>{props.action}</div>}
                </div>
            )}
            <CardContent className={classes.cardContent}>{props.children}</CardContent>
            {props.expandable && (
                <div className={classes.expandContainer}>
                    <div className={classes.expandBackground} />
                    <Fab
                        size="small"
                        className={classes.expandFab}
                        onClick={() => setExpanded(prev => !prev)}>
                        {expanded ? <UnfoldLessHorizontal /> : <UnfoldMoreHorizontal />}
                    </Fab>
                </div>
            )}
            {props.BackgroundIcon && <props.BackgroundIcon className={classes.backgroundIcon} />}
        </Card>
    )
}

export default StyledCard
