import { Box, createStyles, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import ThumbDownIcon from '@material-ui/icons/ThumbDownRounded'
import ThumbUpIcon from '@material-ui/icons/ThumbUpRounded'
import React, { FC } from 'react'

import { FirebaseService } from '../../../firebase'
import { Comment, RecipeDocument } from '../../../model/model'
import { BadgeWrapper } from '../../Shared/BadgeWrapper'

const useStyles = makeStyles(theme =>
    createStyles({
        comment: {
            cursor: 'auto',
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1),
            borderRadius: 16,
            marginBottom: theme.spacing(0.5),
        },
    })
)

interface RecipeCommentProps extends Pick<RecipeDocument, 'name'> {
    comment: Comment
}

export const RecipeComment: FC<RecipeCommentProps> = ({ comment, name }) => {
    const classes = useStyles()

    const handleThumbClick = (
        documentId: string,
        type: keyof Pick<Comment, 'dislikes' | 'likes'>
    ) => () => {
        FirebaseService.firestore
            .collection('recipes')
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
