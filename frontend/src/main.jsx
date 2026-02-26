import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#151d2e',
            color: '#fff',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
