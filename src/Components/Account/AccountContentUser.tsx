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
    ListSubheader,
    makeStyles,
    Tab,
    Tabs,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import AdminIcon from '@material-ui/icons/SecurityRounded'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import { CameraImage, Settings, ShieldLock } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
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

type SettingKeys = keyof Pick<User, 'muiTheme' | 'selectedUsers' | 'showRecentlyAdded'>

interface Props extends AccountContentProps {
    user: User
}

const AccountContentUser = ({ user, onDialogLoading, onDialogClose }: Props) => {
    const [tabValue, setTabValue] = useState(0)
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

    const handleUserDocClick = (key: SettingKeys) => (uid?: any) => {
        switch (key) {
            case 'muiTheme': {
                userDoc.update({ [key]: user.muiTheme === 'dark' ? 'light' : 'dark' })
                break
            }
            case 'selectedUsers': {
                if (typeof uid !== 'string') throw new Error('whoops we need a string for this')

                let selectedIds = [...user.selectedUsers]
                const idExists = selectedIds.some(id => id === uid)

                if (idExists && selectedIds.length > 1) {
                    selectedIds = selectedIds.filter(id => id !== uid)
                } else if (!idExists && selectedIds.length < 10) {
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
                    <Tab label={user.username} icon={<Settings />} />
                    {user.admin && <Tab label="Editoren" icon={<ShieldLock />} />}
                </Tabs>

                <SwipeableViews
                    className={classes.swipeableViews}
                    index={tabValue}
                    onChangeIndex={index => setTabValue(index)}>
                    <UserSettings
                        user={user}
                        dropzoneProps={dropzoneProps}
                        onUserDocClick={handleUserDocClick}
                    />
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

interface UserSettingsProps {
    user: User
    dropzoneProps: {
        getRootProps: (props?: DropzoneRootProps | undefined) => DropzoneRootProps
        getInputProps: (props?: DropzoneInputProps | undefined) => DropzoneInputProps
    }
    onUserDocClick: (key: SettingKeys) => (uid?: any) => void
}

const UserSettings = ({ user, dropzoneProps, onUserDocClick }: UserSettingsProps) => {
    const { userIds } = useUsersContext()
    const classes = useStyles()

    return (
        <Box padding={1}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4} md={12}>
                    <Grid container justify="center">
                        <CardActionArea
                            className={classes.actionArea}
                            {...dropzoneProps.getRootProps()}>
                            <Avatar className={classes.avatar} src={user.profilePicture}>
                                <CameraImage fontSize="large" />
                            </Avatar>
                            <input {...dropzoneProps.getInputProps()} />
                        </CardActionArea>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={8} md={12}>
                    <List>
                        <ListSubheader>Einstellungen</ListSubheader>
                        <ListItem button onClick={onUserDocClick('muiTheme')}>
                            <ListItemIcon>
                                {user.muiTheme === 'dark' ? <DarkThemeIcon /> : <LightThemeIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary="Design"
                                secondary={user.muiTheme === 'dark' ? 'Dunkel' : 'Hell'}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={onUserDocClick('showRecentlyAdded')}>
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

                        <ListSubheader>Rezeptanzeige</ListSubheader>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Grid container spacing={1}>
                                        {userIds.map(id => (
                                            <Grid item key={id}>
                                                <AccountChip
                                                    variant="filter"
                                                    selected={user.selectedUsers.some(
                                                        selectedId => selectedId === id
                                                    )}
                                                    onFilterChange={onUserDocClick('selectedUsers')}
                                                    uid={id}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                }
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}
