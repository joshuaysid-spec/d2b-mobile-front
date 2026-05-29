import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@/App'
import '@/styles/globals.css'

// frontend-architecture.md §5 — Vite 앱 엔트리포인트
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element(#root)를 찾을 수 없습니다.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
