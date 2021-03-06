import { IconButton, Tooltip } from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import copy from 'clipboard-copy'
import React, { useState } from 'react'

import { Recipe } from '../../model/model'
import { PATHS } from '../Routes/Routes'

type Props = Pick<Recipe, 'name'>

const RecipeShareButton = ({ name }: Props) => {
    const [copied, setCopied] = useState(false)

    const handleShareBtnClick = () => {
        const url = encodeURI(`${document.location.origin}${PATHS.details(name)}`)
        if (navigator.share)
            navigator.share({
                title: 'RecipeHandler',
                text: name,
                url,
            })
        else copy(url).then(() => setCopied(true))
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

export default RecipeShareButton
