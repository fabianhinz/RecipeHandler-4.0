import {
  Avatar,
  Fab,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material'
import { AvatarGroup } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { StickerEmoji } from 'mdi-material-ui'
import { memo, useEffect, useMemo, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useUsersContext } from '@/Components/Provider/UsersProvider'
import { resolveCollection, resolveDoc } from '@/firebase/firebaseQueries'
import { Comment as CommentModel, CommentReaction, Recipe } from '@/model/model'
import { CommentsCollections } from '@/model/model'
import { BORDER_RADIUS_HUGE } from '@/theme'

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

const includesUrl = (value: string) =>
  value.includes('http://') || value.includes('https://')

const getCommentTypography = (comment: string): React.ReactNode => {
  if (!includesUrl(comment)) {
    return comment
  }

  const complexComment: Array<unknown> = []

  comment.split(' ').forEach(value => {
    if (includesUrl(value)) {
      complexComment.push(
        <Link
          href={value}
          color="primary"
          target="_blank"
          rel="noopener noreferrer">
          Link
        </Link>
      )
    } else {
      complexComment.push(<>{value}</>)
    }
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
  const [emoticonAnchorEl, setEmoticonAnchorEl] =
    useState<HTMLButtonElement | null>(null)
  const [reactions, setReactions] = useState<CommentReaction[]>([])

  const classes = useStyles()
  const { getByUid } = useUsersContext()
  const { user: currentUser } = useFirebaseAuthContext()

  const reactionsFirestoreRef = useMemo(() => {
    return resolveCollection(
      `${collection}/${name}/comments/${comment.documentId}/reactions`
    )
  }, [collection, comment.documentId, name])

  useEffect(() => {
    return onSnapshot(reactionsFirestoreRef, querySnapshot => {
      setReactions(
        querySnapshot.docs.map(doc => ({ ...doc.data() } as CommentReaction))
      )
    })
  }, [reactionsFirestoreRef])

  const handleEmojiClick = async (emoji: string) => {
    setEmoticonAnchorEl(null)
    if (!currentUser) {
      return
    }
    const docRef = resolveDoc(reactionsFirestoreRef, currentUser.uid)
    await setDoc(docRef, {
      emoji,
      editorUid: currentUser.uid,
      createdDate: Timestamp.fromDate(new Date()),
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
                  {comment.createdDate.toDate().toLocaleDateString()}
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
                  <ListItem
                    key={`${reaction.createdDate}-${reaction.editorUid}`}>
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
        <Grid justifyContent="space-evenly" container spacing={1}>
          {EMOJIS.map(emoji => (
            <Grid item key={emoji}>
              <IconButton
                onClick={() => handleEmojiClick(emoji)}
                classes={{
                  label: classes.emojiLabel,
                  root: classes.iconButtonRoot,
                }}
                size="large">
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
