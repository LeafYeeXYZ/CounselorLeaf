import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Button, Form, Select, Input, Collapse } from 'antd'
import { Chat } from './components/Chat.tsx'
import { History } from './components/History.tsx'
import { Config } from './components/Config'
import { useStates } from './lib/useStates.ts'
import { useApi } from './lib/useApi.ts'

export default function App() {

  const { setLive2d } = useStates()
  const { loadLive2d } = useApi()
  useEffect(() => {
    setLive2d(loadLive2d(document.getElementById('live2d')!))
  }, [setLive2d, loadLive2d])

  const [page, setPage] = useState<ReactNode>(<Chat />)

  return (
    <main className='w-dvw h-dvh overflow-hidden flex flex-row justify-center items-center bg-yellow-50'>
      {page}
      <div id='live2d' className='w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
