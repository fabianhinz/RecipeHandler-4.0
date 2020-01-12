import {
    Avatar,
    Button,
    CardActionArea,
    Collapse,
    createStyles,
    Divider,
    Grid,
    GridProps,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import SettingsIcon from '@material-ui/icons/AccountCircleTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import DarkThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import InfoIcon from '@material-ui/icons/InfoRounded'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffRounded'
import NotificationsIcon from '@material-ui/icons/NotificationsRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import SecurityIcon from '@material-ui/icons/SecurityTwoTone'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import { CameraImage, DatabaseSearch } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'

import useProgress from '../../hooks/useProgress'
import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import { useAttachmentDropzone } from '../Recipe/Create/Attachments/useAttachmentDropzone'
import RecipeCard from '../Recipe/RecipeCard'
import { Subtitle } from '../Shared/Subtitle'
import AccountAdmin from './AccountAdmin'
import AccountListItem from './AccountListItem'

const useStyles = makeStyles(theme =>
    createStyles({
        gridContainerAccount: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        avatar: {
            width: 220,
            height: 220,
        },
        actionArea: {
            borderRadius: '50%',
            width: 'fit-content',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

type SettingKeys = keyof Pick<
    User,
    'muiTheme' | 'selectedUsers' | 'showRecentlyAdded' | 'notifications' | 'algoliaAdvancedSyntax'
>

// ! ToDo split into multiple components
const AccountUser = () => {
    const [showInfo, setShowInfo] = useState(false)

    const { userIds } = useUsersContext()
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const { attachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })
    const { ProgressComponent, setProgress } = useProgress()

    // ? we won't load this component without an existing user - pinky promise -_-
    const { user } = useFirebaseAuthContext() as { user: User }

    const userDoc = useMemo(() => FirebaseService.firestore.collection('users').doc(user.uid), [
        user.uid,
    ])

    const breakpoints: Pick<GridProps, 'xs' | 'lg' | 'xl'> = useMemo(
        () => ({ xs: 12, lg: 6, xl: user.admin ? 4 : 6 }),
        [user]
    )

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

    useEffect(() => {
        if (!user.profilePicture) return
        Vibrant.from(user.profilePicture)
            .getPalette()
            .then(palette => console.log(`rgb(${palette.Muted!.getRgb().join(', ')})`))
    }, [user])

    const handleLogout = () => {
        setProgress(true)
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
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid
                    className={classes.gridContainerAccount}
                    container
                    spacing={4}
                    justify="center">
                    <Grid item xs="auto">
                        <CardActionArea
                            className={classes.actionArea}
                            {...dropzoneProps.getRootProps()}>
                            <Avatar className={classes.avatar} src={user.profilePicture}>
                                <CameraImage fontSize="large" />
                            </Avatar>
                            <input {...dropzoneProps.getInputProps()} />
                        </CardActionArea>
                    </Grid>
                    <Grid item xs="auto">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" display="inline">
                                    Willkommen zurück {user.username}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    startIcon={<InfoIcon />}
                                    onClick={() => setShowInfo(prev => !prev)}>
                                    Informationen {showInfo ? 'ausblenden' : 'einblenden'}
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    color="secondary"
                                    startIcon={<AccountIcon />}
                                    onClick={handleLogout}>
                                    ausloggen
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item {...breakpoints}>
                <RecipeCard
                    header={<Subtitle icon={<SettingsIcon />} text="Einstellungen" />}
                    content={
                        <List>
                            <ListItem button onClick={handleUserSettingChange('muiTheme')}>
                                <ListItemIcon>
                                    {user.muiTheme === 'dark' ? (
                                        <DarkThemeIcon />
                                    ) : (
                                        <LightThemeIcon />
                                    )}
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
                            <ListItem button onClick={handleUserSettingChange('showRecentlyAdded')}>
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
                                                    Je nach Bildschirmgröße werden die neuesten
                                                    Rezepte unabhängig von Autor oder Filterung
                                                    durch die Kategorien angezeigt.
                                                </Typography>
                                            </Collapse>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={handleUserSettingChange('notifications')}>
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
                                                    Sofern <s>unterstützt</s> entwickelt 🤖erhälst
                                                    du Benachrichtigungen zu neuen Kommentaren und
                                                    Rezepten.
                                                </Typography>
                                            </Collapse>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem
                                button
                                onClick={handleUserSettingChange('algoliaAdvancedSyntax')}>
                                <ListItemIcon>
                                    {user.algoliaAdvancedSyntax ? (
                                        <DatabaseSearch />
                                    ) : (
                                        <SearchIcon />
                                    )}
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
                                                    <b>doppelten Anführungszeichen</b> starten und
                                                    enden werden als ganze Sätze interpretiert. Über
                                                    den <b>Bindestrich</b> können Wörter explizit
                                                    aus der Suche ausgeschlossen werden.
                                                </Typography>
                                            </Collapse>
                                        </>
                                    }
                                />
                            </ListItem>
                        </List>
                    }
                />
            </Grid>

            <Grid item {...breakpoints}>
                <RecipeCard
                    header={<Subtitle icon={<BookIcon />} text="Rezeptanzeige" />}
                    content={
                        <List>
                            {userIds.map(id => (
                                <AccountListItem
                                    key={id}
                                    uid={id}
                                    variant="user"
                                    checked={user.selectedUsers.some(
                                        selectedId => selectedId === id
                                    )}
                                    onChange={handleUserSettingChange('selectedUsers')}
                                />
                            ))}
                        </List>
                    }
                />
            </Grid>

            {user.admin && (
                <Grid item {...breakpoints}>
                    <RecipeCard
                        header={<Subtitle text="Editoren" icon={<SecurityIcon />} />}
                        content={<AccountAdmin />}
                    />
                </Grid>
            )}

            <ProgressComponent />
        </Grid>
    )
}

export default AccountUser
