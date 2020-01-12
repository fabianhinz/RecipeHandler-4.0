import {
    Avatar,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import {
    AvTimer,
    Barley,
    Beer,
    Bowl,
    BreadSliceOutline,
    CakeVariant,
    Cookie,
    Cow,
    Cupcake,
    EggEaster,
    FilterVariant,
    Fish,
    GlassCocktail,
    KettleOutline,
    Leaf,
    Pasta,
    Pizza,
} from 'mdi-material-ui'
import React, { FC, memo, useState } from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useCategoriesCollectionContext } from '../Provider/CategoriesCollectionProvider'
import { useDeviceOrientationContext } from '../Provider/DeviceOrientationProvider'
import { SlideUp } from '../Shared/Transitions'

export const iconFromCategory = (category: string) => {
    switch (category) {
        case 'Beilage':
            return <Pizza />
        case 'Brot':
            return <BreadSliceOutline />
        case 'Dessert':
            return <Cupcake />
        case 'Getränke':
            return <Beer />
        case 'Hauptgericht':
            return <Pasta />
        case 'Kuchen':
            return <CakeVariant />
        case 'Plätzchen':
            return <Cookie />
        case 'Salat':
            return <Leaf />
        case 'Suppe':
            return <Bowl />
        case 'Alkohol':
            return <GlassCocktail />
        case 'Alkoholfrei':
            return <KettleOutline />
        case 'Fisch':
            return <Fish />
        case 'Fleisch':
            return <Cow />
        case 'Vegan':
            return <Barley />
        case 'Vegetarisch':
            return <EggEaster />
        default:
            return <AvTimer />
    }
}

interface CategoryDialogProps extends CategoryWrapperProps {
    categories: Array<string>
    type: string
}

const useStyles = makeStyles(theme =>
    createStyles({
        skeletonContainer: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        avatarSelected: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
        },
    })
)

const CategoryDialog: FC<CategoryDialogProps> = ({
    onCategoryChange,
    selectedCategories,
    type,
    categories,
}) => {
    const [dialog, setDialog] = useState(false)
    const { isDialogFullscreen } = useBreakpointsContext()

    const classes = useStyles()

    const selectedHasType = selectedCategories.has(type)
    const selectedCategory = selectedCategories.get(type) as string

    const handleDialogChange = () => setDialog(previous => !previous)

    const handleCategoryChange = (value: string) => () => {
        setDialog(false)
        onCategoryChange(type, value)
    }

    return (
        <>
            <ListItem button onClick={handleDialogChange}>
                <ListItemIcon>
                    {selectedHasType ? (
                        <Avatar className={classes.avatarSelected}>
                            {iconFromCategory(selectedCategory)}
                        </Avatar>
                    ) : (
                        <Avatar>
                            <FilterVariant />
                        </Avatar>
                    )}
                </ListItemIcon>
                <ListItemText
                    primary={type}
                    secondary={selectedHasType ? selectedCategory : 'Auswählen (optional)'}
                />
            </ListItem>

            <Dialog
                fullScreen={isDialogFullscreen}
                TransitionComponent={SlideUp}
                open={dialog}
                onClose={handleDialogChange}
                maxWidth="sm"
                fullWidth>
                <DialogTitle>{type} auswählen</DialogTitle>
                <DialogContent>
                    <List>
                        {categories.map(category => (
                            <ListItem
                                onClick={handleCategoryChange(category)}
                                button
                                key={category}>
                                <ListItemAvatar>
                                    <Avatar
                                        className={clsx(
                                            category === selectedCategories.get(type) &&
                                                classes.avatarSelected
                                        )}>
                                        {iconFromCategory(category)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={category} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={handleDialogChange}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleCategoryChange(selectedCategory)}
                        disabled={!selectedHasType}>
                        <DeleteIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

interface CategoryWrapperProps {
    selectedCategories: Map<string, string>
    onCategoryChange: (type: string, value: string) => void
}

const SKELETON_CATEGORIES = ['art', 'ernährung', 'zeit']

const CategoryWrapper: FC<CategoryWrapperProps> = ({ onCategoryChange, selectedCategories }) => {
    const { categoriesCollection, categoriesLoading } = useCategoriesCollectionContext()
    const classes = useStyles()
    const { landscape } = useDeviceOrientationContext()

    return (
        <Grid container spacing={2}>
            {Object.keys(categoriesCollection).map(type => (
                <Grid key={type} item xs={landscape ? 4 : 12} sm={4}>
                    <CategoryDialog
                        categories={categoriesCollection[type]}
                        onCategoryChange={onCategoryChange}
                        selectedCategories={selectedCategories}
                        type={type}
                    />
                </Grid>
            ))}
            {categoriesLoading &&
                SKELETON_CATEGORIES.map(dummy => (
                    <Grid key={dummy} item xs={landscape ? 4 : 12} sm={4}>
                        <Grid
                            className={classes.skeletonContainer}
                            container
                            spacing={1}
                            alignItems="center">
                            <Grid item xs={2}>
                                <Skeleton variant="circle" width={40} height={40} />
                            </Grid>
                            <Grid item xs={10}>
                                <Skeleton variant="text" width="30%" />
                                <Skeleton variant="text" width="60%" />
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
        </Grid>
    )
}

export default memo(
    CategoryWrapper,
    (prev, next) =>
        prev.onCategoryChange === next.onCategoryChange &&
        prev.selectedCategories === next.selectedCategories
)
