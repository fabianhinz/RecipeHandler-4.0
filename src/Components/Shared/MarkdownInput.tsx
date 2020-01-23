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
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
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

const HEADINGS = ['h1', 'h2', 'h3', 'h4']

const MarkdownInput = ({ defaultValue, onChange }: Props) => {
    const [value, setValue] = useState(defaultValue)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const classes = useStyles()

    const handleFormat = (_event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
        console.log(newFormats)
        const selectedText = window.getSelection()?.toString()
        console.log(selectedText)
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div onBlur={() => onChange(value)}>
            <Paper elevation={0} className={classes.paper}>
                <StyledToggleButtonGroup size="small" value="" onChange={handleFormat}>
                    <ToggleButton value="bold">
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic">
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="underlined">
                        <FormatUnderlinedIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>

                <Divider className={classes.divider} orientation="vertical" />

                <StyledToggleButtonGroup value="" size="small" onChange={handleFormat}>
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
                fullWidth
                multiline
                variant="outlined"
                margin="dense"
            />

            <Popover
                classes={{ paper: classes.popoverPaper }}
                id={anchorEl ? 'simple-popover' : undefined}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
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
                                setAnchorEl(null)
                                handleFormat({} as any, [heading])
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
