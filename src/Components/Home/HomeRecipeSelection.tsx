import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

import AccountAvatar from '@/Components/Account/AccountAvatar'
import CategorySelection from '@/Components/Category/CategorySelection'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useUsersContext } from '@/Components/Provider/UsersProvider'
import { useRecipesCounterByUserUid } from '@/hooks/useRecipesCounterByUserUid'
import { OrderByRecord } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'

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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  listSubheader: { backgroundColor: theme.palette.background.paper },
  editorCounterList: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
}))

interface Props {
  selectedCategories: Map<string, string>
  onRemoveSelectedCategories: () => void
  onSelectedCategoriesChange: (type: string, value: string) => void
  orderBy: OrderByRecord
  onOrderByChange: (orderBy: OrderByRecord) => void
  selectedEditor: string
  onSelectedEditorChange: (uid: string) => void
}

const HomeRecipeSelection = (props: Props) => {
  const recipesCounterByUserUid = useRecipesCounterByUserUid()
  const userContext = useUsersContext()
  const classes = useStyles()
  const authContext = useFirebaseAuthContext()

  const handleOrderByChange = (key: keyof OrderByRecord) => () => {
    let newOrderBy: OrderByRecord

    if (props.orderBy[key] === 'asc') newOrderBy = { [key]: 'desc' }
    else if (props.orderBy[key] === 'desc') newOrderBy = { [key]: 'asc' }
    else newOrderBy = { [key]: 'asc' }

    props.onOrderByChange(newOrderBy)
    getRecipeService().orderBy = newOrderBy
  }

  const header = (
    <Grid container justifyContent="center" spacing={1}>
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
      forceHighlight={props.selectedEditor.length > 0}
      onRemoveSelectedCategories={props.onRemoveSelectedCategories}
      label="Filter"
      header={header}
      buttonProps={{ variant: 'text' }}>
      {authContext.user && (
        <Grid item xs={12}>
          <ListSubheader className={classes.listSubheader}>
            Autoren
          </ListSubheader>
          <List>
            {recipesCounterByUserUid.map(([uid, counter]) => {
              const user = userContext.getByUid(uid)
              if (!user) return null
              return (
                <ListItem
                  button
                  onClick={() => {
                    props.onSelectedEditorChange(
                      uid === props.selectedEditor ? '' : uid
                    )
                  }}
                  key={uid}>
                  <ListItemAvatar>
                    <AccountAvatar
                      user={user}
                      isUserSelected={props.selectedEditor === uid}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} secondary={counter} />
                </ListItem>
              )
            })}
          </List>
        </Grid>
      )}
      {/* // TODO FirebaseError: [code=invalid-argument]: Invalid Query. 'in' filters support a
            maximum of 10 elements in the value array
            {user && (
                <Grid item xs={12}>
                    <ListSubheader className={classes.listSubheader}>Autoren</ListSubheader>
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
