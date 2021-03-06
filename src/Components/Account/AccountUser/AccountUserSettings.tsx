import {
    Collapse,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TypographyProps,
} from '@material-ui/core'
import DynamicThemeIcon from '@material-ui/icons/BrightnessAutoRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import FavoriteIcon from '@material-ui/icons/Favorite'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffRounded'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NotificationsIcon from '@material-ui/icons/NotificationsRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import {
    CloudOffOutline,
    CloudSync,
    CogOutline,
    DatabaseSearch,
    Information,
    StarCircle,
} from 'mdi-material-ui'
import React, { useState } from 'react'

import { User } from '../../../model/model'
import { useGridContext } from '../../Provider/GridProvider'
import StyledCard from '../../Shared/StyledCard'
import { UserSettingChangeHandler } from './AccountUser'

interface Props {
    user: User
    userDoc: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>
    onUserSettingChange: UserSettingChangeHandler
}

const AccountUserSettings = ({ user, onUserSettingChange }: Props) => {
    const [showInfoView, setShowInfoView] = useState(false)
    const [showInfoOther, setShowInfoOther] = useState(false)

    const { gridBreakpointProps } = useGridContext()

    return (
        <>
            <Grid item {...gridBreakpointProps}>
                <StyledCard
                    header="Anzeige"
                    action={
                        <IconButton onClick={() => setShowInfoView(prev => !prev)}>
                            <Information />
                        </IconButton>
                    }
                    BackgroundIcon={CogOutline}>
                    <List disablePadding>
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
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.muiTheme === 'dynamic'
                                                ? 'Dynamisch'
                                                : user.muiTheme === 'dark'
                                                ? 'Dunkel'
                                                : user.muiTheme === 'black'
                                                ? 'Schwarz'
                                                : 'Hell'}
                                        </Typography>
                                        <Collapse in={showInfoView}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Folgende Ausprägungen des Designs existieren:
                                                Dynamisch, Dunkel, Schwarz und Hell
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" />
                        <ListItem button onClick={onUserSettingChange('showNew')}>
                            <ListItemIcon>
                                <StarCircle />
                            </ListItemIcon>
                            <ListItemText
                                primary="Neue Rezepte"
                                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.showNew
                                                ? 'werden angezeigt'
                                                : 'werden ausgeblendet'}
                                        </Typography>
                                        <Collapse in={showInfoView}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Je nach Bildschirmgröße werden neue Rezepte
                                                unabhängig von Autor oder Filterung durch die
                                                Kategorien angezeigt.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" />
                        <ListItem button onClick={onUserSettingChange('showMostCooked')}>
                            <ListItemIcon>
                                <FavoriteIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Häufig gekochte Rezepte"
                                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.showMostCooked
                                                ? 'werden angezeigt'
                                                : 'werden ausgeblendet'}
                                        </Typography>
                                        <Collapse in={showInfoView}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Je nach Bildschirmgröße werden die am häufigsten
                                                gekochte Rezepte unabhängig von Autor oder Filterung
                                                durch die Kategorien angezeigt.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" />
                        <ListItem button onClick={onUserSettingChange('showRecentlyEdited')}>
                            <ListItemIcon>
                                <TimelapseIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Kürzlich bearbeitete Rezepte"
                                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.showRecentlyEdited
                                                ? 'werden angezeigt'
                                                : 'werden ausgeblendet'}
                                        </Typography>
                                        <Collapse in={showInfoView}>
                                            <Typography
                                                gutterBottom
                                                variant="body2"
                                                color="textSecondary">
                                                Je nach Bildschirmgröße werden kürzlich bearbeitete
                                                Rezepte unabhängig von Autor oder Filterung durch
                                                die Kategorien angezeigt.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                    </List>
                </StyledCard>
            </Grid>

            <Grid item {...gridBreakpointProps}>
                <StyledCard
                    header="Sonstiges"
                    action={
                        <IconButton onClick={() => setShowInfoOther(prev => !prev)}>
                            <Information />
                        </IconButton>
                    }
                    BackgroundIcon={CogOutline}>
                    <List disablePadding>
                        {/* <ListItem button onClick={onUserSettingChange('notifications')}>
                            <ListItemIcon>
                                {user.notifications ? (
                                    <NotificationsIcon />
                                ) : (
                                    <NotificationsOffIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary="Benachrichtigungen"
                                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                                secondary={
                                    <>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.notifications ? 'aktiviert' : 'deaktiviert'}
                                        </Typography>
                                        <Collapse in={showInfoOther}>
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
                        <Divider variant="inset" /> */}
                        <ListItem button onClick={onUserSettingChange('algoliaAdvancedSyntax')}>
                            <ListItemIcon>
                                {user.algoliaAdvancedSyntax ? <DatabaseSearch /> : <SearchIcon />}
                            </ListItemIcon>
                            <ListItemText
                                primary="Erweiterte Abfragesyntax"
                                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
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
                                        <Collapse in={showInfoOther}>
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
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            {user.bookmarkSync ? 'aktiviert' : 'deaktiviert'}
                                        </Typography>
                                        <Collapse in={showInfoOther}>
                                            <Typography
                                                variant="body2"
                                                gutterBottom
                                                color="textSecondary">
                                                ist die Synchronisation aktiviert, so werden
                                                gesetzte Lesezeichen automatisch auf Geräte, auf
                                                denen derselbe Nutzer eingeloggt ist, übertragen.
                                            </Typography>
                                        </Collapse>
                                    </>
                                }
                            />
                        </ListItem>
                    </List>
                </StyledCard>
            </Grid>
        </>
    )
}

export default AccountUserSettings
