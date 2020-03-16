import React, { FC, useContext, useEffect } from 'react'

import { useBreakpointsContext } from './BreakpointsProvider'

interface Orientation {
    portrait: boolean
    landscape: boolean
}

const Context = React.createContext<Orientation | null>(null)

export const useDeviceOrientationContext = () => useContext(Context) as Orientation

const DeviceOrientationProvider: FC = ({ children }) => {
    const { isLowRes } = useBreakpointsContext()

    useEffect(() => {
        const handleOrientationChange = () => {
            if ((window.orientation === 90 || window.orientation === -90) && isLowRes)
                (async () => {
                    try {
                        await window.screen.orientation.lock('portrait')
                    } catch {
                        // ? on unsupported devices do nothing - https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock#Browser_compatibility
                    }
                })()
        }

        window.addEventListener('orientationchange', handleOrientationChange)
        return () => window.removeEventListener('orientationchange', handleOrientationChange)
    }, [isLowRes])

    return (
        <>
            <Context.Provider value={{ landscape: false, portrait: false }}>
                {children}
            </Context.Provider>
        </>
    )
}

export default DeviceOrientationProvider
