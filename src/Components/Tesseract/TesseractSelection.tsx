import { Avatar, ButtonBase, createStyles, IconButton, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { ContentSave, ImageSearch } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createWorker, Paragraph } from 'tesseract.js'

import { useAttachmentDropzone } from '../../hooks/useAttachmentDropzone'
import { TesseractLog, TesseractPart, TesseractResult, TesseractText } from '../../model/model'
import SelectionDrawer from '../Shared/SelectionDrawer'
import TesseractParagraph from './TesseractParagraph'

interface StyleProps {
    apiInitialized: boolean
    progress?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        dropzoneAvatar: {
            width: '100%',
            height: 100,
            position: 'relative',
            backgroundColor: ({ apiInitialized }: StyleProps) =>
                apiInitialized ? theme.palette.secondary.main : 'inherhit',
        },
        dropzoneButton: {
            width: '100%',
        },
        dropzoneIcon: {
            color: ({ apiInitialized }: StyleProps) =>
                apiInitialized
                    ? theme.palette.getContrastText(theme.palette.secondary.main)
                    : 'inherit',
            fontSize: theme.typography.pxToRem(60),

            zIndex: 1,
        },
        progressRoot: {
            position: 'absolute',
            width: '0%',
            height: '100%',
            bottom: 0,
            left: 0,
            backgroundColor: theme.palette.primary.main,
            transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        progressAnimated: {
            width: ({ progress }: StyleProps) => {
                if (!progress || progress === 0) return '0%'
                else return `${progress * 100}%`
            },
        },
    })
)

interface Props {
    onSave: (results: TesseractResult[]) => void
}

const TesseractSelection = ({ onSave }: Props) => {
    const [shouldLoad, setShouldLoad] = useState(false)
    const [log, setLog] = useState<TesseractLog | undefined>()
    const [paragraphs, setParagraphs] = useState<Pick<Paragraph, 'text' | 'confidence'>[]>([])
    const [results, setResults] = useState<Map<TesseractText, TesseractPart>>(new Map())

    const workerRef = useRef<Tesseract.Worker | null>(null)

    const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
        attachmentLimit: 5,
    })

    const apiInitialized = Boolean(log?.status === 'initialized api')
    const classes = useStyles({
        apiInitialized,
        progress: log?.status === 'recognizing text' ? log.progress : undefined,
    })

    const initTesseract = useCallback(async () => {
        const worker = createWorker({
            logger: (log: TesseractLog) => setLog(log),
        })
        await worker.load()
        await worker.loadLanguage('deu')
        await worker.initialize('deu')

        workerRef.current = worker
    }, [])

    useEffect(() => {
        if (shouldLoad) initTesseract()

        return () => {
            workerRef.current?.terminate()
        }
    }, [initTesseract, shouldLoad])

    useEffect(() => {
        if (dropzoneAttachments.length === 0 || !workerRef.current) return
        ;(async () => {
            for (const { dataUrl } of dropzoneAttachments) {
                const { data } = await workerRef.current!.recognize(dataUrl)
                setParagraphs(prev => [
                    ...prev,
                    ...data.paragraphs.map(({ text, confidence }) => ({ text, confidence })),
                ])
            }
            setLog({ status: 'initialized api' })
        })()
    }, [dropzoneAttachments])

    const handleChipClick = (text: TesseractText, parts: TesseractPart) => () => {
        setResults(previous => {
            if (previous.get(text) && previous.get(text) === parts) previous.set(text, undefined)
            else previous.set(text, parts)

            return new Map(previous)
        })
    }

    const getValidResults = () =>
        [...results.entries()]
            .filter(([, recipePart]) => Boolean(recipePart))
            .map(
                ([text, tesseractParts]) =>
                    ({ text, tesseractPart: tesseractParts } as TesseractResult)
            )

    return (
        <SelectionDrawer
            onOpen={() => setShouldLoad(true)}
            onClose={() => setShouldLoad(false)}
            action={
                <IconButton onClick={() => onSave(getValidResults())}>
                    <ContentSave />
                </IconButton>
            }
            buttonProps={{
                startIcon: <ImageSearch />,
                label: 'Einscannen',
            }}>
            <ButtonBase
                className={classes.dropzoneButton}
                disabled={!apiInitialized}
                {...dropzoneProps.getRootProps()}>
                <Avatar variant="rounded" className={classes.dropzoneAvatar}>
                    <ImageSearch className={classes.dropzoneIcon} />
                    <div className={clsx(classes.progressRoot, classes.progressAnimated)} />
                </Avatar>
                <input {...dropzoneProps.getInputProps()} />
            </ButtonBase>
            {paragraphs.map((paragraph, index) => (
                <TesseractParagraph
                    key={index}
                    onChipClick={handleChipClick}
                    results={results}
                    {...paragraph}
                />
            ))}
        </SelectionDrawer>
    )
}

export default TesseractSelection
