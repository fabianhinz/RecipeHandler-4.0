import React, { FC } from "react";
import { makeStyles, createStyles, ButtonBase } from "@material-ui/core";
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
