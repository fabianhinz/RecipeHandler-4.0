import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import { Avatar, Chip, Grid, InputBase, PropTypes, Typography } from "@material-ui/core";
import { CategoryVariants } from "../../model/model";
import { CategoryBase } from "./CategoryBase";

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

interface CategoryProps {
    selected?: Set<string>;
    items: string[];
    onClick?: (category: string, variant: CategoryVariants) => void;
    variant: CategoryVariants;
    edit?: boolean;
    readonly?: boolean;
}

export const Category: FC<CategoryProps> = ({
    selected,
    items,
    onClick,
    variant,
    edit,
    readonly
}) => {
    const { avatar, color } = chipPropsFrom(variant);

    if (readonly) {
        return (
            <Grid container spacing={1}>
                {items.map(category => (
                    <Grid item key={category}>
                        <Chip avatar={avatar} size="small" color={color} label={category} />
                    </Grid>
                ))}
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={1}>
                {items.map(category => (
                    <Grid item key={category}>
                        <CategoryBase onClick={() => onClick!(category, variant)}>
                            <Chip
                                avatar={avatar}
                                color={selected!.has(category) && !edit ? color : "default"}
                                label={
                                    edit ? (
                                        <InputBase defaultValue={category} />
                                    ) : (
                                        <Typography variant="subtitle2">{category}</Typography>
                                    )
                                }
                            />
                        </CategoryBase>
                    </Grid>
                ))}
            </Grid>
        );
    }
};
