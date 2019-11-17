import { Card, CardContent, createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import { RecipeVariants } from './Result/Action/RecipeResultAction'

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: '100%',
            overflowY: 'auto',
            maxHeight: 425,
        },
        rootPinned: {
            maxHeight: 'unset',
        },
        header: {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: '#A5D6A7',
            color: '#000',
            padding: '0px 8px',
        },
        pinnedContent: {
            padding: 0,
            paddingTop: 16,
        },
    })
)

interface Props extends RecipeVariants {
    header: React.ReactNode
    content: React.ReactNode
}

const RecipeCard = ({ variant, header, content }: Props) => {
    const classes = useStyles()
    const pinned = variant === 'pinned'

    return (
        <Card
            className={clsx(classes.root, pinned && classes.rootPinned)}
            elevation={pinned ? 0 : 1}>
            <Card className={classes.header}>{header}</Card>
            <CardContent className={clsx(pinned && classes.pinnedContent)}>{content}</CardContent>
        </Card>
    )
}

export default RecipeCard
