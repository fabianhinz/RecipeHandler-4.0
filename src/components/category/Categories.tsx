import React, { FC, useState } from "react";
import { CategoryChips } from "./CategoryChips";
import { MOCK_CATEGORIES, MOCK_TIME_CATEGORIES } from "../../util/Mock";
import { Grid } from "@material-ui/core";

export const Categories: FC = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleClick = (category: string) => {
    if (selected.has(category)) selected.delete(category);
    else selected.add(category);
    setSelected(new Set(selected));
  };

  return (
    <>
      <Grid item>
        <CategoryChips
          color="primary"
          items={MOCK_CATEGORIES}
          onClick={handleClick}
          selected={selected}
        />
      </Grid>
      <Grid item>
        <CategoryChips
          variant="time"
          color="secondary"
          items={MOCK_TIME_CATEGORIES}
          onClick={handleClick}
          selected={selected}
        />
      </Grid>
    </>
  );
};
