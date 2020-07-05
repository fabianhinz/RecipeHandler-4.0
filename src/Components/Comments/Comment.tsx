import {
    Avatar,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Popover,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { StickerEmoji } from 'mdi-material-ui'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { Comment as CommentModel, CommentReaction, Recipe } from '../../model/model'
import { CommentsCollections } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS_HUGE } from '../../theme'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'

const useStyles = makeStyles(theme => ({
    comment: {
        cursor: 'auto',
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(1),
        borderRadius: BORDER_RADIUS_HUGE,
        minWidth: 200,
        position: 'relative',
    },
    avatar: {
        height: 60,
        width: 60,
    },
    reactionFab: {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translate(50%, -50%)',
    },
    popoverPaper: {
        padding: theme.spacing(1),
    },
    emojiLabel: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    iconButtonRoot: {
        padding: theme.spacing(1),
    },
}))

const EMOJIS = ['👍', '👎', '👏', '😛']

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

const Comment = ({ comment, name, collection }: CommentProps) => {
    const [emoticonAnchorEl, setEmoticonAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [reactions, setReactions] = useState<CommentReaction[]>([])

    const classes = useStyles()
    const { getByUid } = useUsersContext()
    const { user: currentUser } = useFirebaseAuthContext()

    const reactionsFirestoreRef = useMemo(
        () =>
            FirebaseService.firestore
                .collection(collection)
                .doc(name)
                .collection('comments')
                .doc(comment.documentId)
                .collection('reactions'),

        [collection, comment.documentId, name]
    )

    useEffect(() => {
        reactionsFirestoreRef?.onSnapshot(querySnapshot =>
            setReactions(querySnapshot.docs.map(doc => ({ ...doc.data() } as CommentReaction)))
        )
    }, [reactionsFirestoreRef])

    const handleEmojiClick = (emoji: string) => {
        setEmoticonAnchorEl(null)
        if (!currentUser) return
        reactionsFirestoreRef?.doc(currentUser.uid).set({
            emoji,
            editorUid: currentUser.uid,
            createdDate: FirebaseService.createTimestampFromDate(new Date()),
        } as CommentReaction)
    }

    const commentOwner = getByUid(comment.editorUid)

    return (
        <>
            <Grid container spacing={1} direction="column" alignItems="flex-end">
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" spacing={1} alignItems="center">
                        {commentOwner?.profilePicture && (
                            <Grid item>
                                <Avatar
                                    className={classes.avatar}
                                    src={commentOwner.profilePicture}></Avatar>
                            </Grid>
                        )}
                        <Grid item>
                            <div className={classes.comment}>
                                <Typography gutterBottom>
                                    <b>{commentOwner?.username}: </b>
                                    {FirebaseService.createDateFromTimestamp(
                                        comment.createdDate
                                    ).toLocaleDateString()}
                                </Typography>

                                <Typography>{getCommentTypography(comment.comment)}</Typography>

                                <Fab
                                    onClick={e => setEmoticonAnchorEl(e.currentTarget)}
                                    className={classes.reactionFab}
                                    size="small">
                                    <StickerEmoji />
                                </Fab>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Tooltip
                        title={
                            <List disablePadding dense>
                                {reactions.map(reaction => (
                                    <ListItem key={`${reaction.createdDate}-${reaction.editorUid}`}>
                                        <ListItemText
                                            primary={`${getByUid(reaction.editorUid)?.username} ${
                                                reaction.emoji
                                            }`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        }>
                        <AvatarGroup>
                            {reactions.slice(0, 2).map(reaction => (
                                <Avatar key={`${reaction.createdDate}-${reaction.editorUid}`}>
                                    {reaction.emoji}
                                </Avatar>
                            ))}

                            <Avatar>{reactions.length}</Avatar>
                        </AvatarGroup>
                    </Tooltip>
                </Grid>
            </Grid>

            <Popover
                classes={{ paper: classes.popoverPaper }}
                open={Boolean(emoticonAnchorEl)}
                anchorEl={emoticonAnchorEl}
                onClose={() => setEmoticonAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}>
                <Grid justify="space-evenly" container spacing={1}>
                    {EMOJIS.map(emoji => (
                        <Grid item key={emoji}>
                            <IconButton
                                onClick={() => handleEmojiClick(emoji)}
                                classes={{
                                    label: classes.emojiLabel,
                                    root: classes.iconButtonRoot,
                                }}>
                                {emoji}
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </>
    )
}

export default memo(
    Comment,
    (prev, next) =>
        prev.collection === next.collection &&
        prev.comment === next.comment &&
        prev.name === next.name
)
