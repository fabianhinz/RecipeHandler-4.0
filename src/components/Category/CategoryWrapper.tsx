import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import {
    Avatar,
    Chip,
    Grid,
    InputBase,
    Typography,
    makeStyles,
    createStyles,
    ButtonBase
} from "@material-ui/core";
import { RecipeCategories } from "../../model/model";
import { ButtonBaseProps } from "@material-ui/core/ButtonBase";

const useStyles = makeStyles(() =>
    createStyles({
        buttonBase: {
            borderRadius: 16
        }
    })
);

export const CategoryBase: FC<ButtonBaseProps> = ({ children, ...buttonBaseProps }) => {
    const classes = useStyles();
    return (
        <ButtonBase className={classes.buttonBase} {...buttonBaseProps}>
            {children}
        </ButtonBase>
    );
};

const categoryAvatar = (
    <Avatar>
        <BookIcon />
    </Avatar>
);

interface ReadonlyProps {
    categories: RecipeCategories;
}

const Readonly: FC<ReadonlyProps> = ({ categories }) => (
    <Grid container spacing={1}>
        {Object.keys(categories).map(key => (
            <Grid item key={key}>
                <Chip
                    avatar={categoryAvatar}
                    size="small"
                    color={categories[key] ? "primary" : "default"}
                    label={key}
                />
            </Grid>
        ))}
    </Grid>
);

interface NameProps extends ReadonlyProps {
    onNameChange?: (key: string, value: string) => void;
}

const Name: FC<NameProps> = ({ categories, onNameChange }) => (
    <Grid container spacing={1}>
        {Object.keys(categories).map(key => (
            <Grid item key={key}>
                <Chip
                    avatar={categoryAvatar}
                    color="default"
                    label={
                        <InputBase
                            defaultValue={key}
                            onChange={e => onNameChange!(key, e.target.value)}
                        />
                    }
                />
            </Grid>
        ))}
    </Grid>
);

interface CategoryProps extends ReadonlyProps {
    onCategoryChange?: (key: string) => void;
}

const Category: FC<CategoryProps> = ({ categories, onCategoryChange }) => (
    <Grid container spacing={1}>
        {Object.keys(categories).map(key => (
            <Grid item key={key}>
                <CategoryBase onClick={() => onCategoryChange!(key)}>
                    <Chip
                        avatar={categoryAvatar}
                        color={categories[key] ? "primary" : "default"}
                        label={<Typography variant="subtitle2">{key}</Typography>}
                    />
                </CategoryBase>
            </Grid>
        ))}
    </Grid>
);

interface CategoryWrapperProps extends CategoryProps, NameProps, ReadonlyProps {
    variant: "changeableCategory" | "changeableName" | "readonly";
}

export const CategoryWrapper: FC<CategoryWrapperProps> = ({
    categories,
    variant,
    onCategoryChange,
    onNameChange
}) => {
    switch (variant) {
        case "readonly":
            return <Readonly categories={categories} />;
        case "changeableName":
            return <Name categories={categories} onNameChange={onNameChange} />;
        case "changeableCategory":
            return <Category categories={categories} onCategoryChange={onCategoryChange} />;
    }
};
