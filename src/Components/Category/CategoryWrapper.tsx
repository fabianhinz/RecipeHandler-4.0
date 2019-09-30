import {
    Avatar,
    Box,
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
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
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
import { Loading } from '../Shared/Loading'
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

const CategoryDialog: FC<CategoryDialogProps> = ({
    onCategoryChange,
    selectedCategories,
    type,
    categories,
}) => {
    const [dialog, setDialog] = useState(false)
    const { isDialogFullscreen } = useBreakpointsContext()

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
                        <Avatar>{iconFromCategory(selectedCategory)}</Avatar>
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
                                    <Avatar>{iconFromCategory(category)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={category} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Box
                        flexGrow={1}
                        display="flex"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <IconButton onClick={handleDialogChange}>
                            <CloseIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleCategoryChange(selectedCategory)}
                            disabled={!selectedHasType}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

interface CategoryWrapperProps {
    selectedCategories: Map<string, string>
    onCategoryChange: (type: string, value: string) => void
}

const CategoryWrapper: FC<CategoryWrapperProps> = ({ onCategoryChange, selectedCategories }) => {
    const { categoriesCollection } = useCategoriesCollectionContext()

    if (Object.keys(categoriesCollection).length === 0) return <Loading />

    return (
        <Grid container spacing={2}>
            {Object.keys(categoriesCollection).map(type => (
                <Grid key={type} item xs={12} md={4}>
                    <CategoryDialog
                        categories={categoriesCollection[type]}
                        onCategoryChange={onCategoryChange}
                        selectedCategories={selectedCategories}
                        type={type}
                    />
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
