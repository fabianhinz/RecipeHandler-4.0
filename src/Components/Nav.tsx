/* eslint-disable react/no-multi-comp */
import {
  ButtonBase,
  Chip,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import clsx from 'clsx'
import { BookmarkMultiple, BookSearch, Cart, ChefHat, Lightbulb, PiggyBank } from 'mdi-material-ui'
import { useHistory, useLocation } from 'react-router-dom'

import { useBookmarkContext } from '@/Components/Provider/BookmarkProvider'
import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useSearchResultsContext } from '@/Components/Provider/SearchResultsProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { AlgoliaDocSearchRef } from '@/Components/Search/Search'

interface StyleProps {
  active?: boolean
}

const useStyles = makeStyles(theme => ({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    justifyContent: 'flex-start',
    transition: theme.transitions.create('top', {
      easing: theme.transitions.easing.easeOut,
    }),
    top: 'calc(env(safe-area-inset-top) + 64px)',
    bottom: 0,
    maxHeight: '100%',
    zIndex: theme.zIndex.appBar,
    width: 'calc(env(safe-area-inset-left) + 96px)',
    paddingLeft: 'env(safe-area-inset-left)',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    left: 0,
    borderRight: `1px solid ${
      theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'
    }`,
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(11),
    },
  },
  label: {
    fontWeight: 600,
    fontFamily: 'Ubuntu',
  },
  routeAwareColor: {
    color: ({ active }: StyleProps) =>
      active
        ? theme.palette.primary.main
        : theme.palette.type === 'light'
        ? 'rgba(0, 0, 0, 0.54)'
        : 'inherit',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 8,
    borderRadius: 0,
    height: 95,
    '@media (pointer: fine)': {
      '&:hover': {
        backgroundColor: ({ active }: StyleProps) =>
          active
            ? 'inherit'
            : theme.palette.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  drawerPaper: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    width: 320,
    display: 'flex',
    justifyContent: 'space-between',
  },
  listItem: {
    borderRadius: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  algoliaDocSearchRef: {
    padding: theme.spacing(2),
    paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

interface NavButtonProps {
  icon: JSX.Element
  pathname: string
  label: string
}

const NavButton = ({ pathname, label, icon }: NavButtonProps) => {
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles({ active: location.pathname === pathname })

  const handleClick = () => {
    if (location.pathname === pathname) return
    history.push(pathname)
  }

  return (
    <ButtonBase onClick={handleClick} className={clsx(classes.button, classes.routeAwareColor)}>
      {icon}
      <Typography variant="caption" className={classes.label}>
        {label}
      </Typography>
    </ButtonBase>
  )
}

const NavListItem = ({
  pathname,
  label,
  icon,
  secondary,
}: NavButtonProps & { secondary?: number }) => {
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles({ active: location.pathname === pathname })

  const handleClick = () => {
    if (location.pathname === pathname) return
    history.push(pathname)
  }

  return (
    <ListItem
      button
      className={clsx(classes.listItem, classes.routeAwareColor)}
      onClick={handleClick}>
      <ListItemIcon className={classes.routeAwareColor}>{icon}</ListItemIcon>
      <ListItemText classes={{ primary: classes.label }} primary={label} />
      {secondary ? (
        <ListItemSecondaryAction>
          <Chip label={secondary} />
        </ListItemSecondaryAction>
      ) : (
        <></>
      )}
    </ListItem>
  )
}

interface NavProps {
  drawerOpen: boolean
  onDrawerClose: () => void
}

const Nav = ({ drawerOpen, onDrawerClose }: NavProps) => {
  const classes = useStyles({})

  const { hits } = useSearchResultsContext()
  const { bookmarks } = useBookmarkContext()
  const { shoppingList, user } = useFirebaseAuthContext()
  const breakpointsContext = useBreakpointsContext()

  return (
    <>
      <Hidden xsDown>
        <nav className={classes.nav}>
          <NavButton icon={<BookIcon />} label="Rezepte" pathname={PATHS.home} />
          {breakpointsContext.mdUp === false && (
            <NavButton icon={<BookSearch />} label="Ergebnisse" pathname={PATHS.searchResults} />
          )}
          <NavButton icon={<BookmarkMultiple />} label="Lesezeichen" pathname={PATHS.bookmarks} />
          {user && (
            <>
              <NavButton icon={<Lightbulb />} label="Ideen" pathname={PATHS.trials} />
              <NavButton icon={<Cart />} label="Einkaufsliste" pathname={PATHS.shoppingList} />
              <NavButton icon={<PiggyBank />} label="Ausgaben" pathname={PATHS.expenses} />
              <NavButton icon={<ChefHat />} label="Kochverlauf" pathname={PATHS.cookingHistory} />
            </>
          )}
        </nav>
      </Hidden>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={onDrawerClose}
        PaperProps={{ className: classes.drawerPaper }}>
        <List disablePadding onClick={onDrawerClose}>
          <NavListItem pathname={PATHS.home} icon={<BookIcon />} label="Rezepte" />
          {breakpointsContext.mdUp === false && (
            <NavListItem
              pathname={PATHS.searchResults}
              icon={<BookSearch />}
              label="Ergebnisse"
              secondary={hits.length}
            />
          )}
          <NavListItem
            pathname={PATHS.bookmarks}
            icon={<BookmarkMultiple />}
            label="Lesezeichen"
            secondary={bookmarks.size}
          />
          {user && (
            <>
              <NavListItem pathname={PATHS.trials} icon={<Lightbulb />} label="Ideen" />

              <NavListItem
                pathname={PATHS.shoppingList}
                icon={<Cart />}
                label="Einkaufsliste"
                secondary={shoppingList.filter(item => !item.checked).length}
              />
              <NavListItem pathname={PATHS.expenses} icon={<PiggyBank />} label="Ausgaben" />
              <NavListItem icon={<ChefHat />} label="Kochverlauf" pathname={PATHS.cookingHistory} />
            </>
          )}
        </List>
        <div className={classes.algoliaDocSearchRef}>{AlgoliaDocSearchRef}</div>
      </Drawer>
    </>
  )
}

export default Nav
