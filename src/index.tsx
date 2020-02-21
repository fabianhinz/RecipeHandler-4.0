import 'typeface-roboto'
import 'web-animations-js'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './Components/App'
import ErrorBoundary from './Components/ErrorBoundary'
import BreakpointsProvider from './Components/Provider/BreakpointsProvider'
import FirebaseAuthProvider from './Components/Provider/FirebaseAuthProvider'

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
