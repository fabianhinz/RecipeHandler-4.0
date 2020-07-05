import {
    Avatar,
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
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'

interface Props {
    uid: string
    checked: boolean
    onChange: (uid: string) => void
    variant: 'user' | 'admin'
}

const useStyles = makeStyles(theme => ({
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
}))

const AccountListItem = ({ uid, onChange, checked, variant }: Props) => {
    const [recipesCounter, setRecipesCounter] = useState<null | number>(null)

    const { getByUid } = useUsersContext()
    const { username, profilePicture, createdDate, emailVerified } = getByUid(uid) as User

    const classes = useStyles()

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('recipesCounter')
                .doc(uid)
                .onSnapshot(docSnapshot => {
                    const data = docSnapshot.data()
                    if (data) setRecipesCounter(data.value)
                    else setRecipesCounter(0)
                }),

        [variant, uid]
    )

    const textProps: Pick<ListItemTextProps, 'secondary'> =
        variant === 'admin'
            ? { secondary: FirebaseService.createDateFromTimestamp(createdDate).toLocaleString() }
            : {
                  secondary:
                      recipesCounter === null ? (
                          <Skeleton width="5rem" variant="text" />
                      ) : (
                          `${recipesCounter} ${recipesCounter === 1 ? 'Rezept' : 'Rezepte'}`
                      ),
              }

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
