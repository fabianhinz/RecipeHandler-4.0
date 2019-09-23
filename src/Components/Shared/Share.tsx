import React, { FC, useState } from "react";
import ShareIcon from "@material-ui/icons/ShareTwoTone";
import { IconButton, Tooltip } from "@material-ui/core";
import copy from "clipboard-copy";
import { Recipe, AttachementMetadata } from "../../model/model";
import { PATHS } from "../Routes/Routes";

export const Share: FC<Pick<Recipe<AttachementMetadata>, "name">> = ({ name }) => {
    const [copied, setCopied] = useState(false);

    const handleCommentClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        copy(`${document.location.origin}${PATHS.details(name)}`).then(() => {
            setCopied(true);
        });
    };

    return (
        <Tooltip
            onMouseOut={() => setCopied(false)}
            open={copied}
            title="In der Zwischenablage gespeichert"
        >
            <IconButton onClick={handleCommentClick}>
                <ShareIcon />
            </IconButton>
        </Tooltip>
    );
};
