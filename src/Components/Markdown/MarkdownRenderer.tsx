/* eslint-disable react/no-multi-comp */
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { setDoc } from 'firebase/firestore'
import React from 'react'
import ReactMarkdown, { ReactMarkdownOptions } from 'react-markdown'
import { useRouteMatch } from 'react-router-dom'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { GrowIn } from '@/Components/Shared/Transitions'

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

interface Props extends Omit<ReactMarkdownOptions, 'components' | 'className'> {
  recipeName: string
  withShoppingList?: boolean
}

const MarkdownRenderer = (props: Props) => {
  const { user, shoppingListRef } = useFirebaseAuthContext()
  const match = useRouteMatch()
  const classes = useStyles()
  const { shoppingList } = useFirebaseAuthContext()

  const markdownPropsToGrocery = (children: any[]) => {
    return children[0]
  }

  const getListItemByChildren = (children: any[]) => {
    return shoppingList.find(
      item =>
        item.value === markdownPropsToGrocery(children) &&
        item.recipeNameRef === props.recipeName
    )
  }

  const handleCheckboxChange = (children: any) => {
    return async (
      _event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
    ) => {
      const grocery = markdownPropsToGrocery(children)
      if (!grocery || !props.withShoppingList) return

      let list = [...shoppingList]
      if (checked) {
        list = [
          {
            value: grocery,
            recipeNameRef: props.recipeName,
            checked: false,
            tag: '',
          },
          ...list,
        ]
      } else {
        list = list.filter(
          item =>
            item.value !== markdownPropsToGrocery(children) ||
            item.recipeNameRef !== props.recipeName
        )
      }

      if (shoppingListRef.current) {
        await setDoc(shoppingListRef.current, { list })
      }
    }
  }

  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...markdownProps }) => (
          <Link target="_blank" href={markdownProps.href as string}>
            {markdownProps.children}
          </Link>
        ),
        ol: ({ node, ...markdownProps }) => (
          <List>{markdownProps.children}</List>
        ),
        ul: ({ node, ...markdownProps }) => (
          <List>{markdownProps.children}</List>
        ),
        li: ({ node, ...markdownProps }) => {
          const listItemText = <ListItemText primary={markdownProps.children} />

          if (markdownProps.ordered || !props.withShoppingList)
            return (
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>{markdownProps.index + 1}</Avatar>
                </ListItemAvatar>

                {listItemText}
              </ListItem>
            )

          return (
            <ListItem disableGutters>
              <ListItemIcon>
                <Tooltip
                  TransitionComponent={GrowIn}
                  title={
                    getListItemByChildren(markdownProps.children)
                      ? 'Von der Einkaufsliste entfernen'
                      : 'Zur Einkaufsliste hinzufügen'
                  }>
                  <Checkbox
                    icon={<AddCircleIcon />}
                    checkedIcon={<RemoveCircleIcon />}
                    checked={Boolean(
                      getListItemByChildren(markdownProps.children)
                    )}
                    onChange={handleCheckboxChange(markdownProps.children)}
                    classes={{ root: classes.checkboxRoot }}
                    disabled={
                      (match.path !== PATHS.details() &&
                        match.path !== PATHS.bookmarks) ||
                      !user
                    }
                  />
                </Tooltip>
              </ListItemIcon>

              {listItemText}
            </ListItem>
          )
        },
        hr: () => <Divider />,
        table: ({ node, ...markdownProps }) => (
          <Table>{markdownProps.children}</Table>
        ),
        thead: ({ node, ...markdownProps }) => (
          <TableHead>{markdownProps.children}</TableHead>
        ),
        tbody: ({ node, ...markdownProps }) => (
          <TableBody>{markdownProps.children}</TableBody>
        ),
        tr: ({ node, ...markdownProps }) => (
          <TableRow>{markdownProps.children}</TableRow>
        ),
        td: ({ node, ...markdownProps }) => (
          <TableCell>{markdownProps.children}</TableCell>
        ),
      }}
      className={classes.markdown}
      {...props}
    />
  )
}

export default MarkdownRenderer
