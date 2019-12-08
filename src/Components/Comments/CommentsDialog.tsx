import {
    Box,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Grow,
    IconButton,
    makeStyles,
    TextField,
} from '@material-ui/core'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import ScrollToLatestIcon from '@material-ui/icons/ExpandMoreTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import React, { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { Comment as CommentModel, CommentsCollections, CommentsDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS_HUGE } from '../../theme'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { SlideUp } from '../Shared/Transitions'
import Comment from './Comment'

const useStyles = makeStyles(() =>
    createStyles({
        skeleton: {
            borderRadius: BORDER_RADIUS_HUGE,
        },
        dialogTitle: {
            cursor: 'move',
        },
        form: {
            flexGrow: 1,
        },
    })
)

const DraggablePaper = (props: PaperProps) => {
    return (
        <Draggable handle=".dragghandler">
            <Paper {...props} />
        </Draggable>
    )
}

interface CommentsDialogProps extends Pick<CommentsDocument, 'name'>, CommentsCollections {
    open: boolean
    onClose: () => void
    numberOfComments: number
}

const SCROLL_TO_ID = 'scrollTo'

const scrollToLatest = () => {
    // ? source: https://stackoverflow.com/a/52138511
    const element = document.getElementById(SCROLL_TO_ID)
    if (!element) return
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    })
}

export const CommentsDialog: FC<CommentsDialogProps> = ({
    open,
    onClose,
    name,
    collection,
    numberOfComments,
}) => {
    const [comments, setComments] = useState<Array<CommentModel>>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [inputDisabled, setInputDisabled] = useState(false)

    const { isDialogFullscreen } = useBreakpointsContext()
    const { user } = useFirebaseAuthContext()

    const classes = useStyles()

    useEffect(() => {
        if (!open) return
        setLoading(true)

        return FirebaseService.firestore
            .collection(collection)
            .doc(name)
            .collection('comments')
            .orderBy('createdDate', 'asc')
            .onSnapshot(querySnapshot => {
                setComments(
                    querySnapshot.docs.map(
                        doc => ({ documentId: doc.id, ...doc.data() } as CommentModel)
                    )
                )
                setLoading(false)
            })
    }, [collection, name, open])

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (input.length === 0) return
        setInputDisabled(true)

        try {
            const recipeRef = FirebaseService.firestore.collection(collection).doc(name)
            await recipeRef.collection('comments').add({
                comment: `${user!.username}: ${input}`,
                likes: 0,
                dislikes: 0,
                createdDate: FirebaseService.createTimestampFromDate(new Date()),
            })
            await recipeRef.update({ numberOfComments: FirebaseService.incrementBy(1) })

            setInput('')
            setInputDisabled(false)
            setTimeout(scrollToLatest, 500)
        } catch {
            setInputDisabled(false)
        }
    }

    return (
        <Dialog
            PaperComponent={DraggablePaper}
            BackdropProps={{ invisible: true }}
            fullScreen={isDialogFullscreen}
            TransitionComponent={SlideUp}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth>
            <DialogTitle
                className={clsx(classes.dialogTitle, !isDialogFullscreen && 'dragghandler')}>
                {name}
            </DialogTitle>
            <DialogContent>
                <Grid alignItems="flex-end" direction="column" wrap="nowrap" container spacing={1}>
                    {loading
                        ? new Array(numberOfComments).fill(1).map((_skeleton, index) => (
                              <Grid item key={index}>
                                  <Skeleton
                                      className={classes.skeleton}
                                      width={180}
                                      height={60}
                                      variant="text"
                                  />
                              </Grid>
                          ))
                        : comments.map(comment => (
                              <Comment
                                  collection={collection}
                                  key={comment.documentId}
                                  name={name}
                                  comment={comment}
                              />
                          ))}
                </Grid>
                <div id={SCROLL_TO_ID} />

                {comments.length === 0 && !loading && (
                    <Box display="flex" justifyContent="center">
                        <Grow in timeout={500}>
                            <NotFoundIcon width={200} />
                        </Grow>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {user && (
                    <form className={classes.form} onSubmit={handleFormSubmit}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    helperText={inputDisabled ? 'Wird gespeichert' : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={scrollToLatest}>
                                                <ScrollToLatestIcon />
                                            </IconButton>
                                        ),
                                    }}
                                    disabled={inputDisabled}
                                    variant="outlined"
                                    value={input}
                                    fullWidth
                                    onChange={e => setInput(e.target.value)}
                                    label="Kommentar hinzufügen"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="space-evenly">
                                    <IconButton onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                    <IconButton type="submit">
                                        <SaveIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </DialogActions>
        </Dialog>
    )
}
