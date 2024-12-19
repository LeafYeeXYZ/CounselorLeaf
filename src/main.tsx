import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.tsx'

if (speechSynthesis) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  document.body.innerHTML = `
    <main style="width: 100dvw; height: 100dvh; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 0.5rem;">
      <p>当前浏览器不支持语音合成 API</p>
      <p>请使用最新版的 Chrome / Safari 浏览器</p>
    </main>
  `
}
