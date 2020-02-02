import { List } from '@material-ui/core'
import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import { User } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../../Provider/UsersProvider'
import StyledCard from '../../Shared/StyledCard'
import AccountListItem from '../AccountListItem'
import { UserSettingChangeHandler } from './AccountUser'

interface Props {
    onUserSettingChange: UserSettingChangeHandler
}

const AccountUserRecipes = ({ onUserSettingChange }: Props) => {
    const { userIds } = useUsersContext()
    const { user } = useFirebaseAuthContext() as { user: User }

    return (
        <StyledCard header="Rezeptanzeige" BackgroundIcon={BookIcon}>
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
