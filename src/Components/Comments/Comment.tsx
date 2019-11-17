import { Box, createStyles, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import ThumbDownIcon from '@material-ui/icons/ThumbDownRounded'
import ThumbUpIcon from '@material-ui/icons/ThumbUpRounded'
import React, { FC } from 'react'

import { Comment as CommentModel } from '../../model/model'
import { CommentsCollections, RecipeDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS_HUGE } from '../../theme'
import { BadgeWrapper } from '../Shared/BadgeWrapper'

const useStyles = makeStyles(theme =>
    createStyles({
        comment: {
            cursor: 'auto',
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1),
            borderRadius: BORDER_RADIUS_HUGE,
            marginBottom: theme.spacing(0.5),
        },
    })
)

interface CommentProps extends Pick<RecipeDocument, 'name'>, CommentsCollections {
    comment: CommentModel
}

export const Comment: FC<CommentProps> = ({ comment, name, collection }) => {
    const classes = useStyles()

    const handleThumbClick = (
        documentId: string,
        type: keyof Pick<CommentModel, 'dislikes' | 'likes'>
    ) => () => {
        FirebaseService.firestore
            .collection(collection)
            .doc(name)
            .collection('comments')
            .doc(documentId)
            .update({ [type]: FirebaseService.incrementBy(1) })
    }

    return (
        <Grid item>
            <div className={classes.comment}>
                <Typography variant="caption">
                    {FirebaseService.createDateFromTimestamp(comment.createdDate).toLocaleString()}
                </Typography>
                <Typography>{comment.comment}</Typography>
            </div>

            <Box marginBottom={1} display="flex" justifyContent="flex-end">
                <IconButton onClick={handleThumbClick(comment.documentId, 'likes')}>
                    <BadgeWrapper
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={comment.likes}>
                        <ThumbUpIcon />
                    </BadgeWrapper>
                </IconButton>
                <IconButton onClick={handleThumbClick(comment.documentId, 'dislikes')}>
                    <BadgeWrapper
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={comment.dislikes}>
                        <ThumbDownIcon />
                    </BadgeWrapper>
                </IconButton>
            </Box>
        </Grid>
    )
}
