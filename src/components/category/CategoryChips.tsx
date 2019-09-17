import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import {
    Avatar,
    ButtonBase,
    Chip,
    createStyles,
    Grid,
    InputBase,
    makeStyles,
    PropTypes,
    Typography
    } from "@material-ui/core";
import { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import { CategoryVariants } from "./Categories";

const useStyles = makeStyles(() =>
    createStyles({
        buttonBase: {
            borderRadius: 16
        }
    })
);

// ? keep this for now, we may wanna split categories in the future
export const CategoryButtonBase: FC<ButtonBaseProps> = ({
    children,
    ...buttonBaseProps
}) => {
    const classes = useStyles();
    return (
        <ButtonBase className={classes.buttonBase} {...buttonBaseProps}>
            {children}
        </ButtonBase>
    );
};

export const chipPropsFrom = (
    variant?: CategoryVariants
): { avatar: JSX.Element; color: PropTypes.Color } => {
    switch (variant) {
        case "time":
            return {
                avatar: (
                    <Avatar>
                        <TimerIcon />
                    </Avatar>
                ),
                color: "secondary"
            };
        default:
            return {
                avatar: (
                    <Avatar>
                        <BookIcon />
                    </Avatar>
                ),
                color: "primary"
            };
    }
};

interface CategoryChipProps {
    selected: Set<string>;
    items: string[];
    onClick: (category: string, variant: CategoryVariants) => void;
    variant: CategoryVariants;
    edit?: boolean;
}

export const CategoryChips: FC<CategoryChipProps> = ({
    selected,
    items,
    onClick,
    variant,
    edit
}) => {
    const { avatar, color } = chipPropsFrom(variant);

    return (
        <Grid container spacing={1}>
            {items.map(category => (
                <Grid item key={category}>
                    <CategoryButtonBase onClick={() => onClick(category, variant)}>
                        <Chip
                            avatar={avatar}
                            color={selected.has(category) && !edit ? color : "default"}
                            label={
                                edit ? (
                                    <InputBase defaultValue={category} />
                                ) : (
                                        <Typography variant="subtitle2">{category}</Typography>
                                    )
                            }
                        />
                    </CategoryButtonBase>
                </Grid>
            ))}
        </Grid>
    );
};

export const CategoryChipsReadonly: FC<
    Pick<CategoryChipProps, "items" | "variant">
> = ({ items, variant }) => {
    const { avatar, color } = chipPropsFrom(variant);

    return (
        <Grid container spacing={1}>
            {items.map(category => (
                <Grid item key={category}>
                    <Chip avatar={avatar} size="small" color={color} label={category} />
                </Grid>
            ))}
        </Grid>
    );
};
