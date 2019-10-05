import { createStyles, Drawer, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { FirebaseService } from '../../../firebase'
import { ReactComponent as NoCommentsIcon } from '../../../icons/notFound.svg'
import {
    Comment as CommentModel,
    CommentsCollections,
    CommentsDocument,
} from '../../../model/model'
import { Loading } from '../Loading'
import { Comment } from './Comment'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            background: 'none',
        },
        root: {
            position: 'relative',
            padding: theme.spacing(2),
        },
        commentsContainer: {
            padding: theme.spacing(1),
            maxHeight: '40vh',
            minHeight: '20vh',
        },
        recipe: {
            position: 'absolute',
            bottom: theme.spacing(10),
            fontWeight: 300,
        },
        noCommentsIcon: {
            position: 'absolute',
            opacity: 0.5,
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        scrollbar: {
            padding: theme.spacing(1),
        },
    })
)

interface CommentsDrawerProps extends Pick<CommentsDocument, 'name'>, CommentsCollections {
    open: boolean
    onClose: () => void
}

export const CommentsDrawer: FC<CommentsDrawerProps> = ({ open, onClose, name, collection }) => {
    const [comments, setComments] = useState<Array<CommentModel>>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [inputDisabled, setInputDisabled] = useState(false)

    const classes = useStyles()

    const [scrollbarRef, setScrollbarRef] = useState<HTMLElement>()

    useEffect(() => {
        if (!open) return
        setLoading(true)

        return FirebaseService.firestore
            .collection(collection)
            .doc(name)
            .collection('comments')
            .orderBy('createdDate', 'desc')
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
        setInputDisabled(true)
        event.preventDefault()
        if (input.length === 0) return

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
        scrollbarRef!.scrollTop = 0
    }

    return (
        <Drawer
            BackdropProps={{ classes: { root: classes.backdrop } }}
            anchor="bottom"
            open={open}
            onClose={onClose}>
            <div className={classes.root}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <PerfectScrollbar
                            containerRef={setScrollbarRef}
                            className={classes.scrollbar}
                            options={{ suppressScrollX: true }}>
                            {loading && <Loading />}

                            <Grid
                                className={classes.commentsContainer}
                                alignItems="flex-end"
                                direction="column"
                                wrap="nowrap"
                                container
                                spacing={1}>
                                {comments.map(comment => (
                                    <Comment
                                        collection={collection}
                                        key={comment.documentId}
                                        name={name}
                                        comment={comment}
                                    />
                                ))}
                            </Grid>
                        </PerfectScrollbar>
                    </Grid>

                    <Grid item>
                        <form onSubmit={handleFormSubmit}>
                            <TextField
                                disabled={inputDisabled}
                                variant="filled"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                autoFocus
                                fullWidth
                                label="Ergänzende Hinweise und Meinungen"
                            />
                        </form>
                    </Grid>
                </Grid>

                <Typography className={classes.recipe} variant="h5">
                    {name}
                </Typography>
                {comments.length === 0 && (
                    <NoCommentsIcon className={classes.noCommentsIcon} width={200} />
                )}
            </div>
        </Drawer>
    )
}
