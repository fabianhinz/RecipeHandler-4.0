import { IconButton, Tooltip } from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import copy from 'clipboard-copy'
import React, { FC, useState } from 'react'

import { Recipe } from '../../../../model/model'
import { PATHS } from '../../../Routes/Routes'

export const RecipeResultShare: FC<Pick<Recipe, 'name'>> = ({ name }) => {
    const [copied, setCopied] = useState(false)

    const handleShareBtnClick = () => {
        copy(encodeURI(`${document.location.origin}${PATHS.details(name)}`)).then(() => {
            setCopied(true)
        })
    }

    return (
        <Tooltip
            onMouseOut={() => setCopied(false)}
            title={copied ? 'In der Zwischenablage gespeichert' : 'Rezept teilen'}>
            <IconButton onClick={handleShareBtnClick}>
                <ShareIcon />
            </IconButton>
        </Tooltip>
    )
}
