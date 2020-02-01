import {
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TypographyProps,
} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/AccountCircleTwoTone'
import DynamicThemeIcon from '@material-ui/icons/BrightnessAutoRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOffRounded'
import NotificationsIcon from '@material-ui/icons/NotificationsRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import TimelapseIcon from '@material-ui/icons/TimelapseRounded'
import { DatabaseSearch } from 'mdi-material-ui'
import React from 'react'

import { User } from '../../../model/model'
import StyledCard from '../../Shared/RecipeCard'
import { Subtitle } from '../../Shared/Subtitle'
import { UserSettingChangeHandler } from './AccountUser'

interface Props {
    onUserSettingChange: UserSettingChangeHandler
    showInfo: boolean
    user: User
}

const AccountUserSettings = ({ onUserSettingChange, showInfo, user }: Props) => {
    return (
        <StyledCard
            transitionOrder={2}
            header={<Subtitle icon={<SettingsIcon />} text="Einstellungen" />}
            content={
                <List>
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
                                    <Collapse in={showInfo}>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            Den Augen zu liebe gibt es ein sogenanntes{' '}
                                            <i>Darktheme</i>. Dem Nutzer zuliebe auch ein{' '}
                                            <i>Lighttheme</i>. Bei <i>Dynamisch</i> entscheidet das
                                            Betriebssystem über das Design.
                                        </Typography>
                                    </Collapse>
                                </>
                            }
                        />
                    </ListItem>
                    <Divider />
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
                                    <Collapse in={showInfo}>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            Je nach Bildschirmgröße werden die neuesten Rezepte
                                            unabhängig von Autor oder Filterung durch die Kategorien
                                            angezeigt.
                                        </Typography>
                                    </Collapse>
                                </>
                            }
                        />
                    </ListItem>
                    <Divider />
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
                                    <Collapse in={showInfo}>
                                        <Typography
                                            gutterBottom
                                            variant="body2"
                                            color="textSecondary">
                                            Sofern <s>unterstützt</s> entwickelt 🤖erhälst du
                                            Benachrichtigungen zu neuen Kommentaren und Rezepten.
                                        </Typography>
                                    </Collapse>
                                </>
                            }
                        />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={onUserSettingChange('algoliaAdvancedSyntax')}>
                        <ListItemIcon>
                            {user.algoliaAdvancedSyntax ? <DatabaseSearch /> : <SearchIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary="erweiterte Abfragesyntax"
                            secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                            secondary={
                                <>
                                    <Typography gutterBottom variant="body2" color="textSecondary">
                                        {user.algoliaAdvancedSyntax ? 'aktiviert' : 'deaktiviert'}
                                    </Typography>
                                    <Collapse in={showInfo}>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                            color="textSecondary">
                                            Suchanfragen die mit <b>doppelten Anführungszeichen</b>{' '}
                                            starten und enden werden als ganze Sätze interpretiert.
                                            Über den <b>Bindestrich</b> können Wörter explizit aus
                                            der Suche ausgeschlossen werden.
                                        </Typography>
                                    </Collapse>
                                </>
                            }
                        />
                    </ListItem>
                </List>
            }
        />
    )
}

export default AccountUserSettings
