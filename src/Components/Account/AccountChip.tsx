import { Avatar, Chip } from '@material-ui/core'
import React from 'react'

import { User } from '../../model/model'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
}

const AccountChip = ({ uid }: Props) => {
    const { getByUid } = useUsersContext()
    const user: User | undefined = getByUid(uid)

    return (
        <>
            {user && (
                <Chip
                    variant="outlined"
                    onClick={() => console.log('tbd')}
                    avatar={<Avatar src={user.profilePicture}>{user.username.slice(0, 1)}</Avatar>}
                    label={user.username}
                />
            )}
        </>
    )
}

export default AccountChip
