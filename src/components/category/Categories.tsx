import React, { FC, useState } from "react";
import { CategoryChips, CategoryVariants } from "./CategoryChips";
import { MOCK_CATEGORIES, MOCK_TIME_CATEGORIES } from "../../util/Mock";
import { Grid } from "@material-ui/core";

interface CategoriesProps {
  onChange?: (categories: { type: Array<string>; time: Array<string> }) => void;
}

export const Categories: FC<CategoriesProps> = ({ onChange }) => {
  // ToDo typesafe state based on CategoryVariants
  const [selected, setSelected] = useState({
    type: new Set<string>(),
    time: new Set<string>()
  });

  const handleClick = (category: string, variant: CategoryVariants) => {
    if (selected[variant].has(category)) selected[variant].delete(category);
    else selected[variant].add(category);

    if (onChange)
      onChange({
        type: Array.from(selected.type),
        time: Array.from(selected.time)
      });
    setSelected({ ...selected });
  };

  return (
    <>
      <Grid item>
        <CategoryChips
          variant="type"
          color="primary"
          items={MOCK_CATEGORIES}
          onClick={handleClick}
          selected={selected.type}
        />
      </Grid>
      <Grid item>
        <CategoryChips
          variant="time"
          color="secondary"
          items={MOCK_TIME_CATEGORIES}
          onClick={handleClick}
          selected={selected.time}
        />
      </Grid>
    </>
  );
};
