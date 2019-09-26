import React, { FC, useState, memo } from "react";
import {
    Avatar,
    Chip,
    Grid,
    Typography,
    Hidden,
    Box,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemIcon,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    IconButton,
    Drawer
} from "@material-ui/core";
import { CategoryBase } from "./CategoryBase";
import { Loading } from "../Shared/Loading";
import { useCategoriesCollectionContext } from "../Provider/CategoriesCollectionProvider";
import {
    Pizza,
    BreadSlice,
    Cupcake,
    Beer,
    Pasta,
    CakeVariant,
    Cookie,
    Leaf,
    Bowl,
    GlassCocktail,
    Kettle,
    Fish,
    Cow,
    Barley,
    EggEaster,
    AvTimer,
    FilterVariant,
    Close
} from "mdi-material-ui";

export const avatarFromCategory = (category: string) => {
    const getAvatar = (icon: JSX.Element) => <Avatar>{icon}</Avatar>;

    switch (category) {
        case "Beilage":
            return getAvatar(<Pizza />);
        case "Brot":
            return getAvatar(<BreadSlice />);
        case "Dessert":
            return getAvatar(<Cupcake />);
        case "Getränke":
            return getAvatar(<Beer />);
        case "Hauptgericht":
            return getAvatar(<Pasta />);
        case "Kuchen":
            return getAvatar(<CakeVariant />);
        case "Plätzchen":
            return getAvatar(<Cookie />);
        case "Salat":
            return getAvatar(<Leaf />);
        case "Suppe":
            return getAvatar(<Bowl />);
        case "Alkohol":
            return getAvatar(<GlassCocktail />);
        case "Alkoholfrei":
            return getAvatar(<Kettle />);
        case "Fisch":
            return getAvatar(<Fish />);
        case "Fleisch":
            return getAvatar(<Cow />);
        case "Vegan":
            return getAvatar(<Barley />);
        case "Vegetarisch":
            return getAvatar(<EggEaster />);
        default:
            return getAvatar(<AvTimer />);
    }
};

interface SharedProps extends CategoryWrapperProps {
    categories: Array<string>;
    type: string;
}

const CategoryMenu: FC<SharedProps> = ({
    onCategoryChange,
    selectedCategories,
    type,
    categories
}) => {
    const [drawer, setDrawer] = useState(false);
    const selectedHasType = selectedCategories.has(type);
    const selectedCategory = selectedCategories.get(type) as string;

    const handleDialogChange = () => setDrawer(previous => !previous);

    const handleCategoryChange = (value: string) => () => {
        setDrawer(false);
        onCategoryChange(type, value);
    };

    return (
        <>
            <ListItem button onClick={handleDialogChange}>
                <ListItemIcon>
                    {selectedHasType ? (
                        avatarFromCategory(selectedCategory)
                    ) : (
                        <Avatar>
                            <FilterVariant />
                        </Avatar>
                    )}
                </ListItemIcon>
                <ListItemText
                    primary={type}
                    secondary={selectedHasType ? selectedCategory : "Auswählen (optional)"}
                />
            </ListItem>

            <Drawer anchor="bottom" open={drawer} onClose={handleDialogChange}>
                <DialogTitle>{type} auswählen</DialogTitle>
                <DialogContent>
                    <Box maxHeight="50vh" overflow="auto">
                        <List>
                            {categories.map(category => (
                                <ListItem
                                    onClick={handleCategoryChange(category)}
                                    button
                                    key={category}
                                >
                                    <ListItemAvatar>{avatarFromCategory(category)}</ListItemAvatar>
                                    <ListItemText primary={category} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box flexGrow={1} display="flex" justifyContent="center">
                        <IconButton
                            onClick={handleCategoryChange(selectedCategory)}
                            disabled={!selectedHasType}
                        >
                            <Close fontSize="large" />
                        </IconButton>
                    </Box>
                </DialogActions>
            </Drawer>
        </>
    );
};

const CategoryChips: FC<SharedProps> = ({
    onCategoryChange,
    selectedCategories,
    type,
    categories
}) => (
    <>
        <Typography color="textSecondary" gutterBottom>
            {type}
        </Typography>
        <Grid container spacing={1}>
            {categories.sort().map(category => (
                <Grid item key={category}>
                    <CategoryBase onClick={() => onCategoryChange(type, category)}>
                        <Chip
                            avatar={avatarFromCategory(category)}
                            color={
                                selectedCategories.get(type) === category ? "secondary" : "default"
                            }
                            label={category}
                        />
                    </CategoryBase>
                </Grid>
            ))}
        </Grid>
    </>
);

interface CategoryWrapperProps {
    selectedCategories: Map<string, string>;
    onCategoryChange: (type: string, value: string) => void;
}

const CategoryWrapper: FC<CategoryWrapperProps> = ({ onCategoryChange, selectedCategories }) => {
    const { categoriesCollection } = useCategoriesCollectionContext();

    if (Object.keys(categoriesCollection).length === 0) return <Loading />;

    return (
        <Grid container spacing={2}>
            {Object.keys(categoriesCollection).map(type => (
                <Grid key={type} item xs={12}>
                    <Hidden smUp>
                        <CategoryMenu
                            categories={categoriesCollection[type]}
                            onCategoryChange={onCategoryChange}
                            selectedCategories={selectedCategories}
                            type={type}
                        />
                    </Hidden>
                    <Hidden xsDown>
                        <CategoryChips
                            categories={categoriesCollection[type]}
                            onCategoryChange={onCategoryChange}
                            selectedCategories={selectedCategories}
                            type={type}
                        />
                    </Hidden>
                </Grid>
            ))}
        </Grid>
    );
};

export default memo(
    CategoryWrapper,
    (prev, next) =>
        prev.onCategoryChange === next.onCategoryChange &&
        prev.selectedCategories === next.selectedCategories
);
