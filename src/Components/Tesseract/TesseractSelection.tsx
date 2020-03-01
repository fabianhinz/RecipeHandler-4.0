import {
    Avatar,
    ButtonBase,
    Chip,
    CircularProgress,
    createStyles,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    makeStyles,
    Typography,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import clsx from 'clsx'
import { ContentSave, ImageSearch } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createWorker, Paragraph } from 'tesseract.js'

import { useAttachmentDropzone } from '../../hooks/useAttachmentDropzone'
import { Recipe } from '../../model/model'
import SelectionDrawer from '../Shared/SelectionDrawer'

interface StyleProps {
    ready: boolean
    progress?: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: '100%',
            height: 125,
            position: 'relative',
            backgroundColor: ({ ready }: StyleProps) =>
                ready ? theme.palette.secondary.main : 'inherhit',
        },
        actionContainer: {
            width: '100%',
        },
        baseButton: {
            width: '100%',
        },
        actionCameraIcon: {
            color: ({ ready }: StyleProps) =>
                ready ? theme.palette.getContrastText(theme.palette.secondary.main) : 'inherit',
            fontSize: theme.typography.pxToRem(60),
            zIndex: 1,
        },
        progress: {
            position: 'absolute',
            width: '0%',
            height: '100%',
            bottom: 0,
            left: 0,
            backgroundColor: '#81c784',
            transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeIn,
            }),
        },
        progressHeight: {
            width: ({ progress }: StyleProps) => {
                if (!progress || progress === 0) return '0%'
                else return `${progress * 100}%`
            },
        },
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(4.5)}px)`,
        },
        subheader: {
            backgroundColor: theme.palette.background.paper,
            marginLeft: -theme.spacing(2),
            marginRight: -theme.spacing(2),
        },
        text: {
            marginBottom: theme.spacing(1),
        },
    })
)

export type TesseractResult = { text: Text; recipePart: RecipeParts }
export type TesseractResults = TesseractResult[]

interface TesseractLog {
    workerId: string
    status:
        | 'loading tesseract core'
        | 'initializing tesseract'
        | 'initialized tesseract'
        | 'loading language traineddata'
        | 'loaded language traineddata'
        | 'initializing api'
        | 'initialized api'
        | 'recognizing text'
    progress: number
}

type RecipeParts = keyof Pick<Recipe, 'ingredients' | 'description'> | undefined
type Text = string
type JobId = string
type ParagraphsMap = Map<JobId, Pick<Paragraph, 'text' | 'confidence'>[]>
type ResultsMap = Map<Text, RecipeParts>

interface Props {
    onSave: (results: TesseractResults) => void
}

const TesseractSelection = ({ onSave }: Props) => {
    const [log, setLog] = useState<TesseractLog | undefined>()
    const [paragraphs, setParagraphs] = useState<ParagraphsMap>(new Map())
    const [results, setResults] = useState<ResultsMap>(new Map())

    const workerRef = useRef<Tesseract.Worker | null>(null)

    const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
        attachmentLimit: 5,
    })

    const tesseractReady = Boolean(
        log?.status === 'initialized api' || log?.status === 'recognizing text'
    )
    const classes = useStyles({
        ready: tesseractReady,
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
        initTesseract()

        return () => {
            workerRef.current?.terminate()
        }
    }, [initTesseract])

    useEffect(() => {
        if (dropzoneAttachments.length === 0 || !workerRef.current) return
        ;(async () => {
            for (const { dataUrl } of dropzoneAttachments) {
                const {
                    jobId,
                    data: { paragraphs },
                } = await workerRef.current!.recognize(dataUrl)
                setParagraphs(
                    prev =>
                        new Map(
                            prev.set(
                                jobId,
                                paragraphs.map(({ text, confidence }) => ({
                                    text,
                                    confidence,
                                }))
                            )
                        )
                )
            }
        })()
    }, [dropzoneAttachments])

    const handleMemberButtonsClick = (item: string, recipeParts: RecipeParts) => () => {
        setResults(previous => {
            if (previous.get(item) && previous.get(item) === recipeParts)
                previous.set(item, undefined)
            else previous.set(item, recipeParts)

            return new Map(previous)
        })
    }

    const getValidResults = () =>
        [...results.entries()]
            .filter(([, recipePart]) => Boolean(recipePart))
            .map(([item, recipePart]) => ({ text: item, recipePart } as TesseractResult))

    return (
        <SelectionDrawer
            action={
                <IconButton onClick={() => onSave(getValidResults())}>
                    <ContentSave />
                </IconButton>
            }
            buttonProps={{
                startIcon: <ImageSearch />,
                label: 'Einscannen',
            }}
            header={
                <div className={classes.actionContainer}>
                    <ButtonBase
                        className={classes.baseButton}
                        disabled={!tesseractReady}
                        {...dropzoneProps.getRootProps()}>
                        <Avatar variant="rounded" className={classes.avatar}>
                            {tesseractReady ? (
                                <ImageSearch className={classes.actionCameraIcon} />
                            ) : (
                                <CircularProgress
                                    color="secondary"
                                    disableShrink
                                    size={60}
                                    thickness={5.4}
                                />
                            )}
                            <div className={clsx(classes.progress, classes.progressHeight)} />
                        </Avatar>
                        <input {...dropzoneProps.getInputProps()} />
                    </ButtonBase>
                </div>
            }>
            <List disablePadding>
                {[...paragraphs.entries()].map(([jobId, paragraph], index) => (
                    <div key={jobId}>
                        <ListSubheader className={classes.subheader}>Nr. {++index}</ListSubheader>
                        {paragraph.map(({ text, confidence }, index) => (
                            <ListItem disableGutters key={index}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        zIndex: -1,
                                        height: '95%',
                                        backgroundColor: 'rgba(255, 183, 77, 0.15)',
                                        marginLeft: -16,
                                        width: `calc(100% + 32px)`,
                                    }}>
                                    <div
                                        style={{
                                            width: `${confidence}%`,
                                            height: '100%',
                                            backgroundColor: 'rgba(255, 183, 77, 0.3)',
                                        }}
                                    />
                                </div>

                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography className={classes.text}>{text}</Typography>
                                    }
                                    secondary={
                                        <Grid container justify="flex-end" spacing={1}>
                                            <Grid item>
                                                <Chip
                                                    icon={<AssignmentIcon />}
                                                    color={
                                                        results.get(text) === 'description'
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                    onClick={handleMemberButtonsClick(
                                                        text,
                                                        'description'
                                                    )}
                                                    label="Beschreibung"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Chip
                                                    icon={<BookIcon />}
                                                    color={
                                                        results.get(text) === 'ingredients'
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                    onClick={handleMemberButtonsClick(
                                                        text,
                                                        'ingredients'
                                                    )}
                                                    label="Zutaten"
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                />
                            </ListItem>
                        ))}
                    </div>
                ))}
            </List>
        </SelectionDrawer>
    )
}

export default TesseractSelection
