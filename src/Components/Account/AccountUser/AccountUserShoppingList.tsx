import {
    Checkbox,
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
} from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartTwoTone'
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'

import { User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import RecipeCard from '../../Recipe/RecipeCard'
import { Subtitle } from '../../Shared/Subtitle'

const useStyles = makeStyles(() =>
    createStyles({
        checked: {
            textDecoration: 'line-through',
        },
    })
)

type RecipeName = string
type GroceriesTracker = {
    [grocery: string]: boolean
}

const AccountUserShoppingList = () => {
    const [shoppingList, setShoppingList] = useState<Map<RecipeName, GroceriesTracker>>(new Map())
    const classes = useStyles()

    const { user } = useFirebaseAuthContext() as { user: User }

    const shoppingListRef = useMemo(
        () =>
            FirebaseService.firestore
                .collection('users')
                .doc(user.uid)
                .collection('shoppingList'),
        [user.uid]
    )

    useEffect(() => {
        shoppingListRef.onSnapshot(querySnapshot => {
            const newShoppingList: Map<RecipeName, GroceriesTracker> = new Map()
            querySnapshot.docs.forEach(doc =>
                newShoppingList.set(doc.id, doc.data() as GroceriesTracker)
            )
            setShoppingList(newShoppingList)
        })
    }, [shoppingListRef])

    const handleGroceryClick = (recipe: string, grocery: string) => (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        shoppingListRef.doc(recipe).update({ [grocery]: checked })
    }

    return (
        <RecipeCard
            transitionOrder={1}
            header={<Subtitle icon={<ShoppingCartIcon />} text="Einkaufsliste" />}
            content={
                <List>
                    {[...shoppingList.entries()].map(([recipe, groceries]) => (
                        <div key={recipe}>
                            <ListSubheader>{recipe}</ListSubheader>
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
