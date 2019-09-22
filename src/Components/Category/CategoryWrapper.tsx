import ArtIcon from "@material-ui/icons/BookTwoTone";
import AufwandIcon from "@material-ui/icons/AvTimerTwoTone";
import SpeisenfolgeIcon from "@material-ui/icons/DirectionsTwoTone";
import React, { FC } from "react";
import { Avatar, Chip, Grid, InputBase, Typography, Divider } from "@material-ui/core";
import { useCategoriesCollection } from "../../hooks/useCategoriesCollection";
import { CategoryBase } from "./CategoryBase";
import { Loading } from "../Shared/Loading";

export const avatarFromCategoryType = (type: string) => {
    switch (type) {
        case "Art":
            return (
                <Avatar>
                    <ArtIcon />
                </Avatar>
            );
        case "Aufwand":
            return (
                <Avatar>
                    <AufwandIcon />
                </Avatar>
            );
        case "Speisenfolge":
            return (
                <Avatar>
                    <SpeisenfolgeIcon />
                </Avatar>
            );
        default: {
            return (
                <Avatar>
                    <ArtIcon />
                </Avatar>
            );
        }
    }
};

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
                    avatar={avatarFromCategoryType(type)}
                    color={selectedCategories.get(type) === value ? "primary" : "default"}
                    label={<Typography variant="subtitle2">{value}</Typography>}
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
    const { categoriesCollection } = useCategoriesCollection();

    if (!categoriesCollection) return <Loading />;

    return (
        <Grid container spacing={2}>
            {Object.keys(categoriesCollection).map(type => (
                <Grid key={type} item xs={12}>
                    <Typography gutterBottom>{type}</Typography>
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
