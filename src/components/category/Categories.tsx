import React, { FC, useState } from "react";
import { CategoryChips } from "./CategoryChips";
import { MOCK_CATEGORIES, MOCK_TIME_CATEGORIES } from "../../util/Mock";
import { Box } from "@material-ui/core";

export interface CategoriesAs<T> {
  type: T;
  time: T;
}

export type CategoryVariants = keyof CategoriesAs<Set<string>>;

export interface CategoryChangeHandler {
  onChange?: (categories: CategoriesAs<Array<string>>) => void;
}

export const Categories: FC<CategoryChangeHandler> = ({ onChange }) => {
  const [categories, setCategories] = useState<CategoriesAs<Set<string>>>({
    type: new Set<string>(),
    time: new Set<string>()
  });

  const handleClick = (category: string, variant: CategoryVariants) => {
    if (categories[variant].has(category)) categories[variant].delete(category);
    else categories[variant].add(category);

    if (onChange)
      onChange({
        type: Array.from(categories.type),
        time: Array.from(categories.time)
      });
    setCategories({ ...categories });
  };

  return (
    <>
      <Box marginBottom={1}>
        <CategoryChips
          variant="type"
          items={MOCK_CATEGORIES}
          onClick={handleClick}
          selected={categories.type}
        />
      </Box>
      <Box marginBottom={1}>
        <CategoryChips
          variant="time"
          items={MOCK_TIME_CATEGORIES}
          onClick={handleClick}
          selected={categories.time}
        />
      </Box>
    </>
  );
};
