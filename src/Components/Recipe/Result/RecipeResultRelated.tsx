import {
    Avatar,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import brown from '@material-ui/core/colors/brown'
import React, { FC } from 'react'

import { RecipeResultPin } from './Action/RecipeResultPin'

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === 'light' ? brown[200] : brown[400]

    return createStyles({
        avatar: {
            background,
            color: theme.palette.getContrastText(background),
        },
    })
})

export const RecipeResultRelated: FC<{ relatedRecipes: Array<string> }> = ({ relatedRecipes }) => {
    const classes = useStyles()

    return (
        <List>
            {relatedRecipes.map((recipeName, index) => (
                <div key={recipeName}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                {recipeName.slice(0, 1).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={recipeName} />
                        <ListItemSecondaryAction>
                            <RecipeResultPin name={recipeName} />
                        </ListItemSecondaryAction>
                    </ListItem>
                    {index !== relatedRecipes.length - 1 && <Divider />}
                </div>
            ))}
        </List>
    )
}
