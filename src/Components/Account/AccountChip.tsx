import { Avatar, Chip, createStyles, makeStyles } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import React from 'react'

import { User } from '../../model/model'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    variant: 'readonly' | 'filter'
    onFilterChange?: (uid: string) => void
    selected?: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        selectedChip: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.palette.secondary.main,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.secondary.dark,
            },
        },
    })
)

const AccountChip = ({ uid, variant, onFilterChange, selected }: Props) => {
    const { getByUid } = useUsersContext()
    const user: User | undefined = getByUid(uid)

    const classes = useStyles()

    const variantProps: ChipProps =
        variant === 'filter'
            ? {
                  onClick: () => onFilterChange && onFilterChange(uid),
                  variant: 'default',
                  className: selected ? classes.selectedChip : undefined,
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
