import {
    Checkbox,
    createStyles,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@material-ui/core'
import RemoveFromShoppingCartIcon from '@material-ui/icons/RemoveShoppingCartTwoTone'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'

import useDocumentTitle from '../../../hooks/useDocumentTitle'
import useScrollButtons from '../../../hooks/useScrollButtons'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useGridContext } from '../../Provider/GridProvider'
import NotFound from '../../Shared/NotFound'
import StyledCard from '../../Shared/StyledCard'

const useStyles = makeStyles(theme =>
    createStyles({
        checked: {
            textDecoration: 'line-through',
        },
        sonstigesRoot: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 150,
        },
        listSubHeader: {
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
        },
        recipeContainer: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        recipeItem: {
            [theme.breakpoints.down('xs')]: {
                width: 340,
            },
            [theme.breakpoints.up('sm')]: {
                width: 600,
            },
        },
    })
)

const AccountUserShoppingList = () => {
    const [textFieldValue, setTextFieldValue] = useState('')

    const theme = useTheme()
    const classes = useStyles()

    const { user, shoppingList, shoppingTracker } = useFirebaseAuthContext()
    const { gridLayout } = useGridContext()

    // ? no internal state (on initial render) >> we cannot use useRef here
    const [containerRef, setContainerRef] = useState<any | undefined>()
    const { ScrollButtons, ScrollLeftTrigger, ScrollRightTrigger } = useScrollButtons({
        element: containerRef as HTMLDivElement,
        delta: theme.breakpoints.down('xs') ? 340 : 600,
    })

    useDocumentTitle(`Einkaufsliste (${shoppingList.size})`)

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
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={10} md={9}>
                <Typography variant="h4">Einkaufsliste</Typography>
            </Grid>
            <Grid item xs={2} md={3}>
                <ScrollButtons />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    spacing={3}
                    ref={ref => setContainerRef(ref)}
                    wrap={gridLayout === 'grid' ? 'nowrap' : 'wrap'}
                    className={classes.recipeContainer}>
                    <ScrollLeftTrigger />
                    {[...shoppingList.entries()].map(([recipe, groceries]) => (
                        <Grid item xs={gridLayout === 'list' ? 12 : 'auto'} key={recipe}>
                            <div className={clsx(gridLayout === 'grid' && classes.recipeItem)}>
                                <StyledCard
                                    header={recipe}
                                    action={
                                        <Tooltip
                                            placement="left"
                                            title={`${recipe} von Einkaufsliste entfernen`}>
                                            <IconButton onClick={handleRemove(recipe)}>
                                                <RemoveFromShoppingCartIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }>
                                    <div
                                        className={clsx(
                                            recipe === 'Sonstiges' && classes.sonstigesRoot
                                        )}>
                                        <List>
                                            {groceries?.list.map(grocery => (
                                                <ListItem key={grocery}>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={listItemChecked(
                                                                recipe,
                                                                grocery
                                                            )}
                                                            onChange={handleCheckboxChange(
                                                                recipe,
                                                                grocery
                                                            )}
                                                            edge="start"
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        classes={{
                                                            primary: clsx(
                                                                listItemChecked(recipe, grocery) &&
                                                                    classes.checked
                                                            ),
                                                        }}
                                                        primary={grocery}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                        {recipe === 'Sonstiges' && (
                                            <form onSubmit={handleFormSubmit}>
                                                <TextField
                                                    value={textFieldValue}
                                                    onChange={e =>
                                                        setTextFieldValue(e.target.value)
                                                    }
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Sonstiges"
                                                />
                                            </form>
                                        )}
                                    </div>
                                </StyledCard>
                            </div>
                        </Grid>
                    ))}
                    <ScrollRightTrigger />
                </Grid>
                <NotFound visible={shoppingList.size === 0} />
            </Grid>
        </Grid>
    )
}

export default AccountUserShoppingList
