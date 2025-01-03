import { useState, useEffect, type ReactNode } from 'react'
import { Chat } from './components/Chat.tsx'
import { Memory } from './components/Memory.tsx'
import { Config } from './components/Config'
import { Debug } from './components/Debug.tsx'
import { useStates } from './lib/hooks/useStates.ts'
import { useLive2dApi } from './lib/hooks/useLive2dApi.ts'
import { env } from './lib/env.ts'
import { Segmented, message } from 'antd'
import { SettingOutlined, BookOutlined, CommentOutlined, LoadingOutlined, GithubOutlined } from '@ant-design/icons'
import { openLink } from './lib/utils.ts'

const PAGES: { label: string, element: ReactNode, icon: ReactNode, isDefault?: boolean }[] = [
  { label: '记忆', element: <Memory />, icon: <BookOutlined /> },
  { label: '聊天', element: <Chat />, icon: <CommentOutlined />, isDefault: true },
  { label: '设置', element: <Config />, icon: <SettingOutlined /> },
]

export default function App() {

  const { setMessageApi, disabled, background, chatMode } = useStates()
  const { loadLive2d, setLive2dApi } = useLive2dApi()
  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)
  const [messageApi, messageElement] = message.useMessage()

  // 加载消息通知
  useEffect(() => {
    setMessageApi(messageApi)
  }, [messageApi, setMessageApi])

  // 加载看板娘
  useEffect(() => {
    const live2d = loadLive2d(document.getElementById('live2d')!)
    live2d.stageSlideIn()
    setLive2dApi(live2d)
    return () => {
      document.getElementById('live2d')!.innerHTML = ''
      setLive2dApi(null)
    }
  }, [loadLive2d, setLive2dApi])

  // 加载背景
  useEffect(() => {
    const element = document.getElementById('back')! as HTMLImageElement
    element.src = background
  }, [background])

  return (
    <main className='w-dvw h-dvh overflow-hidden'>
      <div className='w-[450px] h-dvh overflow-hidden float-left bg-gray-50 shadow-sm border-r'>
        <div className='w-full h-full overflow-hidden flex flex-col justify-center items-center relative p-8'>
          <div className='w-full overflow-hidden flex flex-col justify-center items-center bg-white'>
            {page}
          </div>
          <nav className='absolute bottom-6'>
            <Segmented
              disabled={disabled !== false && chatMode !== 'none'}
              className='border border-blue-900 p-1'
              defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
              options={PAGES.map(({ label, icon }) => ({ label, icon, value: label }))}
              onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
            />
          </nav>
          <div className='absolute top-6'>
            <div className='border border-blue-900 rounded-md py-[0.3rem] px-[0.6rem] bg-white text-sm flex justify-center items-center'>
              <div className='mr-1'>
                当前状态:
              </div>
              <div className='flex justify-center items-center'>
                {disabled === false ? '空闲' : disabled === true ? <div className='flex justify-center items-center gap-[0.3rem]'>
                  <div>加载中</div>
                  <div className='flex items-center justify-center'><LoadingOutlined /></div>
                </div> : disabled}
              </div>
            </div>
          </div>
        </div>
      </div>
      {messageElement}
      {env.VITE_DEBUG_COMPONENT ? <Debug /> : undefined}
      <div 
        className='fixed top-2 right-2 cursor-pointer bg-white px-2 py-1 rounded-md border border-blue-900'
        onClick={() => openLink('https://github.com/LeafYeeXYZ/DigitalLife')}
      >
        <GithubOutlined className='m-0' />
      </div>
      <div id='live2d' className='-z-50 w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
