import React, { FC, useState, useEffect } from "react";
import CommentIcon from "@material-ui/icons/CommentTwoTone";
import ThumbUpIcon from "@material-ui/icons/ThumbUpRounded";
import ThumbDownIcon from "@material-ui/icons/ThumbDownRounded";
import CancelIcon from "@material-ui/icons/CancelRounded";
import {
    IconButton,
    makeStyles,
    createStyles,
    Typography,
    Box,
    Grid,
    Drawer,
    TextField,
    Badge
} from "@material-ui/core";
import { Recipe, AttachementMetadata } from "../../model/model";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FirebaseService } from "../../firebase";
import { useBadgeStyles } from "./BadgeRating";
import { ReactComponent as NoCommentsIcon } from "../../icons/notFound.svg";

const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>
) => event.stopPropagation();

const useStyles = makeStyles(theme => {
    return createStyles({
        backdrop: {
            background: "none"
        },
        comment: {
            cursor: "auto",
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: theme.spacing(1),
            borderRadius: 16,
            marginBottom: theme.spacing(0.5)
        },
        root: {
            position: "relative",
            padding: theme.spacing(2)
        },
        commentsContainer: {
            padding: theme.spacing(1),
            maxHeight: "40vh",
            minHeight: "20vh"
        },
        recipe: {
            position: "absolute",
            bottom: theme.spacing(10),
            fontWeight: 300
        },
        noCommentsIcon: {
            position: "absolute",
            opacity: 0.5,
            bottom: theme.spacing(2),
            right: theme.spacing(2)
        },
        scrollbar: {
            padding: theme.spacing(1)
        }
    });
});
// ToDo split components, only load data when drawer is open, sort by new Field "createdDate"
export const Comments: FC<Pick<Recipe<AttachementMetadata>, "name">> = ({ name }) => {
    const [dialog, setDialog] = useState(false);
    const [comments, setComments] = useState<
        Array<{ documentId: string; comment: string; dislikes: number; likes: number }>
    >([]);
    const [input, setInput] = useState("");

    const classes = useStyles();
    const badgeClasses = useBadgeStyles();

    useEffect(() => {
        FirebaseService.firestore
            .collection("recipes")
            .doc(name)
            .collection("comments")
            .onSnapshot(querySnapshot => {
                setComments(
                    querySnapshot.docs.map(
                        doc =>
                            ({ documentId: doc.id, ...doc.data() } as {
                                documentId: string;
                                comment: string;
                                dislikes: number;
                                likes: number;
                            })
                    )
                );
            });
    }, [name]);

    const handleLike = (documentId: string) => () => {
        FirebaseService.firestore
            .collection("recipes")
            .doc(name)
            .collection("comments")
            .doc(documentId)
            .update({ likes: FirebaseService.incrementBy(1) });
    };

    const handleDislike = (documentId: string) => () => {
        FirebaseService.firestore
            .collection("recipes")
            .doc(name)
            .collection("comments")
            .doc(documentId)
            .update({ dislikes: FirebaseService.decreaseBy(1) });
    };

    const handleCommentClick = () => {
        setDialog(true);
    };

    const handleDialogChange = () => setDialog(previous => !previous);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        FirebaseService.firestore
            .collection("recipes")
            .doc(name)
            .collection("comments")
            .add({ comment: input, likes: 0, dislikes: 0 });
    };

    return (
        <div onClick={stopPropagation} onFocus={stopPropagation}>
            <IconButton onClick={handleCommentClick}>
                <Badge classes={badgeClasses} badgeContent={comments.length}>
                    <CommentIcon />
                </Badge>
            </IconButton>

            <Drawer
                BackdropProps={{ classes: { root: classes.backdrop } }}
                anchor="bottom"
                open={dialog}
                onClose={handleDialogChange}
            >
                <div className={classes.root}>
                    <Typography className={classes.recipe} variant="h5">
                        {name}
                    </Typography>
                    {comments.length === 0 && (
                        <NoCommentsIcon className={classes.noCommentsIcon} width={200} />
                    )}
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <PerfectScrollbar
                                className={classes.scrollbar}
                                options={{ suppressScrollX: true }}
                            >
                                <Grid
                                    className={classes.commentsContainer}
                                    alignItems="flex-end"
                                    direction="column"
                                    wrap="nowrap"
                                    container
                                    spacing={1}
                                >
                                    {comments.map(({ comment, dislikes, documentId, likes }) => (
                                        <Grid key={documentId} item>
                                            <Typography className={classes.comment}>
                                                {comment}
                                            </Typography>

                                            <Box
                                                marginBottom={1}
                                                display="flex"
                                                justifyContent="flex-end"
                                            >
                                                <IconButton onClick={handleLike(documentId)}>
                                                    <Badge
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right"
                                                        }}
                                                        classes={badgeClasses}
                                                        badgeContent={likes}
                                                        max={100}
                                                    >
                                                        <ThumbUpIcon />
                                                    </Badge>
                                                </IconButton>
                                                <IconButton onClick={handleDislike(documentId)}>
                                                    <Badge
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right"
                                                        }}
                                                        classes={badgeClasses}
                                                        badgeContent={dislikes}
                                                        max={100}
                                                    >
                                                        <ThumbDownIcon />
                                                    </Badge>
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </PerfectScrollbar>
                        </Grid>
                        <Grid item>
                            <form onSubmit={handleFormSubmit}>
                                <TextField
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
                </div>
            </Drawer>
        </div>
    );
};
