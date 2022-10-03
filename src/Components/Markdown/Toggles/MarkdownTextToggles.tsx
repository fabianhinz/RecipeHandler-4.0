import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatStrikethroughIcon from '@material-ui/icons/FormatStrikethrough'
import { ToggleButton } from '@material-ui/lab'

import { CurrentFormats, ToggleChangeHandler } from '../MarkdownInput'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

const MarkdownTextToggles = ({ formats, onToggleChange }: ToggleChangeHandler & CurrentFormats) => {
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
