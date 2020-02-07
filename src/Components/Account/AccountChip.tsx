import { Avatar, Chip, createStyles, makeStyles } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import React from 'react'

import { User } from '../../model/model'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    variant: 'readonly' | 'filter' | 'absolute'
    onFilterChange?: (uid: string) => void
    selected?: boolean
}

const useStyles = makeStyles(theme => {
    const dark = theme.palette.type === 'dark'
    return createStyles({
        selectedChip: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.palette.secondary.main,
            '&:hover, &:focus': {
                backgroundColor: dark
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
            },
        },
        absolute: {
            boxShadow: theme.shadows[4],
            position: 'absolute',
            left: ' 50%',
            transform: 'translate(-50%, 0)',
            zIndex: 1,
            top: theme.spacing(1),
        },
    })
})

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
            : variant === 'absolute'
            ? { variant: 'default', className: classes.absolute }
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
