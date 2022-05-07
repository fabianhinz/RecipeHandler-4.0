import { Grid, IconButton, TextField } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import LinkIcon from '@material-ui/icons/Link'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import { ToggleButton } from '@material-ui/lab'
import { Earth } from 'mdi-material-ui'
import React, { useState } from 'react'

import { ToggleChangeHandler } from '../MarkdownInput'
import MarkdownPopover from '../MarkdownPopover'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownLinkToggle = ({ onToggleChange }: ToggleChangeHandler) => {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLButtonElement | null>(null)

  const resetLinkState = () => {
    setLinkAnchorEl(null)
    setText('')
    setUrl('')
  }

  const handleLinkSubmit = () => {
    onToggleChange('link')({} as any, `[${text}](${url})` as any)
    resetLinkState()
  }

  return (
    <>
      <MarkdownToggleButtonGroup size="small">
        <ToggleButton onClick={e => setLinkAnchorEl(e.currentTarget)} value="linkFormat">
          <LinkIcon />
          <ArrowDropDownIcon />
        </ToggleButton>
      </MarkdownToggleButtonGroup>

      <MarkdownPopover
        open={Boolean(linkAnchorEl)}
        anchorEl={linkAnchorEl}
        onClose={() => setLinkAnchorEl(null)}>
        <Grid container direction="column" spacing={2} alignItems="flex-end">
          <Grid item>
            <TextField
              label="Text"
              fullWidth
              variant="outlined"
              value={text}
              onChange={e => setText(e.target.value)}
              InputProps={{ endAdornment: <EyeIcon /> }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Url"
              fullWidth
              variant="outlined"
              value={url}
              onChange={e => setUrl(e.target.value)}
              type=""
              InputProps={{ endAdornment: <Earth /> }}
            />
          </Grid>
          <Grid item container justifyContent="space-evenly">
            <Grid item>
              <IconButton onClick={resetLinkState}>
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleLinkSubmit}>
                <CheckIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </MarkdownPopover>
    </>
  )
}

export default MarkdownLinkToggle
