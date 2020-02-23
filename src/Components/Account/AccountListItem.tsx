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
    TypographyProps,
} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/EmailRounded'
import React from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    checked: boolean
    onChange: (uid: string) => void
    variant: 'user' | 'admin'
}

const useStyles = makeStyles(theme =>
    createStyles({
        itemAvatar: {
            minWidth: 66,
        },
        avatar: {
            width: 50,
            height: 50,
            margin: '8px 0px',
        },
        itemTextPrimary: {
            display: 'flex',
            alignItems: 'center',
        },
        itemTextPrimaryIcon: {
            marginLeft: theme.spacing(1),
        },
    })
)

const AccountListItem = ({ uid, onChange, checked, variant }: Props) => {
    const { getByUid } = useUsersContext()
    const { username, profilePicture, createdDate, emailVerified } = getByUid(uid) as User

    const classes = useStyles()

    const textProps: Pick<ListItemTextProps, 'secondary'> =
        variant === 'admin'
            ? { secondary: FirebaseService.createDateFromTimestamp(createdDate).toLocaleString() }
            : {}

    return (
        <ListItem>
            <ListItemAvatar className={classes.itemAvatar}>
                <Avatar variant="rounded" className={classes.avatar} src={profilePicture}>
                    {username.slice(0, 1)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <div className={classes.itemTextPrimary}>
                        {username}
                        {variant === 'admin' && (
                            <EmailIcon
                                className={classes.itemTextPrimaryIcon}
                                color={emailVerified ? 'primary' : 'error'}
                            />
                        )}
                    </div>
                }
                primaryTypographyProps={{ component: 'div' } as TypographyProps}
                {...textProps}
            />
            <ListItemSecondaryAction>
                <Switch checked={checked} onChange={() => onChange(uid)} edge="start" />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default AccountListItem
