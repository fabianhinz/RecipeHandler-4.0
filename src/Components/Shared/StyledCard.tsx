import { Card, CardContent, createStyles, Fade, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import { BORDER_RADIUS_HUGE } from '../../theme'
import { RecipeVariants } from '../Recipe/Result/Action/RecipeResultAction'

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
        pinnedHeader: {
            boxShadow: theme.shadows[1],
            borderRadius: BORDER_RADIUS_HUGE,
        },
        pinnedContent: {
            padding: 0,
            paddingTop: 16,
        },
    })
)

interface Props extends Partial<RecipeVariants> {
    header?: React.ReactNode
    content: React.ReactNode
}

const StyledCard = ({ variant, header, content }: Props) => {
    const classes = useStyles()
    const pinned = variant === 'pinned'

    return (
        <Fade in>
            <Card className={classes.root} elevation={pinned ? 0 : 1}>
                {header && (
                    <div className={clsx(classes.header, pinned && classes.pinnedHeader)}>
                        {header}
                    </div>
                )}
                <CardContent className={clsx(pinned && classes.pinnedContent)}>
                    {content}
                </CardContent>
            </Card>
        </Fade>
    )
}

export default StyledCard
