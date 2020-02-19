import {
    Card,
    CardContent,
    createStyles,
    makeStyles,
    SvgIconProps,
    Typography,
} from '@material-ui/core'
import React from 'react'

interface StyleProps {
    action?: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            padding: theme.spacing(1.5),
            paddingLeft: (props: StyleProps) =>
                props.action ? theme.spacing(6) : theme.spacing(3),
            paddingRight: (props: StyleProps) =>
                props.action ? theme.spacing(6) : theme.spacing(3),
            boxShadow: theme.shadows[4],
            maxHeight: 55,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
        },
        backgroundIcon: {
            color:
                theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            bottom: theme.spacing(1),
            right: theme.spacing(1),
            fontSize: '10rem',
        },
        action: {
            position: 'absolute',
            display: 'flex',
            right: theme.spacing(0.5),
            '& > *': {
                color: theme.palette.getContrastText(theme.palette.primary.main),
            },
        },
        cardContent: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            position: 'relative',
        },
    })
)

interface Props {
    header?: React.ReactNode
    action?: React.ReactNode
    children: React.ReactNode
    BackgroundIcon?: (props: SvgIconProps) => JSX.Element
}

const StyledCard = ({ header, children, BackgroundIcon, action }: Props) => {
    const classes = useStyles({ action: Boolean(action) })

    return (
        <Card className={classes.root}>
            {header && (
                <div className={classes.header}>
                    <div className={classes.action}>{action}</div>
                    <Typography noWrap variant="h5">
                        {header}
                    </Typography>
                </div>
            )}
            <CardContent className={classes.cardContent}>{children}</CardContent>
            {BackgroundIcon && <BackgroundIcon className={classes.backgroundIcon} />}
        </Card>
    )
}

export default StyledCard
