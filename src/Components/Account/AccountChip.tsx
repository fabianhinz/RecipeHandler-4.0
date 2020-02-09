import { Avatar, Chip, createStyles, makeStyles } from '@material-ui/core'
import { ChipProps } from '@material-ui/core/Chip'
import clsx from 'clsx'
import React from 'react'

import { User } from '../../model/model'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props extends Pick<ChipProps, 'variant'> {
    uid: string
    position?: 'default' | 'absolute'
    onFilterChange?: (uid: string) => void
    selected?: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        absolute: {
            boxShadow: theme.shadows[4],
            position: 'absolute',
            left: ' 50%',
            transform: 'translate(-50%, 0)',
            zIndex: 1,
            top: theme.spacing(1),
        },
    })
)

const AccountChip = ({ uid, variant, position }: Props) => {
    const { getByUid } = useUsersContext()
    const user: User | undefined = getByUid(uid)

    const classes = useStyles()

    return (
        <>
            {user && (
                <Chip
                    variant={variant}
                    className={clsx(position === 'absolute' && classes.absolute)}
                    avatar={<Avatar src={user.profilePicture}>{user.username.slice(0, 1)}</Avatar>}
                    label={user.username}
                />
            )}
        </>
    )
}

export default AccountChip
