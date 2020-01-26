import {
    createStyles,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Popover,
    PopoverProps,
    TextField,
    useTheme,
    withStyles,
} from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import FormatStrikethroughIcon from '@material-ui/icons/FormatStrikethrough'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import React, { useEffect, useRef, useState } from 'react'

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
            overflowX: 'auto',
        },
        divider: {
            alignSelf: 'stretch',
            height: 'auto',
            margin: theme.spacing(1, 0.5),
        },
        popoverPaper: {
            padding: theme.spacing(1),
            [theme.breakpoints.only('xs')]: {
                maxWidth: 150,
            },
            [theme.breakpoints.up('sm')]: {
                maxWidth: 300,
            },
            maxHeight: 300,
            overflowY: 'auto',
        },
        textField: {
            marginTop: theme.spacing(2),
        },
        emojiLabel: {
            width: theme.spacing(4),
            heigth: theme.spacing(4),
        },
        iconButtonRoot: {
            padding: theme.spacing(1),
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

interface HeadingToggle {
    heading: Heading
    label: string
}

interface MarkdownSelection {
    value: string | undefined
    isFocused: boolean
}

const HEADINGS: HeadingToggle[] = [
    { heading: 'h1', label: 'Überschrift 1' },
    { heading: 'h2', label: 'Überschrift 2' },
    { heading: 'h3', label: 'Überschrift 3' },
    { heading: 'h4', label: 'Überschrift 4' },
]

const MARKDOWN: Record<Format, string> = {
    bold: '**',
    italic: '_',
    strikethrough: '~~',
    bulletedList: '- ',
    numberedList: '1. ',
    h1: '# ',
    h2: '## ',
    h3: '### ',
    h4: '#### ',
}

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

const popoverOriginProps: Pick<PopoverProps, 'anchorOrigin' | 'transformOrigin'> = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
}

