import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme => {
    const themeColor = theme.palette.type === 'light' ? '#fff' : '#424242'

    return createStyles({
        root: {
            // maxHeight: (props: ScrollbarMaxHeight) => (props.maxHeight ? props.maxHeight : '100%'),
            // overflowY: 'auto',
            '&::-webkit-scrollbar': {
                backgroundColor: themeColor,
                width: '0.5em',
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: themeColor,
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#babac0',
                borderRadius: 16,
                border: `4px solid #fff ${themeColor}`,
            },
            '&::-webkit-scrollbar-button': {
                display: 'none',
            },
        },
    })
})

interface ScrollbarMaxHeight {
    maxHeight?: string
}

interface Props extends ScrollbarMaxHeight {
    children: React.ReactNode
}

const Scrollbar = ({ children, maxHeight }: Props) => {
    const classes = useStyles({ maxHeight })
    return <div className={classes.root}>{children}</div>
}

export default Scrollbar
