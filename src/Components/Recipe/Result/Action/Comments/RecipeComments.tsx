import { IconButton } from '@material-ui/core'
import CommentIcon from '@material-ui/icons/CommentTwoTone'
import React, { FC, useState } from 'react'

import { RecipeDocument } from '../../../../../model/model'
import { BadgeWrapper } from '../../../../Shared/BadgeWrapper'
import { RecipeCommentsDrawer } from './RecipeCommentsDrawer'

export const RecipeComments: FC<Pick<RecipeDocument, 'name' | 'numberOfComments'>> = ({
    name,
    numberOfComments,
}) => {
    const [drawer, setDrawer] = useState(false)

    const handleDrawerChange = () => setDrawer(previous => !previous)

    return (
        <div>
            <IconButton onClick={handleDrawerChange}>
                <BadgeWrapper badgeContent={numberOfComments}>
                    <CommentIcon />
                </BadgeWrapper>
            </IconButton>

            <RecipeCommentsDrawer name={name} open={drawer} onClose={handleDrawerChange} />
        </div>
    )
}
