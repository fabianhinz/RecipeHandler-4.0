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
import SearchIcon from '@material-ui/icons/SearchRounded'
import {
  CloudOffOutline,
  CloudSync,
  CogOutline,
  DatabaseSearch,
  Information,
} from 'mdi-material-ui'
import { useState } from 'react'

import { useGridContext } from '../../Provider/GridProvider'
import StyledCard from '../../Shared/StyledCard'
import { accountHooks } from '../helper/accountHooks'

const AccountUserSettings = () => {
  const [showInfo, setShowInfo] = useState(false)

  const gridContext = useGridContext()

  const authenticatedUser = accountHooks.useAuthenticatedUser()
  const userSettingChange = accountHooks.useUserSettingChange()

  return (
    <>
      <Grid item {...gridContext.gridBreakpointProps}>
        <StyledCard
          header="Einstellungen"
          action={
            <IconButton onClick={() => setShowInfo(prev => !prev)}>
              <Information />
            </IconButton>
          }
          BackgroundIcon={CogOutline}>
          <List disablePadding>
            <ListItem button onClick={userSettingChange('muiTheme')}>
              <ListItemIcon>
                {authenticatedUser.muiTheme === 'dynamic' ? (
                  <DynamicThemeIcon />
                ) : authenticatedUser.muiTheme === 'dark' ? (
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
                      {authenticatedUser.muiTheme === 'dynamic'
                        ? 'Dynamisch'
                        : authenticatedUser.muiTheme === 'dark'
                        ? 'Dunkel'
                        : authenticatedUser.muiTheme === 'black'
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
            <ListItem button onClick={userSettingChange('algoliaAdvancedSyntax')}>
              <ListItemIcon>
                {authenticatedUser.algoliaAdvancedSyntax ? <DatabaseSearch /> : <SearchIcon />}
              </ListItemIcon>
              <ListItemText
                primary="Erweiterte Abfragesyntax"
                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                secondary={
                  <>
                    <Typography gutterBottom variant="body2" color="textSecondary">
                      {authenticatedUser.algoliaAdvancedSyntax ? 'aktiviert' : 'deaktiviert'}
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
            <ListItem button onClick={userSettingChange('bookmarkSync')}>
              <ListItemIcon>
                {authenticatedUser.bookmarkSync ? <CloudSync /> : <CloudOffOutline />}
              </ListItemIcon>
              <ListItemText
                primary="Geräteübergreifende Lesezeichen"
                secondaryTypographyProps={{ component: 'div' } as TypographyProps}
                secondary={
                  <>
                    <Typography gutterBottom variant="body2" color="textSecondary">
                      {authenticatedUser.bookmarkSync ? 'aktiviert' : 'deaktiviert'}
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
