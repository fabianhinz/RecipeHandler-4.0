import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import { ToggleButton } from '@mui/material';

import { CurrentFormats, ToggleChangeHandler } from '../MarkdownInput'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownTextToggles = ({
  formats,
  onToggleChange,
}: ToggleChangeHandler & CurrentFormats) => {
  return (
    <MarkdownToggleButtonGroup
      size="small"
      value={formats}
      exclusive
      onChange={onToggleChange('text')}>
      <ToggleButton value="bold">
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value="italic">
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value="strikethrough">
        <FormatStrikethroughIcon />
      </ToggleButton>
    </MarkdownToggleButtonGroup>
  )
}

export default MarkdownTextToggles
