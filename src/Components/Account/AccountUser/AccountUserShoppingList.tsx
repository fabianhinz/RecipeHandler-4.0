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
    TextField,
} from '@material-ui/core'
import RemoveFromShoppingCartIcon from '@material-ui/icons/RemoveShoppingCartTwoTone'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartTwoTone'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import StyledCard from '../../Shared/StyledCard'

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
    const [textFieldValue, setTextFieldValue] = useState('')

    const { user, shoppingList, shoppingTracker } = useFirebaseAuthContext()

    const shoppingListDocRef = useMemo(
        () =>
            FirebaseService.firestore
                .collection('users')
                .doc(user?.uid)
                .collection('shoppingList'),
        [user]
    )

    const handleCheckboxChange = (recipe: string, grocery: string) => async (
        _event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        let tracker = shoppingTracker.get(recipe)?.tracker

        if (!tracker) tracker = [grocery]
        else if (checked) tracker.push(grocery)
        else tracker = tracker.filter(trackerEl => trackerEl !== grocery)

        await shoppingListDocRef.doc(recipe).set({ tracker }, { merge: true })
    }

    const handleRemove = (recipe: string) => () => shoppingListDocRef.doc(recipe).delete()

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // ToDo try to stay dry :(
        let list = shoppingList.get('Sonstiges')?.list

        if (!list) list = [textFieldValue]
        else if (!list.some(el => el === textFieldValue)) list.push(textFieldValue)
        else list = list.filter(listEl => listEl !== textFieldValue)

        if (list.length === 0) await shoppingListDocRef.doc('Sonstiges').delete()
        else await shoppingListDocRef.doc('Sonstiges').set({ list }, { merge: true })

        setTextFieldValue('')
    }

    const listItemChecked = (recipe: string, grocery: string) =>
        Boolean(shoppingTracker.get(recipe)?.tracker?.some(trackerEl => trackerEl === grocery))

    return (
        <StyledCard header="Einkaufsliste" BackgroundIcon={ShoppingCartIcon}>
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
                                        onChange={handleCheckboxChange(recipe, grocery)}
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
            <form onSubmit={handleFormSubmit}>
                <TextField
                    value={textFieldValue}
                    onChange={e => setTextFieldValue(e.target.value)}
                    variant="outlined"
                    helperText="Die Liste kann beliebig erweitert werden"
                    fullWidth
                    label="Sonstiges"
                />
            </form>
        </StyledCard>
    )
}

export default AccountUserShoppingList
