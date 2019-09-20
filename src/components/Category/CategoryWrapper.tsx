import ArtIcon from "@material-ui/icons/BookTwoTone";
import AufwandIcon from "@material-ui/icons/AvTimerTwoTone";
import SpeisenfolgeIcon from "@material-ui/icons/DirectionsTwoTone";
import React, { FC } from "react";
import { Avatar, Chip, Grid, InputBase, Typography } from "@material-ui/core";
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
        default:
            throw Error("could not get avatar from categorytype");
    }
};

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
    const { categories } = useCategoriesCollection();

    if (!categories) return <Loading />;

    return (
        <Grid container spacing={2}>
            {Object.keys(categories).map(type => (
                <Grid key={type} item xs={12}>
                    <Typography gutterBottom>{type}</Typography>
                    <Grid container spacing={1}>
                        {categories[type].map(value => (
                            <Grid item key={value}>
                                {onNameChange && (
                                    <Chip
                                        avatar={avatarFromCategoryType(type)}
                                        color="default"
                                        label={
                                            <InputBase
                                                defaultValue={value}
                                                onChange={e =>
                                                    onNameChange(type, value, e.target.value)
                                                }
                                            />
                                        }
                                    />
                                )}
                                {onCategoryChange && selectedCategories && (
                                    <CategoryBase onClick={() => onCategoryChange(type, value)}>
                                        <Chip
                                            avatar={avatarFromCategoryType(type)}
                                            color={
                                                selectedCategories.get(type) === value
                                                    ? "primary"
                                                    : "default"
                                            }
                                            label={
                                                <Typography variant="subtitle2">{value}</Typography>
                                            }
                                        />
                                    </CategoryBase>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};
