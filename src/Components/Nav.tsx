import { ButtonBase, createStyles, makeStyles, Typography } from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import { BookmarkMultiple, Cart, Lightbulb } from 'mdi-material-ui'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { PATHS } from './Routes/Routes'

interface StyleProps {
    active?: boolean
}

// Todo save-env-area
const useStyles = makeStyles(theme =>
    createStyles({
        nav: {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            justifyContent: 'flex-start',
            top: 64,
            zIndex: theme.zIndex.appBar,
            width: 95,
            height: 'calc(100% - 64px)',
            overflowY: 'auto',
            backgroundColor: theme.palette.background.paper,
            left: 0,
        },
        label: { fontWeight: 600, fontFamily: 'Ubuntu' },
        button: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 8,
            borderRadius: 0,
            color: ({ active }: StyleProps) => (active ? theme.palette.primary.main : 'inherit'),
            height: 95,
        },
    })
)

interface Props {
    icon: JSX.Element
    pathname: string
    label: string
}

const NavButton = ({ pathname, label, icon }: Props) => {
    const history = useHistory()
    const location = useLocation()
    const classes = useStyles({ active: location.pathname === pathname })

    return (
        <ButtonBase onClick={() => history.push(pathname)} className={classes.button}>
            {icon}
            <Typography variant="caption" className={classes.label}>
                {label}
            </Typography>
        </ButtonBase>
    )
}

const Nav = () => {
    const classes = useStyles({})

    return (
        <nav className={classes.nav}>
            <NavButton icon={<BookIcon />} label="Rezepte" pathname={PATHS.home} />
            <NavButton icon={<Lightbulb />} label="Ideen" pathname={PATHS.trials} />
            <NavButton icon={<BookmarkMultiple />} label="Lesezeichen" pathname={PATHS.bookmarks} />
            <NavButton icon={<Cart />} label="Einkaufsliste" pathname={PATHS.shoppingList} />
        </nav>
    )
}

export default Nav
