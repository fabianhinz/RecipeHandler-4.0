import { Avatar, createStyles, Grid, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import React, { memo } from 'react'

import { Comment as CommentModel, Recipe } from '../../model/model'
import { CommentsCollections } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS_HUGE } from '../../theme'
import AccountChip from '../Account/AccountChip'

const useStyles = makeStyles(theme =>
    createStyles({
        comment: {
            cursor: 'auto',
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1),
            borderRadius: BORDER_RADIUS_HUGE,
        },
    })
)

interface CommentProps extends Pick<Recipe, 'name'>, CommentsCollections {
    comment: CommentModel
}

const includesUrl = (value: string) => value.includes('http://') || value.includes('https://')

const getCommentTypography = (comment: string): React.ReactNode => {
    if (!includesUrl(comment)) return comment
    const complexComment: Array<any> = []

    comment.split(' ').forEach(value => {
        if (includesUrl(value))
            complexComment.push(
                <a href={value} target="_blank" rel="noopener noreferrer">
                    Link
                </a>
            )
        else complexComment.push(<>{value}</>)
    })

    return (
        <>
            {complexComment.map((value, index) => (
                <span key={index}>{value} </span>
            ))}
        </>
    )
}

const Comment = ({ comment }: CommentProps) => {
    const classes = useStyles()

    return (
        <Grid container direction="column" spacing={2} alignItems="flex-end">
            <Grid item>
                <div className={classes.comment}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Typography variant="caption">
                                {FirebaseService.createDateFromTimestamp(
                                    comment.createdDate
                                ).toLocaleString()}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>{getCommentTypography(comment.comment)}</Typography>
                        </Grid>
                        <Grid item>
                            <AccountChip uid="fY6g8kg5RmYuhvoTC6rlkzES89h1" />
                        </Grid>
                    </Grid>
                </div>
            </Grid>

            <Grid item>
                <AvatarGroup>
                    <Avatar>
                        <span aria-label="" role="img">
                            👍
                        </span>
                    </Avatar>
                    <Avatar>
                        <span aria-label="" role="img">
                            👎
                        </span>
                    </Avatar>
                    {/* <Avatar>
                        <span aria-label="" role="img">
                            👏
                        </span>
                    </Avatar>
                    <Avatar>
                        <span aria-label="" role="img">
                            😛
                        </span>
                    </Avatar> */}
                    <Tooltip title="Foo • Bar • Baz">
                        <Avatar>+3</Avatar>
                    </Tooltip>
                </AvatarGroup>
            </Grid>
        </Grid>
    )
}

export default memo(
    Comment,
    (prev, next) =>
        prev.collection === next.collection &&
        prev.comment === next.comment &&
        prev.name === next.name
)
