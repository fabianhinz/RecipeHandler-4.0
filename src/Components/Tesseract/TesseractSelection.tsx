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
    makeStyles,
    Typography,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import clsx from 'clsx'
import { ContentSave, ImageSearch } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'

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
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
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
            width: '100%',
            height: '0%',
            bottom: 0,
            left: 0,
            backgroundColor: '#81c784',
            transition: theme.transitions.create('height', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeIn,
            }),
        },
        progressHeight: {
            height: ({ progress }: StyleProps) => {
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
    })
)

type RecipeParts = keyof Pick<Recipe, 'ingredients' | 'description'> | undefined
type TextItem = string
export type TesseractResult = { item: TextItem; recipePart: RecipeParts }
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

interface Props {
    onSave: (results: TesseractResults) => void
}

const TesseractSelection = ({ onSave }: Props) => {
    const [tesseractLog, setTesseractLog] = useState<TesseractLog | undefined>()
    const [textItems, setTextItems] = useState<string[]>([])
    const [results, setResults] = useState<Map<TextItem, RecipeParts>>(new Map())

    const workerRef = useRef<Tesseract.Worker | null>(null)

    const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
        attachmentLimit: 5,
        attachmentMaxWidth: 3840,
    })

    const tesseractReady = Boolean(
        tesseractLog?.status === 'initialized api' || tesseractLog?.status === 'recognizing text'
    )
    const classes = useStyles({
        ready: tesseractReady,
        progress: tesseractLog?.status === 'recognizing text' ? tesseractLog.progress : undefined,
    })

    const initTesseract = useCallback(async () => {
        const worker = createWorker({
            logger: (log: TesseractLog) => setTesseractLog(log),
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
                const { data } = await workerRef.current!.recognize(dataUrl)
                console.log(data)
                setTextItems(prev => [...prev, data.text])
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
            .map(([item, recipePart]) => ({ item, recipePart } as TesseractResult))

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
            }}>
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

            <List>
                {textItems.map((item, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography gutterBottom noWrap>
                                    {item}
                                </Typography>
                            }
                            secondary={
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Chip
                                            icon={<AssignmentIcon />}
                                            color={
                                                results.get(item) === 'description'
                                                    ? 'secondary'
                                                    : 'default'
                                            }
                                            onClick={handleMemberButtonsClick(item, 'description')}
                                            label="Beschreibung"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Chip
                                            icon={<BookIcon />}
                                            color={
                                                results.get(item) === 'ingredients'
                                                    ? 'secondary'
                                                    : 'default'
                                            }
                                            onClick={handleMemberButtonsClick(item, 'ingredients')}
                                            label="Zutaten"
                                        />
                                    </Grid>
                                </Grid>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </SelectionDrawer>
    )
}

export default TesseractSelection
