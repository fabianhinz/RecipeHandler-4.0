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
import React, { useRef, useState } from 'react'

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

const HEADINGS: Heading[] = ['h1', 'h2', 'h3', 'h4']
const EMOJIS = [
    '😀',
    '😂',
    '😅',
    '😛',
    '🤑',
    '🤓',
    '🤖',
    '🦁',
    '🦄',
    '🐭',
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

const newFormatOrEmpty = (newFormat: any) => (previousFormat: any) =>
    newFormat !== previousFormat ? newFormat : ''

const MarkdownInput = ({ defaultValue, onChange }: Props) => {
    const [value, setValue] = useState(defaultValue)
    const inputRef = useRef<any>(null)

    const [textFormat, setTextFormat] = useState<Text | null>(null)
    const [listFormat, setListFormat] = useState<List | null>(null)
    const [headingFormat, setHeadingFormat] = useState<Heading | null>(null)

    const [headingAnchorEl, setHeadingAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [emoticonAnchorEl, setEmoticonAnchorEl] = useState<HTMLButtonElement | null>(null)

    const classes = useStyles()
    const theme = useTheme()

    const handleTextFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setValue(event.target.value)
    }

    const handleTogglesChange = (type: 'text' | 'list' | 'heading' | 'emoji') => (
        _event: React.MouseEvent<HTMLElement, MouseEvent>,
        format: any
    ) => {
        switch (type) {
            case 'text': {
                setTextFormat(newFormatOrEmpty(format))
                break
            }
            case 'list': {
                setListFormat(newFormatOrEmpty(format))
                break
            }
            case 'heading': {
                setHeadingAnchorEl(null)
                setHeadingFormat(newFormatOrEmpty(format))
                break
            }
            case 'emoji': {
                setEmoticonAnchorEl(null)
                setValue(prev => `${prev}${format}`)
                break
            }
        }
        // ? give the ui some time to breath -_-
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(
                inputRef.current?.value.length,
                inputRef.current?.value.length
            )
        }, theme.transitions.duration.enteringScreen)
    }

    return (
        <div onBlur={() => onChange(value)}>
            <div className={classes.paper}>
                <StyledToggleButtonGroup
                    exclusive
                    size="small"
                    value={textFormat}
                    onChange={handleTogglesChange('text')}>
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
                    onChange={handleTogglesChange('list')}>
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
                onChange={handleTextFieldChange}
                fullWidth
                multiline
                variant="outlined"
            />

            <Popover
                classes={{ paper: classes.popoverPaper }}
                open={Boolean(headingAnchorEl)}
                anchorEl={headingAnchorEl}
                onClose={() => setHeadingAnchorEl(null)}
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
                            selected={headingFormat === heading}
                            onClick={() => handleTogglesChange('heading')({} as any, heading)}>
                            <ListItemText
                                primary={<div className={classes[heading]}>{heading}</div>}
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
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <Grid justify="space-evenly" container spacing={1}>
                    {EMOJIS.map(emoji => (
                        <Grid item key={emoji}>
                            <IconButton
                                onClick={() => handleTogglesChange('emoji')({} as any, emoji)}
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
