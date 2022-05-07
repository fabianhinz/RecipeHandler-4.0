import { List } from '@material-ui/core'
import BookIcon from '@material-ui/icons/SupervisedUserCircle'

import { User } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../../Provider/UsersProvider'
import StyledCard from '../../Shared/StyledCard'
import AccountListItem from '../AccountListItem'
import { AccountSettingChangeHandler } from '../helper/accountTypes'

interface Props {
  onUserSettingChange: AccountSettingChangeHandler
}
// TODO FirebaseError: [code=invalid-argument]: Invalid Query. 'in' filters support a maximum of 10 elements in the value array
const AccountUserRecipes = ({ onUserSettingChange }: Props) => {
  const { userIds } = useUsersContext()
  const { user } = useFirebaseAuthContext() as { user: User }

  return (
    <StyledCard header="Rezepte von" BackgroundIcon={BookIcon}>
      <List>
        {userIds.map(id => (
          <AccountListItem
            key={id}
            uid={id}
            variant="user"
            checked={user.selectedUsers.some(selectedId => selectedId === id)}
            onChange={onUserSettingChange('selectedUsers')}
          />
        ))}
      </List>
    </StyledCard>
  )
}

export default AccountUserRecipes
