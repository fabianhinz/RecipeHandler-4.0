import {
    Avatar,
    Box,
    Button,
    CardActionArea,
    createStyles,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import { Account, AccountMultiple, CameraImage } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useAttachmentDropzone } from '../Recipe/Create/Attachments/useAttachmentDropzone'
import AccountContentAdmin from './AccountContentAdmin'
import { AccountContentProps } from './AccountDialog'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            [theme.breakpoints.down('md')]: {
                width: 140,
                height: 140,
            },
            [theme.breakpoints.up('md')]: {
                width: 220,
                height: 220,
            },
        },
        actionArea: {
            borderRadius: '50%',
            width: 'fit-content',
        },
    })
)

interface Props extends AccountContentProps {
    user: User
}

const AccountContentUser = ({ user, onDialogLoading, onDialogClose }: Props) => {
    const [observedUser, setObservedUser] = useState<User>()
    const { enqueueSnackbar } = useSnackbar()
    const { attachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })

    const classes = useStyles()

    const userDoc = useCallback(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

    useEffect(() => {
        if (attachments.length > 0) userDoc().update({ profilePicture: attachments[0].dataUrl })
    }, [attachments, userDoc])

    useEffect(() => {
        onDialogLoading(true)
        return userDoc().onSnapshot(docSnapshot => {
            setObservedUser({
                uid: docSnapshot.id,
                ...(docSnapshot.data() as Omit<User, 'uid'>),
            })
            onDialogLoading(false)
        })
    }, [onDialogLoading, user.uid, userDoc])

    const handleLogout = () => {
        onDialogLoading(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleUserDocClick = (key: keyof Pick<User, 'muiTheme' | 'showAllRecipes'>) => () => {
        if (!observedUser) return
        switch (key) {
            case 'muiTheme': {
                userDoc().update({ [key]: observedUser.muiTheme === 'dark' ? 'light' : 'dark' })
                break
            }
            case 'showAllRecipes': {
                userDoc().update({ [key]: !observedUser.showAllRecipes })
                break
            }
        }
    }

    return (
        <>
            <DialogContent>
                <Grid container spacing={2} direction="column" alignContent="stretch">
                    {user.admin && (
                        <>
                            <Grid item xs={12}>
                                <AccountContentAdmin onDialogLoading={onDialogLoading} />
                            </Grid>
                            <Grid item xs>
                                <Divider />
                            </Grid>
                        </>
                    )}

                    {observedUser && (
                        <Grid item xs>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <Typography variant="h5">{observedUser.username}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} md={12}>
                                    <Grid container justify="center">
                                        <CardActionArea
                                            className={classes.actionArea}
                                            {...dropzoneProps.getRootProps()}>
                                            <Avatar
                                                className={classes.avatar}
                                                src={observedUser.profilePicture}>
                                                <CameraImage fontSize="large" />
                                            </Avatar>
                                            <input {...dropzoneProps.getInputProps()} />
                                        </CardActionArea>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={8} md={12}>
                                    <List>
                                        <ListItem
                                            button
                                            onClick={handleUserDocClick('showAllRecipes')}>
                                            <ListItemIcon>
                                                {observedUser.showAllRecipes ? (
                                                    <AccountMultiple />
                                                ) : (
                                                    <Account />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Rezeptanzeige"
                                                secondary={
                                                    observedUser.showAllRecipes ? 'Alle' : 'Eigene'
                                                }
                                            />
                                        </ListItem>

                                        <ListItem button onClick={handleUserDocClick('muiTheme')}>
                                            <ListItemIcon>
                                                {observedUser.muiTheme === 'dark' ? (
                                                    <DarkThemeIcon />
                                                ) : (
                                                    <LightThemeIcon />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Design"
                                                secondary={
                                                    observedUser.muiTheme === 'dark'
                                                        ? 'Dunkel'
                                                        : 'Hell'
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Box flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <Button startIcon={<CloseIcon />} onClick={onDialogClose}>
                        Schließen
                    </Button>

                    <Button color="secondary" startIcon={<AccountIcon />} onClick={handleLogout}>
                        ausloggen
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}

export default AccountContentUser
