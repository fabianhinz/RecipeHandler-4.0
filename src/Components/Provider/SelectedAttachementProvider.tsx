import { Backdrop, createStyles, makeStyles, Slide } from '@material-ui/core'
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
                maxHeight: '60%',
            },
            borderRadius: BORDER_RADIUS,
        },
    })
)

const SelectedAttachementProvider: FC = ({ children }) => {
    const [selectedAttachment, setSelectedAttachment] = useState<DataUrl | null>(null)
    const { location } = useRouterContext()
    const classes = useStyles()

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
                    {selectedAttachment && (
                        <img
                            src={selectedAttachment.dataUrl}
                            className={classes.attachment}
                            alt="selected"
                        />
                    )}
                </Backdrop>
            </Slide>
        </>
    )
}

export default SelectedAttachementProvider
