import {
    Avatar,
    Box,
    Button,
    CardActionArea,
    Collapse,
    createStyles,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import InfoIcon from '@material-ui/icons/InfoRounded'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffRounded'
import NotificationsIcon from '@material-ui/icons/NotificationsRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import { CameraImage, DatabaseSearch, Settings, ShieldLock } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import SwipeableViews from 'react-swipeable-views'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import { useAttachmentDropzone } from '../Recipe/Create/Attachments/useAttachmentDropzone'
import AccountContentAdmin from './AccountContentAdmin'
import { AccountContentProps } from './AccountDialog'
import AccountListItem from './AccountListItem'

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
        dialogContent: {
            paddingTop: 0,
            position: 'relative',
        },
        tabs: {
            [theme.breakpoints.up('md')]: {
                position: 'sticky',
                top: 0,
                backgroundColor: theme.palette.background.paper,
                zIndex: 1,
                boxShadow: theme.shadows[1],
            },
        },
        listSubheader: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

type SettingKeys = keyof Pick<
    User,
    'muiTheme' | 'selectedUsers' | 'showRecentlyAdded' | 'notifications' | 'algoliaAdvancedSyntax'
>

interface Props extends AccountContentProps {
    user: User
}
// ! ToDo split into multiple components
const AccountContentUser = ({ user, onDialogLoading, onDialogClose }: Props) => {
    const [tabValue, setTabValue] = useState(0)
    const { attachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })
    const { enqueueSnackbar } = useSnackbar()
    const classes = useStyles()
    const { isDialogFullscreen } = useBreakpointsContext()

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

    const handleUserSettingChange = (key: SettingKeys) => (uid?: any) => {
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
            case 'notifications': {
                userDoc.update({ [key]: !user.notifications })
                break
            }
            case 'algoliaAdvancedSyntax': {
                userDoc.update({ [key]: !user.algoliaAdvancedSyntax })
            }
        }
    }

    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <Tabs
                    className={classes.tabs}
                    value={tabValue}
                    onChange={(_event, value) => setTabValue(value)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth">
                    <Tab label={user.username} icon={<Settings />} />
                    {user.admin && <Tab label="Editoren" icon={<ShieldLock />} />}
                </Tabs>

                <SwipeableViews
                    animateHeight={!isDialogFullscreen}
                    className={classes.swipeableViews}
                    index={tabValue}
                    disabled={!user.admin}
                    onChangeIndex={index => setTabValue(index)}>
                    <UserSettings
                        user={user}
                        dropzoneProps={dropzoneProps}
                        onSettingChange={handleUserSettingChange}
                    />
                    {user.admin ? <AccountContentAdmin onDialogLoading={onDialogLoading} /> : <></>}
                </SwipeableViews>
            </DialogContent>

            <DialogActions>
                <Button startIcon={<CloseIcon />} onClick={onDialogClose}>
                    Schließen
                </Button>

                <Button color="secondary" startIcon={<AccountIcon />} onClick={handleLogout}>
                    ausloggen
                </Button>
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
    onSettingChange: (key: SettingKeys) => (uid?: any) => void
}

const UserSettings = ({ user, dropzoneProps, onSettingChange }: UserSettingsProps) => {
    const [showInfo, setShowInfo] = useState(false)
    const { userIds } = useUsersContext()
    const classes = useStyles()

    return (
        <Box padding={1}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
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

                <Grid item xs={12}>
                    <List>
                        <ListSubheader className={classes.listSubheader}>
                            Einstellungen
                            <IconButton onClick={() => setShowInfo(prev => !prev)}>
                                <InfoIcon />
                            </IconButton>
                        </ListSubheader>
                        <ListItem button onClick={onSettingChange('muiTheme')}>
                            <ListItemIcon>
                                {user.muiTheme === 'dark' ? <DarkThemeIcon /> : <LightThemeIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary="Design"
                                secondaryTypographyProps={{ component: 'div' }}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.muiTheme === 'dark' ? 'Dunkel' : 'Hell'}
                                        </Typography>
                                        <Collapse in={showInfo}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Den Augen zu liebe gibt es ein sogenanntes{' '}
                                                <i>Darktheme</i>. Dem Nutzer zuliebe auch ein{' '}
                                                <i>Lighttheme</i>.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={onSettingChange('showRecentlyAdded')}>
                            <ListItemIcon>
                                <TimelapseIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Kürzlich hinzugefügte Rezepte"
                                secondaryTypographyProps={{ component: 'div' }}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.showRecentlyAdded
                                                ? 'werden angezeigt'
                                                : 'werden ausgeblendet'}
                                        </Typography>
                                        <Collapse in={showInfo}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Je nach Bildschirmgröße werden die neuesten Rezepte
                                                unabhängig von Autor oder Filterung durch die
                                                Kategorien angezeigt.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={onSettingChange('notifications')}>
                            <ListItemIcon>
                                {user.notifications ? (
                                    <NotificationsIcon />
                                ) : (
                                    <NotificationsOffIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary="Benachrichtigungen"
                                secondaryTypographyProps={{ component: 'div' }}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.notifications ? 'aktiviert' : 'deaktiviert'}
                                        </Typography>
                                        <Collapse in={showInfo}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Sofern <s>unterstützt</s> entwickelt 🤖erhälst du
                                                Benachrichtigungen zu neuen Kommentaren und
                                                Rezepten.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={onSettingChange('algoliaAdvancedSyntax')}>
                            <ListItemIcon>
                                {user.algoliaAdvancedSyntax ? <DatabaseSearch /> : <SearchIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary="erweiterte Abfragesyntax"
                                secondaryTypographyProps={{ component: 'div' }}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.algoliaAdvancedSyntax
                                                ? 'aktiviert'
                                                : 'deaktiviert'}
                                        </Typography>
                                        <Collapse in={showInfo}>
                                            <Typography
                                                variant="body2"
                                                gutterBottom
                                                color="textSecondary">
                                                Suchanfragen die mit{' '}
                                                <b>doppelten Anführungszeichen</b> starten und enden
                                                werden als ganze Sätze interpretiert. Über den{' '}
                                                <b>Bindestrich</b> können Wörter explizit aus der
                                                Suche ausgeschlossen werden.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>

                        <ListSubheader>Rezeptanzeige</ListSubheader>
                        {userIds.map(id => (
                            <AccountListItem
                                key={id}
                                uid={id}
                                variant="user"
                                checked={user.selectedUsers.some(selectedId => selectedId === id)}
                                onChange={onSettingChange('selectedUsers')}
                            />
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}
