import { useState, useEffect, type ReactNode } from 'react'
import { Chat } from './components/Chat.tsx'
import { History } from './components/History.tsx'
import { Config } from './components/Config'
import { useStates } from './lib/useStates.ts'
import { useApi } from './lib/useApi.ts'
import { Segmented } from 'antd'
import { SettingOutlined, BookOutlined, CommentOutlined } from '@ant-design/icons'

const PAGES: { label: string, element: ReactNode, icon: ReactNode, isDefault?: boolean }[] = [
  { label: '历史', element: <History />, icon: <BookOutlined /> },
  { label: '聊天', element: <Chat />, icon: <CommentOutlined />, isDefault: true },
  { label: '设置', element: <Config />, icon: <SettingOutlined /> },
]

export default function App() {

  const { setLive2d } = useStates()
  const { loadLive2d } = useApi()
  useEffect(() => {
    const live2d = loadLive2d(document.getElementById('live2d')!)
    setLive2d(live2d)
  }, [setLive2d, loadLive2d])
  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)

  return (
    <main className='w-dvw h-dvh overflow-hidden flex flex-col justify-center items-center bg-yellow-50'>
      <div className='w-full max-w-sm overflow-hidden flex flex-col justify-center items-center'>
        {page}
      </div>
      <nav className='absolute bottom-4'>
        <Segmented
          className='border border-yellow-950 p-1'
          defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
          options={PAGES.map(({ label, icon }) => ({ label, icon, value: label }))}
          onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
        />
      </nav>
      <div id='live2d' className='w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
