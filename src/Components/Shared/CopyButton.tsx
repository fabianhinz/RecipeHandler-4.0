import { IconButton, Tooltip } from '@material-ui/core'
import copy from 'clipboard-copy'
import { ContentCopy } from 'mdi-material-ui'
import { useState } from 'react'

interface Props {
    text: string
}

export default function CopyButton({ text }: Props) {
    const [copied, setCopied] = useState(false)

    return (
        <Tooltip onMouseOut={() => setCopied(false)} title={copied ? 'kopiert' : 'kopieren'}>
            <IconButton onClick={() => copy(text).then(() => setCopied(true))}>
                <ContentCopy />
            </IconButton>
        </Tooltip>
    )
}
