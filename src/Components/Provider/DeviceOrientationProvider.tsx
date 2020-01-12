import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import React, { FC, useContext, useEffect, useState } from 'react'

import { SlideUp } from '../Shared/Transitions'
import { useBreakpointsContext } from './BreakpointsProvider'

interface Orientation {
    portrait: boolean
    landscape: boolean
}

const Context = React.createContext<Orientation | null>(null)

export const useDeviceOrientationContext = () => useContext(Context) as Orientation

const DeviceOrientationProvider: FC = ({ children }) => {
    const { isMobile } = useBreakpointsContext()
    const [suggestionDialog, setSuggestionDialog] = useState(
        (window.orientation === 90 || window.orientation === -90) && isMobile
    )

    useEffect(() => {
        const handleOrientationChange = () => {
            if ((window.orientation === 90 || window.orientation === -90) && isMobile)
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
    }, [isMobile])

    return (
        <>
            <Context.Provider value={{ landscape: false, portrait: false }}>
                {children}
            </Context.Provider>
            <Dialog TransitionComponent={SlideUp} open={suggestionDialog}>
                <DialogContent>
                    <DialogContentText>
                        Auf Smartphones ist die Anzeige im Landscape-Modus nicht zu empfehlen
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        startIcon={<CloseIcon />}
                        onClick={() => setSuggestionDialog(false)}
                        color="secondary">
                        mir egal, ich weis was ich tue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeviceOrientationProvider
