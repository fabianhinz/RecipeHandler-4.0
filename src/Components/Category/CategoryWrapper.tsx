import React, { FC } from "react";
import { Avatar, Chip, Grid, Typography } from "@material-ui/core";
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
    AvTimer
} from "mdi-material-ui";

export const avatarFromCategory = (category: string) => {
    switch (category) {
        case "Beilage":
            return (
                <Avatar>
                    <Pizza />
                </Avatar>
            );
        case "Brot":
            return (
                <Avatar>
                    <BreadSlice />
                </Avatar>
            );
        case "Dessert":
            return (
                <Avatar>
                    <Cupcake />
                </Avatar>
            );
        case "Getränke":
            return (
                <Avatar>
                    <Beer />
                </Avatar>
            );
        case "Hauptgericht":
            return (
                <Avatar>
                    <Pasta />
                </Avatar>
            );
        case "Kuchen":
            return (
                <Avatar>
                    <CakeVariant />
                </Avatar>
            );
        case "Plätzchen":
            return (
                <Avatar>
                    <Cookie />
                </Avatar>
            );
        case "Salat":
            return (
                <Avatar>
                    <Leaf />
                </Avatar>
            );
        case "Suppe":
            return (
                <Avatar>
                    <Bowl />
                </Avatar>
            );
        case "Alkohol":
            return (
                <Avatar>
                    <GlassCocktail />
                </Avatar>
            );
        case "Alkoholfrei":
            return (
                <Avatar>
                    <Kettle />
                </Avatar>
            );
        case "Fisch":
            return (
                <Avatar>
                    <Fish />
                </Avatar>
            );
        case "Fleisch":
            return (
                <Avatar>
                    <Cow />
                </Avatar>
            );
        case "Vegan":
            return (
                <Avatar>
                    <Barley />
                </Avatar>
            );
        case "Vegetarisch":
            return (
                <Avatar>
                    <EggEaster />
                </Avatar>
            );
        default:
            return (
                <Avatar>
                    <AvTimer />
                </Avatar>
            );
    }
};

interface SelectableCategoryProps extends CategoryWrapperProps {
    type: string;
    category: string;
}

const SelectableCategory: FC<SelectableCategoryProps> = ({
    onCategoryChange,
    selectedCategories,
    type,
    category
}) => (
    <CategoryBase onClick={() => onCategoryChange(type, category)}>
        <Chip
            avatar={avatarFromCategory(category)}
            color={selectedCategories.get(type) === category ? "secondary" : "default"}
            label={category}
        />
    </CategoryBase>
);

interface CategoryWrapperProps {
    selectedCategories: Map<string, string>;
    onCategoryChange: (type: string, value: string) => void;
}

export const CategoryWrapper: FC<CategoryWrapperProps> = ({
    onCategoryChange,
    selectedCategories
}) => {
    const { categoriesCollection } = useCategoriesCollectionContext();

    if (!categoriesCollection) return <Loading />;

    return (
        <Grid container spacing={4}>
            {Object.keys(categoriesCollection).map(type => (
                <Grid key={type} item xs={12}>
                    <Typography color="textSecondary" gutterBottom>
                        {type}
                    </Typography>
                    <Grid container spacing={1}>
                        {categoriesCollection[type].sort().map(category => (
                            <Grid item key={category}>
                                <SelectableCategory
                                    onCategoryChange={onCategoryChange}
                                    selectedCategories={selectedCategories}
                                    type={type}
                                    category={category}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};
