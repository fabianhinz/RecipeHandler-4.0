import React, { FC } from "react";
import {
  ButtonBase,
  Chip,
  createStyles,
  Grid,
  makeStyles,
  Typography,
  Avatar,
  PropTypes
} from "@material-ui/core";
import { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";

const useStyles = makeStyles(() =>
  createStyles({
    buttonBase: {
      borderRadius: 16
    }
  })
);

// ? keep this for now, we may wanna split categories in the future
const CategoryButtonBase: FC<ButtonBaseProps> = ({
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

type CategoryVariants = "default" | "time";

const iconFromVariant = (variant?: CategoryVariants): JSX.Element => {
  switch (variant) {
    case "time":
      return <TimerIcon />;
    default:
      return <BookIcon />;
  }
};

// Todo in the future we probably need more colors
interface CategoryChipProps {
  selected: Set<string>;
  items: string[];
  onClick: (category: string) => void;
  color: PropTypes.Color;
  variant?: CategoryVariants;
}

export const CategoryChips: FC<CategoryChipProps> = ({
  selected,
  items,
  onClick,
  color,
  variant
}) => {
  return (
    <Grid container spacing={1}>
      {items.map(category => (
        <Grid item key={category}>
          <CategoryButtonBase onClick={() => onClick(category)}>
            <Chip
              avatar={<Avatar>{iconFromVariant(variant)}</Avatar>}
              color={selected.has(category) ? color : "default"}
              label={<Typography variant="subtitle2">{category}</Typography>}
            />
          </CategoryButtonBase>
        </Grid>
      ))}
    </Grid>
  );
};

export const CategoryChipsReadonly: FC<
  Pick<CategoryChipProps, "items" | "variant" | "color">
> = ({ items, variant, color }) => (
  <Grid container spacing={1}>
    {items.map(category => (
      <Grid item key={category}>
        <Chip
          avatar={<Avatar>{iconFromVariant(variant)}</Avatar>}
          size="small"
          color={color}
          label={category}
        />
      </Grid>
    ))}
  </Grid>
);
