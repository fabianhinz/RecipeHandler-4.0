import {
    Avatar,
    Checkbox,
    Divider,
    Link,
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
    Tooltip,
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { useRouteMatch } from 'react-router-dom'

import { ShoppingListItem, ShoppingListWithId } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { PATHS } from '../Routes/Routes'
import { GrowIn } from '../Shared/Transitions'

const useStyles = makeStyles(theme => ({
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
}))

interface Props extends Omit<ReactMarkdownProps, 'renderers' | 'className'> {
    recipeName: string
    withShoppingList?: boolean
}

const MarkdownRenderer = (props: Props) => {
    const { user } = useFirebaseAuthContext()
    const match = useRouteMatch()
    const classes = useStyles()
    const [shoppingList, setShoppingList] = useState<ShoppingListWithId>([])

    const shoppingListCollection = useMemo(() => {
        if (!user) return

        return FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .collection('shoppingList')
    }, [user])

    useEffect(() => {
        if (!props.withShoppingList) return

        return shoppingListCollection
            ?.where('recipeNameRef', '==', props.recipeName)
            .onSnapshot(snapshot => {
                setShoppingList(
                    snapshot.docs.map(doc => ({
                        documentId: doc.id,
                        ...(doc.data() as ShoppingListItem),
                    }))
                )
            })
    }, [props.recipeName, props.withShoppingList, shoppingListCollection])

    const renderPropsToGrocery = (children: any) => children[0]?.props?.value as string | undefined

    const getListItemByChildren = (children: any) =>
        shoppingList.find(item => item.value === renderPropsToGrocery(children))

    const handleCheckboxChange = (children: any) => (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        let grocery = renderPropsToGrocery(children)
        if (!grocery) return
        if (checked) {
            const shoppingListItem: ShoppingListItem = {
                value: grocery,
                recipeNameRef: props.recipeName,
                checked: false,
                createdDate: FirebaseService.createTimestampFromDate(new Date()),
            }
            shoppingListCollection?.add(shoppingListItem)
        } else {
            const docId = getListItemByChildren(children)?.documentId
            if (docId) shoppingListCollection?.doc(docId).delete()
        }
    }

    return (
        <ReactMarkdown
            renderers={{
                link: renderProps => (
                    <Link target="_blank" href={renderProps.href}>
                        {renderProps.children}
                    </Link>
                ),
                list: renderProps => <List>{renderProps.children}</List>,
                listItem: renderProps => (
                    <ListItem disableGutters>
                        {renderProps.ordered || !props.withShoppingList ? (
                            <ListItemAvatar>
                                <Avatar>{renderProps.index + 1}</Avatar>
                            </ListItemAvatar>
                        ) : (
                            <ListItemIcon>
                                <Tooltip
                                    TransitionComponent={GrowIn}
                                    title={
                                        getListItemByChildren(renderProps.children)
                                            ? 'Von der Einkaufsliste entfernen'
                                            : 'Zur Einkaufsliste hinzufügen'
                                    }>
                                    <Checkbox
                                        icon={<AddCircleIcon />}
                                        checkedIcon={<RemoveCircleIcon />}
                                        checked={Boolean(
                                            getListItemByChildren(renderProps.children)
                                        )}
                                        onChange={handleCheckboxChange(renderProps.children)}
                                        classes={{ root: classes.checkboxRoot }}
                                        disabled={
                                            (match.path !== PATHS.details() &&
                                                match.path !== PATHS.bookmarks) ||
                                            !user
                                        }
                                    />
                                </Tooltip>
                            </ListItemIcon>
                        )}
                        <ListItemText primary={renderProps.children} />
                    </ListItem>
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
