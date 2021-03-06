import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    TextField,
} from '@material-ui/core'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/Close'
import ScrollToLatestIcon from '@material-ui/icons/ExpandMore'
import SaveIcon from '@material-ui/icons/Save'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import React, { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'

import { Comment as CommentModel, CommentsCollections, CommentsDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS_HUGE } from '../../theme'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import NotFound from '../Shared/NotFound'
import { SlideUp } from '../Shared/Transitions'
import Comment from './Comment'

const useStyles = makeStyles(theme => ({
    skeleton: {
        borderRadius: BORDER_RADIUS_HUGE,
    },
    dialogTitle: {
        cursor: 'move',
    },
    form: {
        flexGrow: 1,
    },
    dialogContent: {
        padding: theme.spacing(3),
        paddingRight: theme.spacing(4),
    },
}))

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
            await FirebaseService.firestore
                .collection(collection)
                .doc(name)
                .collection('comments')
                .add({
                    editorUid: user?.uid,
                    comment: input,
                    likes: 0,
                    dislikes: 0,
                    createdDate: FirebaseService.createTimestampFromDate(new Date()),
                } as Omit<CommentModel, 'documentId'>)

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
            <DialogContent className={classes.dialogContent}>
                <Grid alignItems="flex-end" direction="column" wrap="nowrap" container spacing={4}>
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
                              <Grid item key={comment.documentId}>
                                  <Comment collection={collection} name={name} comment={comment} />
                              </Grid>
                          ))}
                </Grid>
                <div id={SCROLL_TO_ID} />

                <NotFound visible={comments.length === 0 && !loading} />
            </DialogContent>
            <DialogActions>
                <form className={classes.form} onSubmit={handleFormSubmit}>
                    <Grid container>
                        {user && (
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
                        )}
                        <Grid item xs={12}>
                            <Grid container justify="space-evenly">
                                <IconButton onClick={onClose}>
                                    <CloseIcon />
                                </IconButton>
                                {user && (
                                    <IconButton type="submit">
                                        <SaveIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </DialogActions>
        </Dialog>
    )
}
