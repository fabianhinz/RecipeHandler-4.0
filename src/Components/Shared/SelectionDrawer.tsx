import {
    Button,
    ButtonProps,
    createStyles,
    Drawer,
    IconButton,
    makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useEffect, useRef, useState } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        buttonRoot: {
            fontFamily: 'Ubuntu',
            textTransform: 'unset',
        },
        buttonLabel: {
            justifyContent: 'flex-start',
        },
        paper: {
            [theme.breakpoints.between('xs', 'md')]: {
                width: 320,
            },
            [theme.breakpoints.up('lg')]: {
                width: 480,
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            userSelect: 'none',
        },
        header: {
            padding: theme.spacing(1),
            paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
        },
        container: {
            flexGrow: 1,
            padding: theme.spacing(2),
            paddingTop: 0,
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
        },
        action: {
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: theme.spacing(1),
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        },
    })
)

type RenderProp = (closeDrawer: () => void) => React.ReactNode

interface Props {
    buttonProps: Omit<ButtonProps, 'children'> & { label: React.ReactText; highlight?: boolean }
    children: React.ReactNode | RenderProp
    header?: React.ReactNode
    action?: React.ReactNode
    onOpen?: () => void
    onClose?: () => void
}

const SelectionDrawer = ({ buttonProps, children, header, onOpen, onClose, action }: Props) => {
    const [open, setOpen] = useState(false)
    const prevOpen = useRef(open)

    const classes = useStyles()

    useEffect(() => {
        if (prevOpen.current === open) return

        if (open && onOpen) onOpen()
        else if (!open && onClose) onClose()

        prevOpen.current = open
    }, [open, onOpen, onClose])

    const closeDrawer = () => setOpen(false)
    const openDrawer = () => setOpen(true)

    const { label, highlight, ...muiButtonProps } = buttonProps

    return (
        <>
            <Button
                onClick={openDrawer}
                variant="outlined"
                size="large"
                classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
                fullWidth
                color={highlight ? 'secondary' : 'default'}
                {...muiButtonProps}>
                {label}
            </Button>

            <Drawer
                PaperProps={{ className: classes.paper }}
                open={open}
                onClose={closeDrawer}
                anchor="right"
                keepMounted>
                <div className={classes.header}>{header}</div>
                <div className={classes.container}>
                    {typeof children === 'function' ? children(closeDrawer) : children}
                </div>
                <div className={classes.action}>
                    <IconButton onClick={closeDrawer}>
                        <CloseIcon />
                    </IconButton>
                    {action && <div onClick={closeDrawer}>{action}</div>}
                </div>
            </Drawer>
        </>
    )
}

export default SelectionDrawer
