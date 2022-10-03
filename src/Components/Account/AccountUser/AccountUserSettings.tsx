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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SearchIcon from '@material-ui/icons/SearchRounded'
import {
  CloudOffOutline,
  CloudSync,
  CogOutline,
  DatabaseSearch,
  Information,
} from 'mdi-material-ui'
import { useState } from 'react'

import { useGridContext } from '@/Components/Provider/GridProvider'
import StyledCard from '@/Components/Shared/StyledCard'
import { User } from '@/model/model'

import { UserSettingChangeHandler } from './AccountUser'

interface Props {
  user: User
  userDoc: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>
  onUserSettingChange: UserSettingChangeHandler
}

const AccountUserSettings = ({ user, onUserSettingChange }: Props) => {
  const [showInfo, setShowInfo] = useState(false)

  const { gridBreakpointProps } = useGridContext()

  return (
    <>
      <Grid item {...gridBreakpointProps}>
        <StyledCard
          header="Einstellungen"
          action={
            <IconButton onClick={() => setShowInfo(prev => !prev)}>
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
                        : user.muiTheme === 'black'
                        ? 'Schwarz'
                        : 'Hell'}
                    </Typography>
                    <Collapse in={showInfo}>
                      <Typography gutterBottom variant="body2" color="textSecondary">
                        Folgende Ausprägungen des Designs existieren: Dynamisch, Dunkel, Schwarz und
                        Hell
                      </Typography>
                    </Collapse>
                  </>
                }
              />
            </ListItem>
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
                    <Collapse in={showInfo}>
                      <Typography variant="body2" gutterBottom color="textSecondary">
                        Suchanfragen die mit <b>doppelten Anführungszeichen</b> starten und enden
                        werden als ganze Sätze interpretiert. Über den <b>Bindestrich</b> können
                        Wörter explizit aus der Suche ausgeschlossen werden.
                      </Typography>
                    </Collapse>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={onUserSettingChange('bookmarkSync')}>
              <ListItemIcon>{user.bookmarkSync ? <CloudSync /> : <CloudOffOutline />}</ListItemIcon>
              <ListItemText
                primary="Geräteübergreifende Lesezeichen"
                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                secondary={
                  <>
                    <Typography gutterBottom variant="body2" color="textSecondary">
                      {user.bookmarkSync ? 'aktiviert' : 'deaktiviert'}
                    </Typography>
                    <Collapse in={showInfo}>
                      <Typography variant="body2" gutterBottom color="textSecondary">
                        ist die Synchronisation aktiviert, so werden gesetzte Lesezeichen
                        automatisch auf Geräte, auf denen derselbe Nutzer eingeloggt ist,
                        übertragen.
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
