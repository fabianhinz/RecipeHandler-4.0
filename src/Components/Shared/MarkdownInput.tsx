import {
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Paper,
    Popover,
    TextField,
    withStyles,
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import FormatStrikethroughIcon from '@material-ui/icons/FormatStrikethrough'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import React, { useState } from 'react'

const StyledToggleButtonGroup = withStyles(theme => ({
    grouped: {
        border: 'none',
        padding: theme.spacing(0, 1),
        marginRight: theme.spacing(1),
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:last-child': {
            marginRight: 0,
        },
    },
}))(ToggleButtonGroup)

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        divider: {
            alignSelf: 'stretch',
            height: 'auto',
            margin: theme.spacing(1, 0.5),
        },
        popoverPaper: {
            padding: theme.spacing(1),
        },
    })
)

interface Props {
    defaultValue: string
    onChange: (value: string) => void
}

type Heading = 'h1' | 'h2' | 'h3' | 'h4'
type List = 'bulletedList' | 'numberedList'
type Text = 'bold' | 'italic' | 'strikethrough'
type Format = Text | List | Heading

const HEADINGS: Heading[] = ['h1', 'h2', 'h3', 'h4']

const MarkdownInput = ({ defaultValue, onChange }: Props) => {
    const [value, setValue] = useState(defaultValue)
    const [listFormat, setListFormat] = useState<List | null>(null)
    const [selection, setSelection] = useState(0)
    const [headingAnchorEl, setHeadingAnchorEl] = useState<HTMLButtonElement | null>(null)

    const classes = useStyles()

    const handleFormat = (_event: React.MouseEvent<HTMLElement>, newFormat: Format) => {
        console.log(newFormat)
        const selectedText = window.getSelection()?.toString()
        if (selectedText) console.log(selectedText)

        if (newFormat === 'bulletedList' || newFormat === 'numberedList')
            setListFormat(prev => (prev === newFormat ? null : newFormat))
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setHeadingAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setHeadingAnchorEl(null)
    }

    return (
        <div onBlur={() => onChange(value)}>
            <Paper elevation={0} className={classes.paper}>
                <StyledToggleButtonGroup exclusive size="small" value="" onChange={handleFormat}>
                    <ToggleButton value="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="underlined">
                        <FormatStrikethroughIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />

                <StyledToggleButtonGroup
                    exclusive
                    value={listFormat}
                    size="small"
                    onChange={handleFormat}>
                    <ToggleButton value="bulletedList">
                        <FormatListBulletedIcon />
                    </ToggleButton>
                    <ToggleButton value="numberedList">
                        <FormatListNumberedIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />
                <StyledToggleButtonGroup size="small" value="">
                    <ToggleButton
                        aria-describedby="simple-popover"
                        onClick={handleClick}
                        value="color">
                        <TextFormatIcon />
                        <ArrowDropDownIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </Paper>

            <TextField
                label="optional"
                value={value}
                rows={15}
                onChange={e => setValue(e.target.value)}
                onKeyUp={e => {
                    if (e.key === 'Enter' && listFormat === 'bulletedList') {
                        const splittedInput = value.split('\n')
                        const lastInput = splittedInput[splittedInput.length - 2]

                        if (lastInput === '- ') {
                            splittedInput.splice(-2, 2)
                            splittedInput.push('')
                            setValue(splittedInput.join('\n'))
                        } else if (lastInput !== '') setValue(prev => `${prev}- `)
                    }
                }}
                onBlur={e => setSelection(e.target.selectionStart as number)}
                fullWidth
                multiline
                variant="outlined"
                margin="dense"
            />

            <Popover
                classes={{ paper: classes.popoverPaper }}
                id={headingAnchorEl ? 'simple-popover' : undefined}
                open={Boolean(headingAnchorEl)}
                anchorEl={headingAnchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <List>
                    {HEADINGS.map(heading => (
                        <ListItem
                            key={heading}
                            button
                            onClick={() => {
                                setHeadingAnchorEl(null)
                                handleFormat({} as any, heading)
                            }}>
                            <ListItemText primary={heading} />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </div>
    )
}

export default MarkdownInput
