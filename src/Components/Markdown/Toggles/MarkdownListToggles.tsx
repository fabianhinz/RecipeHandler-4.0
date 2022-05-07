import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import { ToggleButton } from '@material-ui/lab'
import React from 'react'

import { CurrentFormats, ToggleChangeHandler } from '../MarkdownInput'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownListToggles = ({ formats, onToggleChange }: ToggleChangeHandler & CurrentFormats) => {
  return (
    <MarkdownToggleButtonGroup
      value={formats}
      exclusive
      size="small"
      onChange={onToggleChange('list')}>
      <ToggleButton value="bulletedList">
        <FormatListBulletedIcon />
      </ToggleButton>
      <ToggleButton value="numberedList">
        <FormatListNumberedIcon />
      </ToggleButton>
    </MarkdownToggleButtonGroup>
  )
}

export default MarkdownListToggles
