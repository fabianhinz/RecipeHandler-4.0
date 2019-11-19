import { IconButton } from '@material-ui/core'
import CommentIcon from '@material-ui/icons/CommentTwoTone'
import React, { FC, useState } from 'react'

import { CommentsCollections, CommentsDocument } from '../../model/model'
import { BadgeWrapper } from '../Shared/BadgeWrapper'
import { CommentsDialog } from './CommentsDialog'

export const Comments: FC<CommentsDocument & CommentsCollections> = ({
    name,
    numberOfComments,
    collection,
}) => {
    const [drawer, setDrawer] = useState(false)

    const handleDrawerChange = () => setDrawer(previous => !previous)

    return (
        <>
            <IconButton onClick={handleDrawerChange}>
                <BadgeWrapper badgeContent={numberOfComments}>
                    <CommentIcon />
                </BadgeWrapper>
            </IconButton>

            <CommentsDialog
                collection={collection}
                numberOfComments={numberOfComments}
                name={name}
                open={drawer}
                onClose={handleDrawerChange}
            />
        </>
    )
}
