import {
    Avatar,
    CardActionArea,
    Chip,
    Collapse,
    createStyles,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Typography,
    TypographyProps,
} from '@material-ui/core'
import DynamicThemeIcon from '@material-ui/icons/BrightnessAutoRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffRounded'
import NotificationsIcon from '@material-ui/icons/NotificationsRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import TimelineIcon from '@material-ui/icons/TimelineRounded'
import {
    CameraImage,
    CloudOffOutline,
    CloudSync,
    DatabaseSearch,
    Information,
    SettingsOutline,
} from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { User } from '../../../model/model'
import { useAttachmentDropzone } from '../../Recipe/Create/Attachments/useAttachmentDropzone'
import StyledCard from '../../Shared/StyledCard'
import { UserSettingChangeHandler } from './AccountUser'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            [theme.breakpoints.down('sm')]: {
                width: 180,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 225,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 300,
                height: 300,
            },
        },
        actionArea: {
            borderRadius: '50%',
            width: 'fit-content',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        profilePictureItem: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
)

type UserSettingsProps = Pick<AccountUserHeaderProps, 'user' | 'onUserSettingChange'>

const UserStettings = ({ user, onUserSettingChange }: UserSettingsProps) => {
    const [info, setInfo] = useState(false)

    return (
        <List>
            <ListSubheader>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item>Informationen</Grid>
                    <Grid item>
                        <IconButton onClick={() => setInfo(prev => !prev)}>
                            <Information />
                        </IconButton>
                    </Grid>
                </Grid>
            </ListSubheader>
            <ListItem button onClick={onUserSettingChange('muiTheme')}>
                <ListItemIcon>
                    {user.muiTheme === 'dynamic' ? (
                        <DynamicThemeIcon />
                    ) : user.muiTheme === 'dark' ? (
                        <DarkThemeIcon />
                    ) : (
                        <LightThemeIcon />
                    )}
                </ListItemIcon>
                <ListItemText
                    primary="Design"
                    secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                    secondary={
                        <>
                            <Typography gutterBottom variant="body2" color="textSecondary">
                                {user.muiTheme === 'dynamic'
                                    ? 'Dynamisch'
                                    : user.muiTheme === 'dark'
                                    ? 'Dunkel'
                                    : 'Hell'}
                            </Typography>
                            <Collapse in={info}>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Den Augen zu liebe gibt es ein sogenanntes <i>Darktheme</i>. Dem
                                    Nutzer zuliebe auch ein <i>Lighttheme</i>. Bei <i>Dynamisch</i>{' '}
                                    entscheidet das Betriebssystem über das Design.
                                </Typography>
                            </Collapse>
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={onUserSettingChange('showRecentlyAdded')}>
                <ListItemIcon>
                    <TimelapseIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Kürzlich hinzugefügte Rezepte"
                    secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                    secondary={
                        <>
                            <Typography gutterBottom variant="body2" color="textSecondary">
                                {user.showRecentlyAdded
                                    ? 'werden angezeigt'
                                    : 'werden ausgeblendet'}
                            </Typography>
                            <Collapse in={info}>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Je nach Bildschirmgröße werden die neuesten Rezepte unabhängig
                                    von Autor oder Filterung durch die Kategorien angezeigt.
                                </Typography>
                            </Collapse>
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={onUserSettingChange('notifications')}>
                <ListItemIcon>
                    {user.notifications ? <NotificationsIcon /> : <NotificationsOffIcon />}
                </ListItemIcon>
                <ListItemText
                    primary="Benachrichtigungen"
                    secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                    secondary={
                        <>
                            <Typography gutterBottom variant="body2" color="textSecondary">
                                {user.notifications ? 'aktiviert' : 'deaktiviert'}
                            </Typography>
                            <Collapse in={info}>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Sofern <s>unterstützt</s> entwickelt 🤖erhälst du
                                    Benachrichtigungen zu neuen Kommentaren und Rezepten.
                                </Typography>
                            </Collapse>
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={onUserSettingChange('algoliaAdvancedSyntax')}>
                <ListItemIcon>
                    {user.algoliaAdvancedSyntax ? <DatabaseSearch /> : <SearchIcon />}
                </ListItemIcon>
                <ListItemText
                    primary="Erweiterte Abfragesyntax"
                    secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                    secondary={
                        <>
                            <Typography gutterBottom variant="body2" color="textSecondary">
                                {user.algoliaAdvancedSyntax ? 'aktiviert' : 'deaktiviert'}
                            </Typography>
                            <Collapse in={info}>
                                <Typography variant="body2" gutterBottom color="textSecondary">
                                    Suchanfragen die mit <b>doppelten Anführungszeichen</b> starten
                                    und enden werden als ganze Sätze interpretiert. Über den{' '}
                                    <b>Bindestrich</b> können Wörter explizit aus der Suche
                                    ausgeschlossen werden.
                                </Typography>
                            </Collapse>
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={onUserSettingChange('bookmarkSync')}>
                <ListItemIcon>
                    {user.bookmarkSync ? <CloudSync /> : <CloudOffOutline />}
                </ListItemIcon>
                <ListItemText
                    primary="Geräteübergreifende Lesezeichen"
                    secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                    secondary={
                        <>
                            <Typography gutterBottom variant="body2" color="textSecondary">
                                {user.bookmarkSync ? 'aktiviert' : 'deaktiviert'}
                            </Typography>
                            <Collapse in={info}>
                                <Typography variant="body2" gutterBottom color="textSecondary">
                                    ist die Synchronisation aktiviert, so werden gesetzte
                                    Lesezeichen automatisch auf Geräte, auf denen derselbe Nutzer
                                    eingeloggt ist, übertragen.
                                </Typography>
                            </Collapse>
                        </>
                    }
                />
            </ListItem>
        </List>
    )
}

interface AccountUserHeaderProps {
    user: User
    userDoc: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    onUserSettingChange: UserSettingChangeHandler
}

const AccountUserHeader = ({ user, userDoc, onUserSettingChange }: AccountUserHeaderProps) => {
    const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })
    const { enqueueSnackbar } = useSnackbar()

    const classes = useStyles()

    useEffect(() => {
        if (dropzoneAttachments.length > 0) {
            const { dataUrl, size } = dropzoneAttachments[0]
            if (size > 500000) {
                enqueueSnackbar('Maximale Größe überschritten (500kb)', { variant: 'warning' })
            } else {
                userDoc.update({ profilePicture: dataUrl })
            }
        }
    }, [dropzoneAttachments, enqueueSnackbar, userDoc])

    return (
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={12}>
                <Grid container spacing={1} justify="space-between">
                    <Grid item xs="auto">
                        <Typography variant="h4" display="inline">
                            Willkommen zurück {user.username}
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <Chip
                            onClick={() => alert('ToDo Miwri ;)')}
                            icon={<TimelineIcon />}
                            label={__VERSION__}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <StyledCard BackgroundIcon={SettingsOutline}>
                    <Grid container spacing={3}>
                        <Grid className={classes.profilePictureItem} item xs={12} md={4}>
                            <CardActionArea
                                className={classes.actionArea}
                                {...dropzoneProps.getRootProps()}>
                                <Avatar className={classes.avatar} src={user.profilePicture}>
                                    <CameraImage fontSize="large" />
                                </Avatar>
                                <input {...dropzoneProps.getInputProps()} />
                            </CardActionArea>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <UserStettings user={user} onUserSettingChange={onUserSettingChange} />
                        </Grid>
                    </Grid>
                </StyledCard>
            </Grid>
        </Grid>
    )
}

export default AccountUserHeader
