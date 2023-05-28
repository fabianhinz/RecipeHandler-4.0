import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { Grid, IconButton, Theme } from '@mui/material'
import { ToggleButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useState } from 'react'

import { ToggleChangeHandler } from '../MarkdownInput'
import MarkdownPopover from '../MarkdownPopover'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const EMOJIS = [
  '😀',
  '😂',
  '😅',
  '😛',
  '🤑',
  '🤓',
  '⏲',
  '🚫',
  '❌',
  '✅',
  '✌',
  '👌',
  '👏',
  '✍',
  '🖖',
  '🍽',
  '🍻',
  '🍸',
  '🍪',
  '🎂',
]

const useStyles = makeStyles<Theme>(theme => ({
  emojiLabel: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  iconButtonRoot: {
    padding: theme.spacing(1),
    color: 'unset',
  },
}))

const MarkdownEmojiToggle = ({ onToggleChange }: ToggleChangeHandler) => {
  const [emoticonAnchorEl, setEmoticonAnchorEl] =
    useState<HTMLButtonElement | null>(null)

  const classes = useStyles()

  const handleEmojiClick = (emoji: string) => () => {
    setEmoticonAnchorEl(null)
    onToggleChange('emoji')({} as any, emoji as any)
  }

  return (
    <>
      <MarkdownToggleButtonGroup size="small">
        <ToggleButton
          onClick={e => setEmoticonAnchorEl(e.currentTarget)}
          value="emoticonFormat">
          <InsertEmoticonIcon />
          <ArrowDropDownIcon />
        </ToggleButton>
      </MarkdownToggleButtonGroup>

      <MarkdownPopover
        open={Boolean(emoticonAnchorEl)}
        anchorEl={emoticonAnchorEl}
        onClose={() => setEmoticonAnchorEl(null)}>
        <Grid justifyContent="space-evenly" container spacing={1}>
          {EMOJIS.map(emoji => (
            <Grid item key={emoji}>
              <IconButton
                onClick={handleEmojiClick(emoji)}
                classes={{
                  label: classes.emojiLabel,
                  root: classes.iconButtonRoot,
                }}
                size="large">
                {emoji}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </MarkdownPopover>
    </>
  )
}

export default MarkdownEmojiToggle
