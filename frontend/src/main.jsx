import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import { store } from './store'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
          <App />
          <Toaster />
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)
