import {
    Avatar,
    ButtonProps,
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
import React from 'react'

import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import SelectionDrawer from '../Shared/SelectionDrawer'
import getIconByCategory from './CategoryIcons'

const useStyles = makeStyles(theme => ({
    avatarSelected: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.getContrastText(theme.palette.secondary.main),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
}))

interface Props {
    header?: React.ReactNode
    label: React.ReactText
    selectedCategories: Map<string, string>
    forceHighlight?: boolean
    onRemoveSelectedCategories: () => void
    onCategoryChange: (type: string, value: string) => void
    legend?: React.ReactText
    children?: React.ReactNode
    buttonProps?: Omit<ButtonProps, 'children' | 'startIcon'>
}

export default function CategorySelection({
    onCategoryChange,
    selectedCategories,
    onRemoveSelectedCategories,
    header,
    label,
    legend,
    children,
    buttonProps,
    forceHighlight,
}: Props) {
    const classes = useStyles()

    const { categoriesLoading, recipeCategories } = useCategoriesCollectionContext()

    return (
        <SelectionDrawer
            header={header}
            buttonProps={{
                icon: <Filter />,
                label,
                disabled: categoriesLoading,
                ...buttonProps,
            }}
            legend={legend}
            action={
                <IconButton onClick={onRemoveSelectedCategories}>
                    <DeleteIcon />
                </IconButton>
            }
            highlight={selectedCategories.size > 0 || forceHighlight}>
            <Grid container>
                {Object.keys(recipeCategories).map(type => (
                    <Grid key={type} item xs={12}>
                        <ListSubheader className={classes.subheader}>{type}</ListSubheader>
                        <List disablePadding>
                            {recipeCategories[type].map(category => (
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
                {children}
            </Grid>
        </SelectionDrawer>
    )
}
