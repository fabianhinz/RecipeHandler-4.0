import { useState } from "react";

export const useCategorySelect = () => {
    const [state, setState] = useState<Map<string, string>>(new Map());

    const handleChange = (type: string, value: string) => {
        setState(previous => {
            if (previous.get(type) === value) {
                previous.delete(type);
                return new Map(previous);
            } else {
                return new Map(previous.set(type, value));
            }
        });
    };

    return { selectedCategories: state, setSelectedCategories: handleChange };
};
