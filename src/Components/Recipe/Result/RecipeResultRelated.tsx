import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import brown from '@material-ui/core/colors/brown'
import { FC } from 'react'

import RecipeBookmarkButton from '../RecipeBookmarkButton'
import RecipeDetailsButton from '../RecipeDetailsButton'

const useStyles = makeStyles(theme => {
  const background = theme.palette.type === 'light' ? brown[200] : brown[400]

  return {
    avatar: {
      background,
      color: theme.palette.getContrastText(background),
    },
    secondaryAction: {
      display: 'flex',
    },
  }
})

export const RecipeResultRelated: FC<{ relatedRecipes: Array<string> }> = ({ relatedRecipes }) => {
  const classes = useStyles()

  return (
    <List>
      {relatedRecipes.map((recipeName, index) => (
        <div key={recipeName}>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{recipeName.slice(0, 1).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={recipeName} />
            <ListItemSecondaryAction className={classes.secondaryAction}>
              <RecipeDetailsButton name={recipeName} />
              <RecipeBookmarkButton name={recipeName} />
            </ListItemSecondaryAction>
          </ListItem>
          {index !== relatedRecipes.length - 1 && <Divider />}
        </div>
      ))}
    </List>
  )
}
