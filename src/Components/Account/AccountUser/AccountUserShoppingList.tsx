import {
    Checkbox,
    createStyles,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
} from '@material-ui/core'
import RemoveFromShoppingCartIcon from '@material-ui/icons/RemoveShoppingCartTwoTone'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartTwoTone'
import clsx from 'clsx'
import React, { useMemo } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import RecipeCard from '../../Recipe/RecipeCard'
import { Subtitle } from '../../Shared/Subtitle'

const useStyles = makeStyles(() =>
    createStyles({
        checked: {
            textDecoration: 'line-through',
        },
        listSubHeader: {
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

const AccountUserShoppingList = () => {
    const classes = useStyles()

    const { user, shoppingList } = useFirebaseAuthContext()

    const shoppingListDocRef = useMemo(
        () =>
            FirebaseService.firestore
                .collection('users')
                .doc(user?.uid)
                .collection('shoppingList'),
        [user]
    )

    const handleGroceryClick = (recipe: string, grocery: string) => (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        shoppingListDocRef.doc(recipe).update({ [grocery]: checked })
    }

    const handleRemove = (recipe: string) => () => {
        shoppingListDocRef.doc(recipe).delete()
    }

    return (
        <RecipeCard
            transitionOrder={1}
            header={<Subtitle icon={<ShoppingCartIcon />} text="Einkaufsliste" />}
            content={
                <List>
                    {[...shoppingList.entries()].map(([recipe, groceries]) => (
                        <div key={recipe}>
                            <ListSubheader className={classes.listSubHeader}>
                                {recipe}
                                <IconButton onClick={handleRemove(recipe)}>
                                    <RemoveFromShoppingCartIcon color="secondary" />
                                </IconButton>
                            </ListSubheader>
                            {Object.keys(groceries).map(grocery => (
                                <ListItem key={grocery}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={groceries[grocery]}
                                            onChange={handleGroceryClick(recipe, grocery)}
                                            edge="start"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        classes={{
                                            primary: clsx(groceries[grocery] && classes.checked),
                                        }}
                                        primary={grocery}
                                    />
                                </ListItem>
                            ))}
                        </div>
                    ))}
                </List>
            }
        />
    )
}

export default AccountUserShoppingList
