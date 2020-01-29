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
import AddCircleIcon from '@material-ui/icons/AddCircleTwoTone'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircleTwoTone'
import React, { useMemo, useState } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { useRouteMatch } from 'react-router-dom'

import { FirebaseService } from '../../services/firebase'
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

interface Props extends Omit<ReactMarkdownProps, 'renderers' | 'className'> {
    recipeName: string
}
// ToDo handle ordered and unordered List in same Renderer
const MarkdownRenderer = (props: Props) => {
    const [orderedList, setOrderedList] = useState(false)
    const [lastListIndex, setLastListIndex] = useState(0)
    const [updatingList, setUpdatingList] = useState(false)

    const { user, shoppingList } = useFirebaseAuthContext()
    const match = useRouteMatch()
    const classes = useStyles()

    const shoppingListDocRef = useMemo(() => {
        if (!user || !props.recipeName) return
        return FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .collection('shoppingList')
            .doc(props.recipeName)
    }, [props.recipeName, user])

    const renderPropsToGrocery = (children: any) => children[0]?.props?.value as string | undefined

    const checkboxChecked = (children: any) => {
        const groceries = shoppingList.get(props.recipeName)?.list

        if (!groceries || groceries.length === 0) return false

        const grocery = renderPropsToGrocery(children)
        if (!grocery) return false

        return groceries.some(groceryEl => groceryEl === grocery)
    }

    const handleCheckboxChange = (children: any) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        setUpdatingList(true)

        let grocery = renderPropsToGrocery(children)
        if (!grocery || !props.recipeName || !shoppingListDocRef) return

        let list = shoppingList.get(props.recipeName)?.list

        if (!list) list = [grocery]
        else if (checked) list.push(grocery)
        else list = list.filter(listEl => listEl !== grocery)

        if (list.length === 0) await shoppingListDocRef.delete()
        else await shoppingListDocRef.set({ list }, { merge: true })

        setUpdatingList(false)
    }

    return (
        <ReactMarkdown
            renderers={{
                link: renderProps => (
                    <a
                        className={classes.markdownLink}
                        href={renderProps.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {renderProps.children}
                    </a>
                ),
                list: renderProps => {
                    setOrderedList(renderProps.ordered)
                    setLastListIndex(renderProps.children.length - 1)
                    return <List>{renderProps.children}</List>
                },
                listItem: renderProps => (
                    <>
                        <ListItem>
                            {orderedList ? (
                                <ListItemAvatar>
                                    <Avatar>{renderProps.index + 1}</Avatar>
                                </ListItemAvatar>
                            ) : (
                                user && (
                                    <ListItemIcon>
                                        <Checkbox
                                            icon={<AddCircleIcon />}
                                            checkedIcon={<RemoveCircleIcon />}
                                            checked={checkboxChecked(renderProps.children)}
                                            onChange={handleCheckboxChange(renderProps.children)}
                                            classes={{ root: classes.checkboxRoot }}
                                            disabled={
                                                match.path !== PATHS.details() || updatingList
                                            }
                                        />
                                    </ListItemIcon>
                                )
                            )}
                            <ListItemText primary={renderProps.children} />
                        </ListItem>
                        {orderedList && lastListIndex !== renderProps.index && (
                            <Divider variant="inset" />
                        )}
                    </>
                ),
                thematicBreak: () => <Divider />,
                table: renderProps => <Table>{renderProps.children}</Table>,
                tableHead: renderProps => <TableHead>{renderProps.children}</TableHead>,
                tableBody: renderProps => <TableBody>{renderProps.children}</TableBody>,
                tableRow: renderProps => <TableRow>{renderProps.children}</TableRow>,
                tableCell: renderProps => <TableCell>{renderProps.children}</TableCell>,
            }}
            className={classes.markdown}
            {...props}
        />
    )
}

export default MarkdownRenderer
