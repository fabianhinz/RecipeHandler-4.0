import { Divider, List, makeStyles, TextField, useTheme } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'

import MarkdownEmojiToggle from './Toggles/MarkdownEmojiToggle'
import MarkdownHeadingToggle, { Heading } from './Toggles/MarkdownHeadingToggle'
import MarkdownLinkToggle from './Toggles/MarkdownLinkToggle'
import MarkdownListToggles from './Toggles/MarkdownListToggles'
import MarkdownTextToggles from './Toggles/MarkdownTextToggles'

type Toggles = 'text' | 'list' | 'heading' | 'emoji' | 'link'

export interface ToggleChangeHandler {
    onToggleChange: (toggle: Toggles) => (_event: any, formatOrEmoji: Format) => void
}

export interface CurrentFormats {
    formats: Format[]
}

const useStyles = makeStyles(theme => ({
    paper: {
        display: 'flex',
        overflowX: 'auto',
    },
    divider: {
        alignSelf: 'stretch',
        height: 'auto',
        margin: theme.spacing(1, 0.5),
    },
    textField: {
        marginTop: theme.spacing(2),
    },
}))

interface Props {
    outerValue: string
    onChange: (value: string) => void
}

type List = 'bulletedList' | 'numberedList'
type Text = 'bold' | 'italic' | 'strikethrough'
type Format = Text | List | Heading

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

const FORMAT_REGEXP = /(?<bold>^\*{2}.*\*{2}$)|(?<italic>^_{1}.*_{1}$)|(?<strikethrough>^~{2}.*~{2}$)|(?<bulletedList>^-\s.*)|(?<numberedList>^\d{1,}.\s.*)|(?<h1>^#\s.*)|(?<h2>^#{2}\s.*)|(?<h3>^#{3}\s.*)|(?<h4>^#{4}\s.*)/g

const MarkdownInput = ({ outerValue, onChange }: Props) => {
    const [value, setValue] = useState('')
    const [inFocus, setInFocus] = useState(false)
    const [formattingDisabled, setFormattingDisabled] = useState(false)

    const [formats, setFormats] = useState<Format[]>([])
    const [markdownSelection, setMarkdownSelection] = useState<string | undefined>(undefined)

    const inputRef = useRef<any>(null)

    const classes = useStyles()
    const theme = useTheme()

    useEffect(() => {
        setValue(outerValue)
    }, [outerValue])

    useEffect(() => {
        const handleSelectionChange = () => {
            if (inFocus) setMarkdownSelection(document.getSelection()?.toString())
        }
        document.addEventListener('selectionchange', handleSelectionChange)
        return () => document.removeEventListener('selectionchange', handleSelectionChange)
    }, [inFocus, markdownSelection])

    useEffect(() => {
        if (!markdownSelection || markdownSelection.length === 0) return setFormats([])

        const newFormat: Format[] = []
        for (const { groups } of markdownSelection.matchAll(FORMAT_REGEXP)) {
            if (groups)
                newFormat.push(
                    ...(Object.keys(groups)
                        .map(group => (groups[group] !== undefined ? group : null))
                        .filter(Boolean) as Format[])
                )
        }
        setFormats(newFormat)
    }, [markdownSelection])

    const handleTogglesChange = (type: Toggles) => (_event: any, formatOrEmoji: Format) => {
        if (formattingDisabled) return
        setFormattingDisabled(true)

        let selectionStart = inputRef.current?.selectionStart
        let selectionEnd = inputRef.current?.selectionEnd

        let selection = value.substring(selectionStart, selectionEnd)
        const beforeSelection = value.substring(0, selectionStart)
        const afterSelection = value.substring(selectionEnd, value.length)

        const markdownStyle = MARKDOWN[formatOrEmoji]

        switch (type) {
            case 'text': {
                const alreadyStyled = selection.slice(0, markdownStyle.length) === markdownStyle

                if (alreadyStyled) {
                    selectionEnd -= markdownStyle.length * 2
                    setValue(
                        beforeSelection +
                            selection.slice(
                                markdownStyle.length,
                                selection.length - markdownStyle.length
                            ) +
                            afterSelection
                    )
                } else {
                    selectionEnd += markdownStyle.length * 2
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
                break
            }
            case 'emoji': {
                if (selectionStart === selectionEnd) {
                    ++selectionStart
                    ++selectionEnd
                }
                setValue(beforeSelection + selection + formatOrEmoji + afterSelection)
                break
            }
            case 'link': {
                selectionEnd += formatOrEmoji.length
                setValue(beforeSelection + selection + formatOrEmoji + afterSelection)
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
                setInFocus(false)
                onChange(value)
            }}
            onFocus={() => setInFocus(true)}>
            <div className={classes.paper}>
                <MarkdownTextToggles formats={formats} onToggleChange={handleTogglesChange} />

                <Divider className={classes.divider} orientation="vertical" />
                <MarkdownListToggles formats={formats} onToggleChange={handleTogglesChange} />

                <Divider className={classes.divider} orientation="vertical" />
                <MarkdownHeadingToggle formats={formats} onToggleChange={handleTogglesChange} />

                <Divider className={classes.divider} orientation="vertical" />
                <MarkdownEmojiToggle onToggleChange={handleTogglesChange} />

                <Divider className={classes.divider} orientation="vertical" />
                <MarkdownLinkToggle onToggleChange={handleTogglesChange} />
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
        </div>
    )
}

export default MarkdownInput
