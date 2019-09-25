import React, { FC } from "react";
import {
    Avatar,
    Chip,
    Grid,
    InputBase,
    Typography,
    makeStyles,
    createStyles
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
    AvTimer
} from "mdi-material-ui";

export const avatarFromCategoryType = (type: string) => {
    switch (type) {
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
// ToDo not needed anymore
const NameChangeCategory: FC<Pick<CategoryWrapperProps, "onNameChange"> & SharedProps> = ({
    onNameChange,
    type,
    value
}) => (
    <>
        {onNameChange && (
            <Chip
                avatar={avatarFromCategoryType(type)}
                color="default"
                label={
                    <InputBase
                        defaultValue={value}
                        onChange={e => onNameChange(type, value, e.target.value)}
                    />
                }
            />
        )}
    </>
);

const CategoryChangeCategory: FC<
    Pick<CategoryWrapperProps, "onCategoryChange" | "selectedCategories"> & SharedProps
> = ({ onCategoryChange, selectedCategories, type, value }) => (
    <>
        {onCategoryChange && selectedCategories && (
            <CategoryBase onClick={() => onCategoryChange(type, value)}>
                <Chip
                    avatar={avatarFromCategoryType(value)}
                    color={selectedCategories.get(type) === value ? "secondary" : "default"}
                    label={value}
                />
            </CategoryBase>
        )}
    </>
);

interface SharedProps {
    type: string;
    value: string;
}

interface CategoryWrapperProps {
    selectedCategories?: Map<string, string>;
    onCategoryChange?: (type: string, value: string) => void;
    onNameChange?: (type: string, oldValue: string, newValue: string) => void;
}

export const CategoryWrapper: FC<CategoryWrapperProps> = ({
    onCategoryChange,
    onNameChange,
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
                        {categoriesCollection[type].sort().map(value => (
                            <Grid item key={value}>
                                <NameChangeCategory
                                    onNameChange={onNameChange}
                                    type={type}
                                    value={value}
                                />
                                <CategoryChangeCategory
                                    onCategoryChange={onCategoryChange}
                                    selectedCategories={selectedCategories}
                                    type={type}
                                    value={value}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};
