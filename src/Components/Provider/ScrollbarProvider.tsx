import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC, useContext, useState } from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100vh',
            width: '100vw',
            overflowY: 'auto',
        },
        light: {
            '&::-webkit-scrollbar': {
                backgroundColor: '#fff',
                width: 16,
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#fff',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#babac0',
                borderRadius: 16,
                border: '4px solid #fff',
            },
            '&::-webkit-scrollbar-button': {
                display: 'none',
            },
        },
        dark: {
            '&::-webkit-scrollbar': {
                backgroundColor: '#424242',
                width: 16,
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#424242',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#babac0',
                borderRadius: 16,
                border: '4px solid #424242',
            },
            '&::-webkit-scrollbar-button': {
                display: 'none',
            },
        },
    })
)

interface Scrollbar {
    setScrollbar: (type: 'light' | 'dark') => void
}

const Context = React.createContext<Scrollbar | null>(null)

export const useScrollbar = () => useContext(Context) as Scrollbar

const ScrollbarProvider: FC = ({ children }) => {
    const [scrollbar, setScrollbar] = useState<'light' | 'dark'>('light')
    const classes = useStyles()
    return (
        <div className={clsx(classes.root, scrollbar === 'dark' ? classes.dark : classes.light)}>
            <Context.Provider value={{ setScrollbar }}>{children}</Context.Provider>
        </div>
    )
}

export default ScrollbarProvider
