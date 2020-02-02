import {
    Card,
    CardActions,
    CardContent,
    createStyles,
    Fade,
    makeStyles,
    SvgIconProps,
    Typography,
} from '@material-ui/core'
import React from 'react'

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
            boxShadow: theme.shadows[4],
            maxHeight: 55,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardContent: {
            zIndex: 1,
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        backgroundIcon: {
            color:
                theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            bottom: theme.spacing(1),
            right: theme.spacing(1),
            fontSize: '10rem',
        },
    })
)
interface Props {
    header?: React.ReactNode
    children: React.ReactNode
    BackgroundIcon?: (props: SvgIconProps) => JSX.Element
}

const StyledCard = ({ header, children, BackgroundIcon }: Props) => {
    const classes = useStyles()

    return (
        <Fade in>
            <Card className={classes.root}>
                {header && (
                    <div className={classes.header}>
                        <Typography noWrap variant="h5">
                            {header}
                        </Typography>
                    </div>
                )}
                <CardContent className={classes.cardContent}>{children}</CardContent>
                {BackgroundIcon && <BackgroundIcon className={classes.backgroundIcon} />}
            </Card>
        </Fade>
    )
}

export default StyledCard
