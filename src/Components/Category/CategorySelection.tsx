import {
    Avatar,
    createStyles,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import { Filter } from 'mdi-material-ui'
import React, { memo } from 'react'

import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import SelectionDrawer from '../Shared/SelectionDrawer'
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
    })
)

interface Props {
    header?: React.ReactNode
    label: React.ReactText
    selectedCategories: Map<string, string>
    removeSelectedCategories: () => void
    onCategoryChange: (type: string, value: string) => void
}

const CategorySelection = ({
    onCategoryChange,
    selectedCategories,
    removeSelectedCategories,
    header,
    label,
}: Props) => {
    const classes = useStyles()

    const { categoriesLoading, categoriesCollection } = useCategoriesCollectionContext()

    return (
        <SelectionDrawer
            header={header}
            buttonProps={{
                highlight: selectedCategories.size > 0,
                startIcon: <Filter />,
                label,
                disabled: categoriesLoading,
            }}
            action={
                <IconButton onClick={removeSelectedCategories}>
                    <DeleteIcon />
                </IconButton>
            }>
            <Grid container>
                {Object.keys(categoriesCollection).map(type => (
                    <Grid key={type} item xs={12}>
                        <ListSubheader className={classes.subheader}>{type}</ListSubheader>
                        <List disablePadding>
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
        </SelectionDrawer>
    )
}

export default memo(
    CategorySelection,
    (prev, next) =>
        prev.onCategoryChange === next.onCategoryChange &&
        prev.selectedCategories === next.selectedCategories &&
        prev.header === next.header
)
