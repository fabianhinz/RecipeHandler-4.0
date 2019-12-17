import { Avatar, Chip } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import FilterIcon from '@material-ui/icons/FilterListRounded'
import React from 'react'

import { User } from '../../model/model'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    variant: 'readonly' | 'filter'
    onFilterChange?: (uid: string) => void
}

const AccountChip = ({ uid, variant, onFilterChange }: Props) => {
    const { getByUid } = useUsersContext()
    const user: User | undefined = getByUid(uid)
    const variantProps: ChipProps =
        variant === 'filter'
            ? {
                  variant: 'default',
                  deleteIcon: <FilterIcon />,
                  onDelete: () => onFilterChange && onFilterChange(uid),
              }
            : { variant: 'outlined' }

    return (
        <>
            {user && (
                <Chip
                    {...variantProps}
                    avatar={<Avatar src={user.profilePicture}>{user.username.slice(0, 1)}</Avatar>}
                    label={user.username}
                />
            )}
        </>
    )
}

export default AccountChip
