import {
    Card,
    CardContent,
    createStyles,
    makeStyles,
    SvgIconProps,
    Typography,
} from '@material-ui/core'
import React from 'react'

type StyleProps = Pick<Props, 'action'>

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            padding: theme.spacing(1.5),
            paddingBottom: 0,
            maxHeight: 43,
            display: 'flex',
            alignItems: 'center',
            justifyContent: ({ action }: StyleProps) => (action ? 'space-between' : 'center'),
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
            display: 'flex',
        },
        cardContent: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            position: 'relative',
            minHeight: 200,
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
    const classes = useStyles({ action })

    return (
        <Card className={classes.root}>
            {header && (
                <div className={classes.header}>
                    <Typography noWrap variant="h5">
                        {header}
                    </Typography>
                    {action && <div className={classes.action}>{action}</div>}
                </div>
            )}
            <CardContent className={classes.cardContent}>{children}</CardContent>
            {BackgroundIcon && <BackgroundIcon className={classes.backgroundIcon} />}
        </Card>
    )
}

export default StyledCard
