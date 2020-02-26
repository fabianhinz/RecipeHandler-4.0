import {
    Avatar,
    Container,
    createStyles,
    Drawer,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import clsx from 'clsx'
import { Filter } from 'mdi-material-ui'
import React, { memo, useState } from 'react'

import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import getIconByCategory from './CategoryIcons'

const useStyles = makeStyles(theme =>
    createStyles({
        avatarSelected: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
        },
        subheader: {
            backgroundColor: theme.palette.background.paper,
        },
        containerCategoryWrapper: {
            // ? about the same height as BackgroundIcon
            maxHeight: '31vh',
            overflowY: 'auto',
        },
        drawerHeader: {
            padding: theme.spacing(2),
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
        },
        drawerActions: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: theme.spacing(2),
        },
        filterFab: {
            fontFamily: 'Ubuntu',
            textTransform: 'unset',
            [theme.breakpoints.only('xs')]: {
                width: '100% !important',
            },
        },
        filterFabIcon: {
            marginRight: theme.spacing(0.5),
        },
    })
)

interface Props {
    header?: React.ReactNode
    fabLabel: React.ReactText
    selectedCategories: Map<string, string>
    onCategoryChange: (type: string, value: string) => void
}

const CategorySelection = ({ onCategoryChange, selectedCategories, header, fabLabel }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const classes = useStyles()

    const { categoriesLoading, categoriesCollection } = useCategoriesCollectionContext()

    const closeDrawer = () => setDrawerOpen(false)
    const openDrawer = () => setDrawerOpen(true)

    return (
        <>
            <Fab
                color={selectedCategories.size > 0 ? 'secondary' : 'default'}
                onClick={openDrawer}
                disabled={categoriesLoading}
                variant="extended"
                size="medium"
                className={classes.filterFab}>
                <Filter className={classes.filterFabIcon} />
                {fabLabel}
            </Fab>

            <Drawer
                BackdropProps={{ invisible: true }}
                ModalProps={{ disableScrollLock: true }}
                open={drawerOpen}
                onClose={closeDrawer}
                anchor="top">
                <div className={classes.drawerHeader}>{header}</div>

                <Container maxWidth="xl" className={classes.containerCategoryWrapper}>
                    <Grid container>
                        {Object.keys(categoriesCollection).map(type => (
                            <Grid key={type} item xs={12} sm={6} lg={3}>
                                <ListSubheader className={classes.subheader}>{type}</ListSubheader>
                                <List>
                                    {categoriesCollection[type].map(category => (
                                        <ListItem
                                            onClick={() => onCategoryChange(type, category)}
                                            button
                                            key={category}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    className={clsx(
                                                        category === selectedCategories.get(type) &&
                                                            classes.avatarSelected
                                                    )}>
                                                    {getIconByCategory(category)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={category} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                <div className={classes.drawerActions}>
                    <IconButton onClick={closeDrawer}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </Drawer>
        </>
    )
}

export default memo(
    CategorySelection,
    (prev, next) =>
        prev.onCategoryChange === next.onCategoryChange &&
        prev.selectedCategories === next.selectedCategories &&
        prev.header === next.header
)
