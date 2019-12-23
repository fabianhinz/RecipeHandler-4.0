import {
    Avatar,
    createStyles,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    ListItemTextProps,
    makeStyles,
    Switch,
} from '@material-ui/core'
import React from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    checked: boolean
    onChange: (uid: string) => void
    showCreatedDate?: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        itemAvatar: {
            minWidth: 66,
        },
        avatar: {
            width: 50,
            height: 50,
            margin: '8px 0px',
        },
    })
)

const AccountListItem = ({ uid, onChange, checked, showCreatedDate }: Props) => {
    const { getByUid } = useUsersContext()
    const { username, profilePicture, createdDate } = getByUid(uid) as User

    const classes = useStyles()

    const textProps: Pick<ListItemTextProps, 'secondary'> = showCreatedDate
        ? { secondary: FirebaseService.createDateFromTimestamp(createdDate).toLocaleString() }
        : {}

    return (
        <ListItem>
            <ListItemAvatar className={classes.itemAvatar}>
                <Avatar className={classes.avatar} src={profilePicture}>
                    {username.slice(0, 1)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} {...textProps} />
            <ListItemSecondaryAction>
                <Switch checked={checked} onChange={() => onChange(uid)} edge="start" />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default AccountListItem
