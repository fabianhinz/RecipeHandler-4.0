import { Fab, IconButton, Tooltip } from '@material-ui/core'
import CommentIcon from '@material-ui/icons/Comment'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { CommentsCollections, CommentsDocument } from '../../model/model'
import { BadgeWrapper } from '../Shared/BadgeWrapper'
import { CommentsDialog } from './CommentsDialog'

export const Comments: FC<CommentsDocument & CommentsCollections & { highContrast?: boolean }> = ({
  name,
  numberOfComments,
  collection,
  highContrast,
}) => {
  const [drawer, setDrawer] = useState(false)

  const handleDrawerChange = useCallback(() => setDrawer(previous => !previous), [])

  const badgeComment = useMemo(
    () => (
      <BadgeWrapper badgeContent={numberOfComments}>
        <CommentIcon />
      </BadgeWrapper>
    ),
    [numberOfComments]
  )

  return (
    <>
      <Tooltip title="Kommentare">
        {highContrast ? (
          <Fab size="small" onClick={handleDrawerChange}>
            {badgeComment}
          </Fab>
        ) : (
          <IconButton onClick={handleDrawerChange}>{badgeComment}</IconButton>
        )}
      </Tooltip>

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
