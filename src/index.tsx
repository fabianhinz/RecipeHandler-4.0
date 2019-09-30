import 'typeface-roboto'
import 'react-perfect-scrollbar/dist/css/styles.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './Components/App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'production') serviceWorker.register()
