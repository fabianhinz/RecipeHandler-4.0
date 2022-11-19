import 'typeface-roboto'
import 'typeface-ubuntu'
import 'web-animations-js'
import './index.css'

import ReactDOM from 'react-dom'

import { App } from '@/Components/App'
import ErrorBoundary from '@/Components/ErrorBoundary'

import { AppProvider } from './Components/AppProvider'

ReactDOM.render(
  <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
  </ErrorBoundary>,
  document.getElementById('root')!
)

// ? components will provide their own contextmenus
window.addEventListener('contextmenu', e => e.preventDefault())
