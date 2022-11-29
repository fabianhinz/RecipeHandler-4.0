import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import { ToggleButton } from '@material-ui/lab'
import clsx from 'clsx'
import { useState } from 'react'

import { CurrentFormats, ToggleChangeHandler } from '../MarkdownInput'
import MarkdownPopover from '../MarkdownPopover'
import MarkdownToggleButtonGroup from './MarkdownToggleButtonGroup'

export type Heading = 'h1' | 'h2' | 'h3' | 'h4'

interface HeadingToggle {
  heading: Heading
  label: string
}

const HEADINGS: HeadingToggle[] = [
  { heading: 'h1', label: 'Überschrift 1' },
  { heading: 'h2', label: 'Überschrift 2' },
  { heading: 'h3', label: 'Überschrift 3' },
  { heading: 'h4', label: 'Überschrift 4' },
]

const useStyles = makeStyles(() => ({
  hRoot: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 24,
  },
  h3: {
    fontSize: 18.72,
  },
  h4: {
    fontSize: 16,
  },
}))

const MarkdownHeadingToggle = ({
  formats,
  onToggleChange,
}: ToggleChangeHandler & CurrentFormats) => {
  const [headingAnchorEl, setHeadingAnchorEl] =
    useState<HTMLButtonElement | null>(null)

  const classes = useStyles()

  const handleHeadingClick = (heading: Heading) => () => {
    setHeadingAnchorEl(null)
    onToggleChange('heading')({} as any, heading)
  }

  return (
    <>
      <MarkdownToggleButtonGroup size="small" value={formats}>
        <ToggleButton
          onClick={e => setHeadingAnchorEl(e.currentTarget)}
          value="textFormat">
          <TextFormatIcon />
          <ArrowDropDownIcon />
        </ToggleButton>
      </MarkdownToggleButtonGroup>

      <MarkdownPopover
        open={Boolean(headingAnchorEl)}
        anchorEl={headingAnchorEl}
        onClose={() => setHeadingAnchorEl(null)}>
        <List>
          {HEADINGS.map(({ heading, label }) => (
            <ListItem
              key={heading}
              button
              selected={formats.some(format => format === heading)}
              onClick={handleHeadingClick(heading)}>
              <ListItemText
                primary={
                  <div className={clsx(classes.hRoot, classes[heading])}>
                    {label}
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      </MarkdownPopover>
    </>
  )
}

export default MarkdownHeadingToggle
