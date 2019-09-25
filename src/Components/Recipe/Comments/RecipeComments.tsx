import React, { FC, useState } from "react";
import CommentIcon from "@material-ui/icons/CommentTwoTone";
import { IconButton } from "@material-ui/core";
import { RecipeDocument } from "../../../model/model";
import { BadgeWrapper } from "../../Shared/BadgeWrapper";
import { RecipeCommentsDrawer } from "./RecipeCommentsDrawer";

const stopPropagation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>
) => event.stopPropagation();

export const RecipeComments: FC<Pick<RecipeDocument, "name" | "numberOfComments">> = ({
    name,
    numberOfComments
}) => {
    const [drawer, setDrawer] = useState(false);

    const handleDrawerChange = () => setDrawer(previous => !previous);

    return (
        <div onClick={stopPropagation} onFocus={stopPropagation}>
            <IconButton onClick={handleDrawerChange}>
                <BadgeWrapper badgeContent={numberOfComments}>
                    <CommentIcon />
                </BadgeWrapper>
            </IconButton>

            <RecipeCommentsDrawer name={name} open={drawer} onClose={handleDrawerChange} />
        </div>
    );
};
