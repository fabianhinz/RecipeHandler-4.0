import { Avatar, ButtonBase, CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { ImageSearch } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createWorker, Paragraph } from 'tesseract.js'

import { useAttachmentDropzone } from '../../hooks/useAttachmentDropzone'
import { Recipe, TesseractLog, TesseractResult } from '../../model/model'
import SelectionDrawer from '../Shared/SelectionDrawer'
import TesseractParagraph from './TesseractParagraph'

interface StyleProps {
    progress?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        dropzoneAvatar: {
            width: '100%',
            height: 100,
            position: 'relative',
        },
        dropzoneButton: {
            width: '100%',
        },
        dropzoneIcon: {
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

interface Props extends Pick<Recipe, 'description' | 'ingredients'> {
    onChange: (result: TesseractResult) => void
}

const TesseractSelection = ({ onChange, ingredients, description }: Props) => {
    const [shouldLoad, setShouldLoad] = useState(false)
    const [log, setLog] = useState<TesseractLog | undefined>()
    const [paragraphs, setParagraphs] = useState<Pick<Paragraph, 'text' | 'confidence'>[]>([])

    const workerRef = useRef<Tesseract.Worker | null>(null)

    const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
        attachmentLimit: 5,
        attachmentMaxSize: 0.5,
    })

    const classes = useStyles({
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
                    ...data.paragraphs
                        .filter(({ text }) => !prev.find(({ text: prevText }) => prevText === text))
                        .map(({ text, confidence }) => ({ text, confidence })),
                ])
            }
            setLog({ status: 'initialized api' })
        })()
    }, [dropzoneAttachments])

    return (
        <SelectionDrawer
            onOpen={() => setShouldLoad(true)}
            onClose={() => setShouldLoad(false)}
            buttonProps={{
                startIcon: <ImageSearch />,
                label: 'Einscannen',
            }}>
            <ButtonBase
                className={classes.dropzoneButton}
                disabled={log?.status !== 'initialized api'}
                {...dropzoneProps.getRootProps()}>
                <Avatar variant="rounded" className={classes.dropzoneAvatar}>
                    {log?.status === 'initialized api' || log?.status === 'recognizing text' ? (
                        <ImageSearch className={classes.dropzoneIcon} />
                    ) : (
                        <CircularProgress
                            color="secondary"
                            disableShrink
                            size={60}
                            thickness={5.4}
                        />
                    )}
                    <div className={clsx(classes.progressRoot, classes.progressAnimated)} />
                </Avatar>
                <input {...dropzoneProps.getInputProps()} />
            </ButtonBase>
            {paragraphs.map((paragraph, index) => (
                <TesseractParagraph
                    descriptionChecked={description.includes(paragraph.text)}
                    ingredientsChecked={ingredients.includes(paragraph.text)}
                    key={index}
                    onChipClick={onChange}
                    {...paragraph}
                />
            ))}
        </SelectionDrawer>
    )
}

export default TesseractSelection
