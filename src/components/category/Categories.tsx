import React, { FC, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { CategoryChips } from "./CategoryChips";
import { MOCK_CATEGORIES, MOCK_TIME_CATEGORIES } from "../../util/Mock";

export interface CategoriesAs<T> {
    type: T;
    time: T;
}

export type CategoryVariants = keyof CategoriesAs<Set<string>>;

export interface CategoryChangeHandler {
    onChange?: (categories: CategoriesAs<Array<string>>) => void;
}

interface CategoriesProps extends CategoryChangeHandler {
    edit?: boolean;
    fromRecipe?: CategoriesAs<Array<string>>;
}

export const Categories: FC<CategoriesProps> = ({
    onChange,
    edit,
    fromRecipe
}) => {
    const [categories, setCategories] = useState<CategoriesAs<Set<string>>>({
        type: new Set<string>(),
        time: new Set<string>()
    });

    useEffect(() => {
        if (!fromRecipe) return;
        setCategories({
            time: new Set(fromRecipe.time),
            type: new Set(fromRecipe.type)
        });
    }, [fromRecipe]);

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
                    edit={edit}
                    variant="type"
                    items={MOCK_CATEGORIES}
                    onClick={handleClick}
                    selected={categories.type}
                />
            </Box>
            <Box marginBottom={1}>
                <CategoryChips
                    edit={edit}
                    variant="time"
                    items={MOCK_TIME_CATEGORIES}
                    onClick={handleClick}
                    selected={categories.time}
                />
            </Box>
        </>
    );
};
