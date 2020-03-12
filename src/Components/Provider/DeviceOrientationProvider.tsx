import { Dialog, Typography } from '@material-ui/core'
import React, { FC, useContext, useEffect, useState } from 'react'

import { useBreakpointsContext } from './BreakpointsProvider'

interface Orientation {
    portrait: boolean
    landscape: boolean
}

const Context = React.createContext<Orientation | null>(null)

export const useDeviceOrientationContext = () => useContext(Context) as Orientation

const DeviceOrientationProvider: FC = ({ children }) => {
    const { isLowRes } = useBreakpointsContext()
    const [suggestionDialog, setSuggestionDialog] = useState(
        (window.orientation === 90 || window.orientation === -90) && isLowRes
    )

    useEffect(() => {
        const handleOrientationChange = () => {
            if ((window.orientation === 90 || window.orientation === -90) && isLowRes)
                (async () => {
                    try {
                        await window.screen.orientation.lock('portrait')
                    } catch {
                        // ? on unsupported devices fallback to a simple Dialog: https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock#Browser_compatibility
                        setSuggestionDialog(true)
                    }
                })()
            else setSuggestionDialog(false)
        }

        window.addEventListener('orientationchange', handleOrientationChange)
        return () => window.removeEventListener('orientationchange', handleOrientationChange)
    }, [isLowRes])

    return (
        <>
            <Context.Provider value={{ landscape: false, portrait: false }}>
                {children}
            </Context.Provider>
            <Dialog
                open={suggestionDialog}
                fullScreen
                PaperProps={{
                    style: { display: 'flex', justifyContent: 'center', flexDirection: 'column' },
                }}>
                <Typography variant="h4" align="center">
                    Anzeige im Landscape wird nicht unterstützt
                </Typography>
            </Dialog>
        </>
    )
}

export default DeviceOrientationProvider
