import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import { ToggleButton } from '@mui/material'

import { CurrentFormats, ToggleChangeHandler } from '../MarkdownInput'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownListToggles = ({
  formats,
  onToggleChange,
}: ToggleChangeHandler & CurrentFormats) => {
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
