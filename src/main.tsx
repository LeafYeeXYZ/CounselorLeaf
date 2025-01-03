import 'openai/shims/web'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.tsx'

if (window.innerWidth >=780 && window.innerHeight >=600) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  document.body.innerHTML = `
    <main style="width: 100dvw; height: 100dvh; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 0.5rem;">
      <div>窗口过小, 请调整后刷新</div>
    </main>
  `
}
