import React, { FC } from "react";
import CommentIcon from "@material-ui/icons/CommentTwoTone";
import { IconButton, Tooltip } from "@material-ui/core";
import { Recipe, AttachementMetadata } from "../../model/model";

export const Comments: FC<Pick<Recipe<AttachementMetadata>, "name">> = ({ name }) => {
    const handleCommentClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
    };

    return (
        <IconButton onClick={handleCommentClick}>
            <CommentIcon />
        </IconButton>
    );
};
