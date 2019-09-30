import { createStyles, Drawer, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { FirebaseService } from '../../../firebase'
import { ReactComponent as NoCommentsIcon } from '../../../icons/notFound.svg'
import { Comment, RecipeDocument } from '../../../model/model'
import { Loading } from '../../Shared/Loading'
import { RecipeComment } from './RecipeComment'

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

interface RecipeCommentsDrawerProps extends Pick<RecipeDocument, 'name'> {
    open: boolean
    onClose: () => void
}

export const RecipeCommentsDrawer: FC<RecipeCommentsDrawerProps> = ({ open, onClose, name }) => {
    const [comments, setComments] = useState<Array<Comment>>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [inputDisabled, setInputDisabled] = useState(false)

    const classes = useStyles()

    const [scrollbarRef, setScrollbarRef] = useState<HTMLElement>()

    useEffect(() => {
        if (!open) return
        setLoading(true)

        return FirebaseService.firestore
            .collection('recipes')
            .doc(name)
            .collection('comments')
            .orderBy('createdDate', 'desc')
            .onSnapshot(querySnapshot => {
                setComments(
                    querySnapshot.docs.map(
                        doc => ({ documentId: doc.id, ...doc.data() } as Comment)
                    )
                )
                setLoading(false)
            })
    }, [name, open])

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setInputDisabled(true)
        event.preventDefault()
        if (input.length === 0) return

        const recipeRef = FirebaseService.firestore.collection('recipes').doc(name)

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
                                    <RecipeComment
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
