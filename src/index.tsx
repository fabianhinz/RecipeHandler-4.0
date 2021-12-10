import 'typeface-roboto'
import 'typeface-ubuntu'
import 'web-animations-js'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './Components/App'
import ErrorBoundary from './Components/ErrorBoundary'
import BreakpointsProvider from './Components/Provider/BreakpointsProvider'
import FirebaseAuthProvider from './Components/Provider/FirebaseAuthProvider'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(
    <ErrorBoundary>
        <FirebaseAuthProvider>
            <BrowserRouter>
                <BreakpointsProvider>
                    <App />
                </BreakpointsProvider>
            </BrowserRouter>
        </FirebaseAuthProvider>
    </ErrorBoundary>,
    document.getElementById('root')
)

serviceWorkerRegistration.register()
