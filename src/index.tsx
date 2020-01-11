import 'typeface-roboto'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './Components/App'
import ErrorBoundary from './Components/ErrorBoundary'
import FirebaseAuthProvider from './Components/Provider/FirebaseAuthProvider'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <ErrorBoundary>
        <BrowserRouter>
            <FirebaseAuthProvider>
                <App />
            </FirebaseAuthProvider>
        </BrowserRouter>
    </ErrorBoundary>,
    document.getElementById('root')
)

// ToDo refactor
// ? source: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#notifications_api
if ('Notification' in window.Notification && navigator.serviceWorker) {
    if (Notification.requestPermission)
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                serviceWorker.register({
                    onSuccess: registration => {
                        registration.showNotification('RecipeHandler 4.0 ist nun offline verfügbar')
                    },
                    onUpdate: registration => {
                        registration.showNotification(
                            'Eine neue Version von RecipeHandler 4.0 ist verfügbar'
                        )
                    },
                })
            }
        })
    // ? fallback to register https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission#Browser_compatibility
    else serviceWorker.register()
}
