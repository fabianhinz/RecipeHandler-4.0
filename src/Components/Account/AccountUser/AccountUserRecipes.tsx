import { List } from '@material-ui/core'
import BookIcon from '@material-ui/icons/BookTwoTone'
import React from 'react'

import { User } from '../../../model/model'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../../Provider/UsersProvider'
import RecipeCard from '../../Recipe/RecipeCard'
import { Subtitle } from '../../Shared/Subtitle'
import AccountListItem from '../AccountListItem'
import { UserSettingChangeHandler } from './AccountUser'

interface Props {
    onUserSettingChange: UserSettingChangeHandler
}

const AccountUserRecipes = ({ onUserSettingChange }: Props) => {
    const { userIds } = useUsersContext()
    const { user } = useFirebaseAuthContext() as { user: User }

    return (
        <RecipeCard
            transitionOrder={2}
            header={<Subtitle icon={<BookIcon />} text="Rezeptanzeige" />}
            content={
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
            }
        />
    )
}

export default AccountUserRecipes
