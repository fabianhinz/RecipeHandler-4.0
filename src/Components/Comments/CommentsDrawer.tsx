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
import { SlideUp } from '../Shared/Transitions'
import Comment from './Comment'

const useStyles = makeStyles(() =>
    createStyles({
        skeleton: {
            borderRadius: BORDER_RADIUS_HUGE,
        },
        dialogContent: {
            minHeight: 208,
        },
        dialogContentMaxHeigth: {
            maxHeight: '50vh',
        },
        dialogTitle: {
            cursor: 'move',
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

interface CommentsDrawerProps extends Pick<CommentsDocument, 'name'>, CommentsCollections {
    open: boolean
    onClose: () => void
    numberOfComments: number
}

export const CommentsDrawer: FC<CommentsDrawerProps> = ({
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

    const handleSave = async () => {
        if (input.length === 0) return
        setInputDisabled(true)

        const recipeRef = FirebaseService.firestore.collection(collection).doc(name)
        await recipeRef.collection('comments').add({
            comment: input,
            likes: 0,
            dislikes: 0,
            createdDate: FirebaseService.createTimestampFromDate(new Date()),
        })
        await recipeRef.update({ numberOfComments: ++comments.length })

        setInput('')
        setInputDisabled(false)
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
            <DialogTitle className={clsx(classes.dialogTitle, 'dragghandler')}>{name}</DialogTitle>
            <DialogContent
                className={clsx(
                    classes.dialogContent,
                    !isDialogFullscreen && classes.dialogContentMaxHeigth
                )}>
                <Grid alignItems="flex-end" direction="column" wrap="nowrap" container spacing={1}>
                    {loading
                        ? new Array(numberOfComments).fill(1).map((_skeleton, index) => (
                              <Grid item key={index}>
                                  <Skeleton
                                      className={classes.skeleton}
                                      width={250}
                                      height={100}
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
                {comments.length === 0 && !loading && (
                    <Box display="flex" justifyContent="center">
                        <Grow in timeout={500}>
                            <NotFoundIcon width={200} />
                        </Grow>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <TextField
                    disabled={inputDisabled}
                    variant="outlined"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    fullWidth
                    label="Ergänzende Hinweise und Meinungen"
                />
                <IconButton onClick={handleSave} disabled={input.length === 0}>
                    <SaveIcon />
                </IconButton>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}
