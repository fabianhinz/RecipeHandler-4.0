import {
  Avatar,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import { Skeleton } from '@material-ui/lab'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import SelectionDrawer from '@/Components/Shared/SelectionDrawer'
import useDebounce from '@/hooks/useDebounce'
import { Recipe } from '@/model/model'

const useStyles = makeStyles(theme => ({
  avatarRoot: {
    height: 40,
    width: 40,
    border: `2px solid ${theme.palette.divider}`,
  },
  avatarSelected: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
  },
  inputBaseRoot: {
    width: '100%',
    ...theme.typography.h6,
  },
  inputBaseInput: {
    fontFamily: 'Ubuntu',
    padding: theme.spacing(1),
  },
}))

const endAt = (debouncedSearchValue: string) => {
  // https://stackoverflow.com/a/57290806
  return debouncedSearchValue.replace(/.$/, c =>
    String.fromCharCode(c.charCodeAt(0) + 1)
  )
}

interface Props {
  relatedRecipes: string[]
  onRelatedRecipesChange: (relatedRecipes: string[]) => void
}

const RelatedRecipesSelection = ({
  relatedRecipes,
  onRelatedRecipesChange,
}: Props) => {
  const [loading, setLoading] = useState(true)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [recipes, setRecipes] = useState<Array<Recipe>>([])

  const debouncedSearchValue = useDebounce(searchValue, 500)

  const classes = useStyles()

  useEffect(() => {
    if (!shouldLoad) return

    const query:
      | firebase.default.firestore.CollectionReference
      | firebase.default.firestore.Query = FirebaseService.firestore
      .collection('recipes')
      .limit(FirebaseService.QUERY_LIMIT * 2)

    const handleSnapshot = (
      querySnapshot: firebase.default.firestore.QuerySnapshot
    ) => {
      setLoading(false)
      setRecipes(querySnapshot.docs.map(doc => doc.data() as Recipe))
    }

    if (debouncedSearchValue.length > 0) {
      return query
        .orderBy('name', 'asc')
        .where('name', '>=', debouncedSearchValue)
        .where('name', '<', endAt(debouncedSearchValue))
        .onSnapshot(handleSnapshot)
    } else {
      return query.orderBy('createdDate', 'desc').onSnapshot(handleSnapshot)
    }
  }, [debouncedSearchValue, shouldLoad])

  const handleSelectedChange = (recipeName: string) => {
    let newRelatedRecipes: string[] = [...relatedRecipes]
    if (relatedRecipes.some(name => name === recipeName)) {
      newRelatedRecipes = newRelatedRecipes.filter(name => name !== recipeName)
    } else {
      newRelatedRecipes.push(recipeName)
    }
    onRelatedRecipesChange(newRelatedRecipes)
  }

  return (
    <SelectionDrawer
      onOpen={() => setShouldLoad(true)}
      onClose={() => setShouldLoad(false)}
      buttonProps={{
        icon: <SwapIcon />,
        label: 'Passende Rezepte',
      }}
      legend="Über Verknüpfungen werden Menüs erstellt"
      header={
        <InputBase
          classes={{
            root: classes.inputBaseRoot,
            input: classes.inputBaseInput,
          }}
          value={searchValue}
          placeholder="Nach Rezeptnamen filtern"
          onChange={e => setSearchValue(e.target.value)}
        />
      }
      highlight={relatedRecipes.length > 0}>
      <List disablePadding>
        {recipes.map(recipe => (
          <ListItem
            button
            key={recipe.name}
            onClick={() => handleSelectedChange(recipe.name)}>
            <ListItemAvatar>
              <Avatar
                src={
                  relatedRecipes.some(name => name === recipe.name)
                    ? undefined
                    : recipe.previewAttachment
                }
                className={clsx(
                  classes.avatarRoot,
                  relatedRecipes.some(name => name === recipe.name) &&
                    classes.avatarSelected
                )}>
                {recipe.name.slice(0, 1)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={recipe.name}
              secondary={recipe.createdDate.toDate().toLocaleDateString()}
            />
          </ListItem>
        ))}

        {loading &&
          new Array(FirebaseService.QUERY_LIMIT * 2)
            .fill(1)
            .map((_dummy, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Skeleton variant="circle" height={40} width={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="30%" />}
                />
              </ListItem>
            ))}
      </List>
    </SelectionDrawer>
  )
}

export default RelatedRecipesSelection
