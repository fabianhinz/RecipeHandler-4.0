import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import LinkIcon from '@mui/icons-material/Link'
import EyeIcon from '@mui/icons-material/RemoveRedEye'
import { Grid, IconButton, TextField } from '@mui/material'
import { ToggleButton } from '@mui/material'
import { Earth } from 'mdi-material-ui'
import { useState } from 'react'

import { ToggleChangeHandler } from '../MarkdownInput'
import MarkdownPopover from '../MarkdownPopover'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownLinkToggle = ({ onToggleChange }: ToggleChangeHandler) => {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLButtonElement | null>(
    null
  )

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
        <ToggleButton
          onClick={e => setLinkAnchorEl(e.currentTarget)}
          value="linkFormat">
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
              <IconButton onClick={resetLinkState} size="large">
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleLinkSubmit} size="large">
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
