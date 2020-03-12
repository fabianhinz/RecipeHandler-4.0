import { Backdrop, createStyles, Fade, makeStyles } from '@material-ui/core'
import React, { FC, useContext, useEffect, useState } from 'react'

import { AllDataUrls } from '../../model/model'
import { BORDER_RADIUS } from '../../theme'
import { useRouterContext } from './RouterProvider'

type SelectedAttachment = AllDataUrls | null

interface AttachmentSelect {
    setSelectedAttachment: React.Dispatch<React.SetStateAction<SelectedAttachment>>
}

const Context = React.createContext<AttachmentSelect | null>(null)

export const useSelectedAttachement = () => useContext(Context) as AttachmentSelect

interface StyleProps {
    blurImg: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            paddingBottom: theme.spacing(8),
            paddingTop: theme.spacing(8),
            zIndex: theme.zIndex.modal,
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: theme.palette.background.paper,
        },
        attachment: {
            filter: ({ blurImg }: StyleProps) => (blurImg ? 'blur(5px)' : 'unset'),
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
    })
)

const SelectedAttachementProvider: FC = ({ children }) => {
    const [selectedAttachment, setSelectedAttachment] = useState<SelectedAttachment>(null)
    const [imgSrc, setImgSrc] = useState<string | undefined>()

    const { location } = useRouterContext()
    const classes = useStyles({ blurImg: !imgSrc })

    useEffect(() => {
        if (!selectedAttachment) return setImgSrc(undefined)

        const img = new Image()
        img.onload = () => setImgSrc(img.src)
        img.src = selectedAttachment.fullDataUrl
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
            <Fade in={Boolean(selectedAttachment)}>
                <Backdrop
                    open
                    onClick={() => setSelectedAttachment(null)}
                    className={classes.backdrop}>
                    <img
                        src={imgSrc || selectedAttachment?.mediumDataUrl}
                        className={classes.attachment}
                        alt="selected"
                    />
                </Backdrop>
            </Fade>
        </>
    )
}

export default SelectedAttachementProvider
