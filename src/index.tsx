import 'typeface-roboto'

import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'

import App from './Components/App'
import ScrollbarProvider from './Components/Provider/ScrollbarProvider'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <ScrollbarProvider>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </ScrollbarProvider>,
    document.getElementById('root')
)

// ? source: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#notifications_api
if ('Notification' in window && navigator.serviceWorker) {
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
}
