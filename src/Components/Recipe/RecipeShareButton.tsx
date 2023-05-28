import ShareIcon from '@mui/icons-material/Share'
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import copy from 'clipboard-copy'
import { useState } from 'react'

import { PATHS } from '@/Components/Routes/Routes'
import { Recipe } from '@/model/model'

import { RecipeButtonSharedProps } from './RecipeBookmarkButton'

type Props = Pick<Recipe, 'name'> & RecipeButtonSharedProps

const RecipeShareButton = (props: Props) => {
  const [copied, setCopied] = useState(false)

  const handleShareBtnClick = () => {
    const url = encodeURI(
      `${document.location.origin}${PATHS.details(props.name)}`
    )
    if (navigator.share)
      navigator.share({
        title: 'RecipeHandler',
        text: props.name,
        url,
      })
    else copy(url).then(() => setCopied(true))
  }

  if (props.variant === 'ListItem') {
    return (
      <ListItem onClick={handleShareBtnClick} button>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText
          primary={navigator.share ? 'Rezept teilen' : 'Link kopieren'}
        />
      </ListItem>
    )
  }

  return (
    <Tooltip
      onMouseOut={() => setCopied(false)}
      title={copied ? 'In der Zwischenablage gespeichert' : 'Rezept teilen'}>
      <IconButton onClick={handleShareBtnClick} size="large">
        <ShareIcon />
      </IconButton>
    </Tooltip>
  )
}

export default RecipeShareButton
