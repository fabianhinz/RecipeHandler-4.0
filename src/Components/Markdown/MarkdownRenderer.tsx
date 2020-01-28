import {
    Avatar,
    Checkbox,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core'
import React, { useState } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { useRouteMatch } from 'react-router-dom'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        checkboxRoot: {
            padding: theme.spacing(0.5),
        },
        recipeContainer: {
            overflowX: 'hidden',
        },
        markdown: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
        markdownLink: {
            color:
                theme.palette.type === 'dark'
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
        },
    })
)

const MarkdownRenderer = (props: Omit<ReactMarkdownProps, 'renderers' | 'className'>) => {
    const [orderedList, setOrderedList] = useState(false)
    const [lastListIndex, setLastListIndex] = useState(0)

    const { user } = useFirebaseAuthContext()
    const match = useRouteMatch()
    const classes = useStyles()

    return (
        <ReactMarkdown
            renderers={{
                link: props => (
                    <a
                        className={classes.markdownLink}
                        href={props.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {props.children}
                    </a>
                ),
                list: props => {
                    setOrderedList(props.ordered)
                    setLastListIndex(props.children.length - 1)
                    return <List>{props.children}</List>
                },
                listItem: props => (
                    <>
                        <ListItem>
                            {orderedList ? (
                                <ListItemAvatar>
                                    <Avatar>{props.index + 1}</Avatar>
                                </ListItemAvatar>
                            ) : (
                                user && (
                                    <ListItemIcon>
                                        <Checkbox
                                            classes={{ root: classes.checkboxRoot }}
                                            disabled={match.path !== PATHS.details()}
                                        />
                                    </ListItemIcon>
                                )
                            )}
                            <ListItemText primary={props.children} />
                        </ListItem>
                        {orderedList && lastListIndex !== props.index && (
                            <Divider variant="inset" />
                        )}
                    </>
                ),
                thematicBreak: () => <Divider />,
                table: props => <Table>{props.children}</Table>,
                tableHead: props => <TableHead>{props.children}</TableHead>,
                tableBody: props => <TableBody>{props.children}</TableBody>,
                tableRow: props => <TableRow>{props.children}</TableRow>,
                tableCell: props => <TableCell>{props.children}</TableCell>,
            }}
            className={classes.markdown}
            {...props}
        />
    )
}

export default MarkdownRenderer
