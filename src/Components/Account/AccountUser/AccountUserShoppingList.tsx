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
import React, { useMemo, useState } from 'react'

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
    const [updatingTracker, setUpdatingTracker] = useState(false)

    const { user, shoppingList, shoppingTracker } = useFirebaseAuthContext()

    const shoppingListDocRef = useMemo(
        () =>
            FirebaseService.firestore
                .collection('users')
                .doc(user?.uid)
                .collection('shoppingList'),
        [user]
    )

    const handleGroceryClick = (recipe: string, grocery: string) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        setUpdatingTracker(true)
        let tracker = shoppingTracker.get(recipe)?.tracker

        if (!tracker) tracker = [grocery]
        else if (checked) tracker.push(grocery)
        else tracker = tracker.filter(trackerEl => trackerEl !== grocery)

        await shoppingListDocRef.doc(recipe).set({ tracker }, { merge: true })
        setUpdatingTracker(false)
    }

    const handleRemove = (recipe: string) => () => {
        shoppingListDocRef.doc(recipe).delete()
    }

    const listItemChecked = (recipe: string, grocery: string) =>
        Boolean(shoppingTracker.get(recipe)?.tracker?.some(trackerEl => trackerEl === grocery))

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
                            {groceries?.list.map(grocery => (
                                <ListItem key={grocery}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={listItemChecked(recipe, grocery)}
                                            disabled={updatingTracker}
                                            onChange={handleGroceryClick(recipe, grocery)}
                                            edge="start"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        classes={{
                                            primary: clsx(
                                                listItemChecked(recipe, grocery) && classes.checked
                                            ),
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
