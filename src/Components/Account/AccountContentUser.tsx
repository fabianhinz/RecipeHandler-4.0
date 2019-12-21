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
    Tab,
    Tabs,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import { CameraImage } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'
import { useAttachmentDropzone } from '../Recipe/Create/Attachments/useAttachmentDropzone'
import AccountChip from './AccountChip'
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
        swipeableViews: {
            marginTop: theme.spacing(3),
        },
    })
)

interface Props extends AccountContentProps {
    user: User
}

const AccountContentUser = ({ user, onDialogLoading, onDialogClose }: Props) => {
    const [tabValue, setTabValue] = useState(0)
    const { userIds } = useUsersContext()
    const { attachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })
    const { enqueueSnackbar } = useSnackbar()
    const classes = useStyles()

    const userDoc = useMemo(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

    useEffect(() => {
        if (attachments.length > 0) {
            const { dataUrl, size } = attachments[0]
            if (size > 500000) {
                enqueueSnackbar('Maximale Größe überschritten (500kb)', { variant: 'warning' })
            } else {
                userDoc.update({ profilePicture: dataUrl })
            }
        }
    }, [attachments, enqueueSnackbar, userDoc])

    const handleLogout = () => {
        onDialogLoading(true)
        FirebaseService.auth
            .signOut()
            .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    const handleUserDocClick = (
        key: keyof Pick<User, 'muiTheme' | 'selectedUsers' | 'showRecentlyAdded'>
    ) => (uid?: any) => {
        switch (key) {
            case 'muiTheme': {
                userDoc.update({ [key]: user.muiTheme === 'dark' ? 'light' : 'dark' })
                break
            }
            case 'selectedUsers': {
                if (typeof uid !== 'string') throw new Error('whoops we need a string for this')
                let selectedIds = [...user.selectedUsers]
                // ToDo max length of selected users must be 10
                if (selectedIds.some(id => id === uid)) {
                    selectedIds = selectedIds.filter(id => id !== uid)
                } else {
                    selectedIds.push(uid)
                }

                userDoc.update({ [key]: selectedIds })
                break
            }
            case 'showRecentlyAdded': {
                userDoc.update({ [key]: !user.showRecentlyAdded })
                break
            }
        }
    }

    return (
        <>
            <DialogContent>
                <Tabs
                    value={tabValue}
                    onChange={(_event, value) => setTabValue(value)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth">
                    <Tab label={user.username} />
                    {user.admin && <Tab label="Editoren" />}
                </Tabs>

                <SwipeableViews
                    className={classes.swipeableViews}
                    index={tabValue}
                    onChangeIndex={index => setTabValue(index)}>
                    <Box padding={0.5}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} sm={4} md={12}>
                                <Grid container justify="center">
                                    <CardActionArea
                                        className={classes.actionArea}
                                        {...dropzoneProps.getRootProps()}>
                                        <Avatar
                                            className={classes.avatar}
                                            src={user.profilePicture}>
                                            <CameraImage fontSize="large" />
                                        </Avatar>
                                        <input {...dropzoneProps.getInputProps()} />
                                    </CardActionArea>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={8} md={12}>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Rezeptanzeige"
                                            secondaryTypographyProps={{ component: 'div' }}
                                            secondary={
                                                <Grid container spacing={1}>
                                                    {userIds.map(id => (
                                                        <Grid item key={id}>
                                                            <AccountChip
                                                                variant="filter"
                                                                selected={user.selectedUsers.some(
                                                                    selectedId => selectedId === id
                                                                )}
                                                                onFilterChange={handleUserDocClick(
                                                                    'selectedUsers'
                                                                )}
                                                                uid={id}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={handleUserDocClick('muiTheme')}>
                                        <ListItemIcon>
                                            {user.muiTheme === 'dark' ? (
                                                <DarkThemeIcon />
                                            ) : (
                                                <LightThemeIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Design"
                                            secondary={user.muiTheme === 'dark' ? 'Dunkel' : 'Hell'}
                                        />
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        button
                                        onClick={handleUserDocClick('showRecentlyAdded')}>
                                        <ListItemIcon>
                                            <TimelapseIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Kürzlich hinzugefügte Rezepte"
                                            secondary={
                                                user.showRecentlyAdded
                                                    ? 'werden angezeigt'
                                                    : 'werden ausgeblendet'
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Box>
                    {user.admin ? <AccountContentAdmin onDialogLoading={onDialogLoading} /> : <></>}
                </SwipeableViews>
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
