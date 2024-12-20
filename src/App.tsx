import { useState, useEffect, type ReactNode } from 'react'
import { Chat } from './components/Chat.tsx'
import { Memory } from './components/Memory.tsx'
import { Config } from './components/Config'
import { useStates } from './lib/useStates.ts'
import { useApi } from './lib/useApi.ts'
import { Segmented, message } from 'antd'
import { SettingOutlined, BookOutlined, CommentOutlined, LoadingOutlined } from '@ant-design/icons'

const PAGES: { label: string, element: ReactNode, icon: ReactNode, isDefault?: boolean }[] = [
  { label: '记忆', element: <Memory />, icon: <BookOutlined /> },
  { label: '聊天', element: <Chat />, icon: <CommentOutlined />, isDefault: true },
  { label: '设置', element: <Config />, icon: <SettingOutlined /> },
]

export default function App() {

  const { setLive2d, setMessageApi } = useStates()
  const { loadLive2d, testChat } = useApi()
  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)
  const [ready, setReady] = useState<boolean | string>(false)
  const [messageApi, messageElement] = message.useMessage()
  // 加载模型
  useEffect(() => {
    if (ready !== true) return
    const live2d = loadLive2d(document.getElementById('live2d')!)
    setLive2d(live2d)
    return () => {
      document.getElementById('live2d')!.innerHTML = ''
      setLive2d(null)
    }
  }, [setLive2d, loadLive2d, ready])
  // 通知消息组件
  useEffect(() => {
    if (ready !== true) return
    setMessageApi(messageApi)
  }, [messageApi, setMessageApi, ready])
  // 检查服务状态
  useEffect(() => {
    testChat().then(() => {
      setReady(true)
    }).catch((error) => {
      setReady(error.message)
    })
  }, [testChat, setReady])

  return (
    <main className='w-dvw h-dvh overflow-hidden flex flex-col justify-center items-center'>
      {ready === true ? (<>
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
        {messageElement}
        <div id='live2d' className='-z-50 w-0 h-0 fixed top-0 left-0'></div>
      </>) : (<>
        <div className='w-full max-w-sm overflow-hidden flex justify-center items-center'>
          {ready === false ? (
            <div className='w-full h-full flex justify-center items-center '>
              <p className='mr-2'>检测服务状态中</p>
              <LoadingOutlined />
            </div>
          ) : (
            <div className='w-full h-full flex flex-col gap-2 justify-center items-center '>
              <p>服务状态异常:</p>
              <p>{ready}</p>
              <p>请尝试在解决问题后重启应用</p>
            </div>
          )}
        </div>
      </>)}
    </main>
  )
}
