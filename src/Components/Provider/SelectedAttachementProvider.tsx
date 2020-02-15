import { Backdrop, Card, createStyles, makeStyles, Slide } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { FC, useContext, useEffect, useState } from 'react'

import { DataUrl } from '../../model/model'
import { BORDER_RADIUS } from '../../theme'
import { useRouterContext } from './RouterProvider'

interface AttachmentSelect {
    setSelectedAttachment: React.Dispatch<React.SetStateAction<DataUrl | null>>
}

const Context = React.createContext<AttachmentSelect | null>(null)

export const useSelectedAttachement = () => useContext(Context) as AttachmentSelect

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            paddingBottom: theme.spacing(8),
            paddingTop: theme.spacing(8),
            zIndex: theme.zIndex.modal,
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
        },
        attachment: {
            maxHeight: '100%',
            overflow: 'auto',
            [theme.breakpoints.only('xs')]: {
                maxWidth: '90%',
            },
            [theme.breakpoints.only('sm')]: {
                maxWidth: '80%',
            },
            [theme.breakpoints.only('md')]: {
                maxWidth: '70%',
            },
            [theme.breakpoints.only('lg')]: {
                maxWidth: '60%',
            },
            [theme.breakpoints.up('xl')]: {
                maxHeight: '80%',
            },
            borderRadius: BORDER_RADIUS,
        },
        skeletonCard: {
            height: '80%',
            [theme.breakpoints.only('xs')]: {
                width: '90%',
            },
            [theme.breakpoints.only('sm')]: {
                width: '80%',
            },
            [theme.breakpoints.only('md')]: {
                width: '70%',
            },
            [theme.breakpoints.only('lg')]: {
                width: '60%',
            },
            [theme.breakpoints.up('xl')]: {
                width: '30%',
            },
        },
    })
)

const SelectedAttachementProvider: FC = ({ children }) => {
    const [selectedAttachment, setSelectedAttachment] = useState<DataUrl | null>(null)
    const [imgSrc, setImgSrc] = useState<string | undefined>()

    const { location } = useRouterContext()
    const classes = useStyles()

    useEffect(() => {
        if (!selectedAttachment) return setImgSrc(undefined)

        const img = new Image()
        img.onload = () => setImgSrc(img.src)
        img.src = selectedAttachment.dataUrl
    }, [selectedAttachment])

    useEffect(() => {
        setSelectedAttachment(null)
    }, [location.pathname])

    useEffect(() => {
        const root = document.getElementsByTagName('html')[0]
        if (selectedAttachment) root.setAttribute('style', 'overflow: hidden;')
        if (!selectedAttachment) root.removeAttribute('style')
    }, [selectedAttachment])

    return (
        <>
            <Context.Provider value={{ setSelectedAttachment }}>{children}</Context.Provider>
            <Slide direction="up" in={Boolean(selectedAttachment)}>
                <Backdrop
                    open
                    onClick={() => setSelectedAttachment(null)}
                    className={classes.backdrop}>
                    {imgSrc ? (
                        <img src={imgSrc} className={classes.attachment} alt="selected" />
                    ) : (
                        <Card className={classes.skeletonCard}>
                            <Skeleton width="100%" height="100%" variant="rect" />
                        </Card>
                    )}
                </Backdrop>
            </Slide>
        </>
    )
}

export default SelectedAttachementProvider