const FORMAT_REGEXP = /(?<bold>^\*{2}.*\*{2}$)|(?<italic>^_{1}.*_{1}$)|(?<strikethrough>^~{2}.*~{2}$)|(?<bulletedList>^-\s.*)|(?<numberedList>^\d{1,}.\s.*)|(?<h1>^#\s.*)|(?<h2>^#{2}\s.*)|(?<h3>^#{3}\s.*)|(?<h4>^#{4}\s.*)/

const MarkdownInput = ({ defaultValue, onChange }: Props) => {
    const [value, setValue] = useState(defaultValue)
    const [formattingDisabled, setFormattingDisabled] = useState(false)

    const [currentFormat, setCurrentFormat] = useState<Format[]>([])
    const [currentSelection, setCurrentSelection] = useState<MarkdownSelection>({
        value: '',
        isFocused: false,
    })

    const inputRef = useRef<any>(null)

    const [headingAnchorEl, setHeadingAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [emoticonAnchorEl, setEmoticonAnchorEl] = useState<HTMLButtonElement | null>(null)

    const classes = useStyles()
    const theme = useTheme()

    useEffect(() => {
        const handleSelectionChange = () => {
            if (!currentSelection.isFocused) return
            setCurrentSelection(prev => ({ ...prev, value: document.getSelection()?.toString() }))
        }
        document.addEventListener('selectionchange', handleSelectionChange)
        return () => document.removeEventListener('selectionchange', handleSelectionChange)
    }, [currentSelection.isFocused])

    useEffect(() => {
        if (!currentSelection.value || !currentSelection.isFocused) return setCurrentFormat([])

        const newFormat: Format[] = []
        for (const { groups } of currentSelection.value.matchAll(FORMAT_REGEXP)) {
            if (groups)
                newFormat.push(
                    ...(Object.keys(groups)
                        .map(group => (groups[group] !== undefined ? group : null))
                        .filter(Boolean) as Format[])
                )
        }
        setCurrentFormat(newFormat)
    }, [currentSelection.isFocused, currentSelection.value])

    // ! ToDo handle links
    const handleTogglesChange = (type: 'text' | 'list' | 'heading' | 'emoji') => (
        _event: React.MouseEvent<HTMLElement, MouseEvent>,
        formatOrEmoji: Format
    ) => {
        if (formattingDisabled) return
        setFormattingDisabled(true)

        let selectionStart = inputRef.current?.selectionStart
        let selectionEnd = inputRef.current?.selectionEnd

        const selection = value.substring(selectionStart, selectionEnd)
        const beforeSelection = value.substring(0, selectionStart)
        const afterSelection = value.substring(selectionEnd, value.length)

        const markdownStyle = MARKDOWN[formatOrEmoji]

        switch (type) {
            case 'text': {
                const alreadyStyled = beforeSelection.slice(-markdownStyle.length) === markdownStyle

                if (alreadyStyled) {
                    selectionStart -= markdownStyle.length
                    selectionEnd -= markdownStyle.length
                    setValue(
                        beforeSelection.slice(0, beforeSelection.length - markdownStyle.length) +
                            selection +
                            afterSelection.slice(markdownStyle.length)
                    )
                } else {
                    selectionStart += markdownStyle.length
                    selectionEnd += markdownStyle.length
                    setValue(
                        beforeSelection + markdownStyle + selection + markdownStyle + afterSelection
                    )
                }
                break
            }
            case 'list':
            case 'heading': {
                const alreadyStyled = selection.slice(0, markdownStyle.length) === markdownStyle
                const selectionParts = selection.split('\n')

                if (alreadyStyled) {
                    selectionEnd -= selectionParts.length * markdownStyle.length
                    setValue(
                        beforeSelection +
                            selectionParts
                                .map(
                                    selection => (selection = selection.replace(markdownStyle, ''))
                                )
                                .join('\n') +
                            afterSelection
                    )
                } else {
                    selectionEnd += selectionParts.length * markdownStyle.length
                    setValue(
                        beforeSelection +
                            selectionParts
                                .map(selection => (selection = markdownStyle + selection))
                                .join('\n') +
                            afterSelection
                    )
                }
                setHeadingAnchorEl(null)
                break
            }
            case 'emoji': {
                ++selectionStart
                ++selectionEnd
                setEmoticonAnchorEl(null)
                setValue(prev => `${prev}${formatOrEmoji}`)
                break
            }
        }
        // ? give the ui some time to breath -_-
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
            setFormattingDisabled(false)
        }, theme.transitions.duration.enteringScreen)
    }

    return (
        <div
            onBlur={() => {
                onChange(value)
                setCurrentSelection({ value: '', isFocused: false })
            }}
            onFocus={() => setCurrentSelection({ value: '', isFocused: true })}>
            <div className={classes.paper}>
                <StyledToggleButtonGroup
                    size="small"
                    value={currentFormat}
                    exclusive
                    onChange={handleTogglesChange('text')}>
                    <ToggleButton value="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="strikethrough">
                        <FormatStrikethroughIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />

                <StyledToggleButtonGroup
                    value={currentFormat}
                    exclusive
                    size="small"
                    onChange={handleTogglesChange('list')}>
                    <ToggleButton value="bulletedList">
                        <FormatListBulletedIcon />
                    </ToggleButton>
                    <ToggleButton value="numberedList">
                        <FormatListNumberedIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />

                <StyledToggleButtonGroup size="small">
                    <ToggleButton
                        onClick={e => setHeadingAnchorEl(e.currentTarget)}
                        value="textFormat">
                        <TextFormatIcon />
                        <ArrowDropDownIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />

                <StyledToggleButtonGroup size="small" value="">
                    <ToggleButton
                        onClick={e => setEmoticonAnchorEl(e.currentTarget)}
                        value="emoticonFormat">
                        <InsertEmoticonIcon />
                        <ArrowDropDownIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </div>

            <TextField
                inputRef={inputRef}
                value={value}
                rows={15}
                className={classes.textField}
                onChange={e => setValue(e.target.value)}
                fullWidth
                multiline
                variant="outlined"
            />

            <Popover
                classes={{ paper: classes.popoverPaper }}
                open={Boolean(headingAnchorEl)}
                anchorEl={headingAnchorEl}
                onClose={() => setHeadingAnchorEl(null)}
                {...popoverOriginProps}>
                <List>
                    {HEADINGS.map(({ heading, label }) => (
                        <ListItem
                            key={heading}
                            button
                            selected={currentFormat.some(format => format === heading)}
                            onClick={() => handleTogglesChange('heading')({} as any, heading)}>
                            <ListItemText
                                primary={<div className={classes[heading]}>{label}</div>}
                            />
                        </ListItem>
                    ))}
                </List>
            </Popover>

            <Popover
                classes={{ paper: classes.popoverPaper }}
                open={Boolean(emoticonAnchorEl)}
                anchorEl={emoticonAnchorEl}
                onClose={() => setEmoticonAnchorEl(null)}
                {...popoverOriginProps}>
                <Grid justify="space-evenly" container spacing={1}>
                    {EMOJIS.map(emoji => (
                        <Grid item key={emoji}>
                            <IconButton
                                onClick={() =>
                                    handleTogglesChange('emoji')({} as any, emoji as any)
                                }
                                classes={{
                                    label: classes.emojiLabel,
                                    root: classes.iconButtonRoot,
                                }}>
                                {emoji}
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </div>
    )
}

export default MarkdownInput
