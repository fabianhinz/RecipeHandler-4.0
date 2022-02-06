import { Button, FormControlLabel, Grid, makeStyles, Switch, Typography } from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import clsx from 'clsx'

import { OrderByRecord } from '../../model/model'
import recipeService from '../../services/recipeService'
import CategorySelection from '../Category/CategorySelection'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

const useStyles = makeStyles(theme => ({
    orderByAsc: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.easeOut,
        }),
    },
    orderByDesc: {
        transform: 'rotate(180deg)',
    },
    editorContainer: {
        paddingLeft: theme.mixins.gutters().paddingLeft,
        paddingRight: theme.mixins.gutters().paddingRight,
    },
    listSubheader: { backgroundColor: theme.palette.background.paper },
}))

interface Props {
    selectedCategories: Map<string, string>
    onRemoveSelectedCategories: () => void
    onSelectedCategoriesChange: (type: string, value: string) => void
    orderBy: OrderByRecord
    onOrderByChange: (orderBy: OrderByRecord) => void
    selectedEditors: string[]
    onSelectedEditorsChange: (uids: string[]) => void
    showMyRecipesOnly: boolean
    onShowMyRecipesOnlyChange: (checked: boolean) => void
}

const HomeRecipeSelection = (props: Props) => {
    const classes = useStyles()
    const authContext = useFirebaseAuthContext()

    const handleOrderByChange = (key: keyof OrderByRecord) => () => {
        let newOrderBy: OrderByRecord

        if (props.orderBy[key] === 'asc') newOrderBy = { [key]: 'desc' }
        else if (props.orderBy[key] === 'desc') newOrderBy = { [key]: 'asc' }
        else newOrderBy = { [key]: 'asc' }

        props.onOrderByChange(newOrderBy)
        recipeService.orderBy = newOrderBy
    }

    const headerAuthenticated = authContext.user && (
        <>
            <Grid>
                <FormControlLabel
                    labelPlacement="start"
                    label={<Typography color="textSecondary">Nur eigene Rezepte</Typography>}
                    control={
                        <Switch
                            checked={props.showMyRecipesOnly}
                            onChange={(_, checked) => props.onShowMyRecipesOnlyChange(checked)}
                        />
                    }
                />
            </Grid>
            <Grid item xs={12} />
        </>
    )

    const header = (
        <Grid container justify="center" spacing={1}>
            {headerAuthenticated}
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleOrderByChange('name')}
                    color={props.orderBy.name ? 'secondary' : 'default'}
                    startIcon={
                        <ArrowUpwardIcon
                            className={clsx(
                                classes.orderByAsc,
                                props.orderBy.name === 'desc' && classes.orderByDesc
                            )}
                        />
                    }>
                    Name
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleOrderByChange('createdDate')}
                    color={props.orderBy.createdDate ? 'secondary' : 'default'}
                    startIcon={
                        <ArrowUpwardIcon
                            className={clsx(
                                classes.orderByAsc,
                                props.orderBy.createdDate === 'desc' && classes.orderByDesc
                            )}
                        />
                    }>
                    Datum
                </Button>
            </Grid>
        </Grid>
    )

    return (
        <CategorySelection
            onCategoryChange={props.onSelectedCategoriesChange}
            selectedCategories={props.selectedCategories}
            onRemoveSelectedCategories={props.onRemoveSelectedCategories}
            label="Filter"
            header={header}
            buttonProps={{ variant: 'text' }}>
            {/* // TODO FirebaseError: [code=invalid-argument]: Invalid Query. 'in' filters support a
            maximum of 10 elements in the value array
            {user && (
                <Grid item xs={12}>
                    <ListSubheader className={classes.listSubheader}>Editoren</ListSubheader>
                    <List disablePadding>
                        {usersContext.userIds.map(uid => {
                            const user = usersContext.getByUid(uid)!
                            return (
                                <ListItem
                                    button
                                    onClick={() => handleAccountAvatarClick(uid)}
                                    key={uid}>
                                    <ListItemAvatar>
                                        <AccountAvatar
                                            user={user}
                                            isUserSelected={props.selectedEditors.some(
                                                editorUid => editorUid === uid
                                            )}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.username} />
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
            )} */}
        </CategorySelection>
    )
}

export default HomeRecipeSelection
