import { useState, useEffect, type ReactNode } from 'react'
import { Chat } from './components/Chat.tsx'
import { Memory } from './components/Memory.tsx'
import { Config } from './components/Config'
import { useStates } from './lib/useStates.ts'
import { useApi } from './lib/useApi.ts'
import { Segmented, message, Select, Button } from 'antd'
import { SettingOutlined, BookOutlined, CommentOutlined, LoadingOutlined } from '@ant-design/icons'

const PAGES: { label: string, element: ReactNode, icon: ReactNode, isDefault?: boolean }[] = [
  { label: '记忆', element: <Memory />, icon: <BookOutlined /> },
  { label: '聊天', element: <Chat />, icon: <CommentOutlined />, isDefault: true },
  { label: '设置', element: <Config />, icon: <SettingOutlined /> },
]

export default function App() {

  const { setLive2d, setMessageApi, disabled, setDisabled } = useStates()
  const { loadLive2d, testChat, setChatApi, chatApiList, currentChatApi } = useApi()
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
    // 最小宽度, 主要是为了适配网页端, 桌面端已由 Tauri 设置最小宽度和高度
    if (window.innerWidth < 780 || window.innerHeight < 600) {
      document.body.innerHTML = '<div class="w-dvw h-dvh flex justify-center items-center">窗口过小, 请调整后刷新</div>'
      return
    }
    ready === false && testChat().then(() => {
      setReady(true)
      setDisabled(false)
    }).catch((error) => {
      setReady(error.message)
      setDisabled('服务状态异常')
    })
  }, [testChat, setReady, ready, setDisabled])

  return (
    <main className='w-dvw h-dvh overflow-hidden'>
      <div className='w-[450px] h-dvh overflow-hidden float-left bg-gray-50 shadow-sm border-r'>
        <div className='w-full h-full overflow-hidden flex flex-col justify-center items-center relative p-8'>
            {ready === true ? (
              <div className='w-full overflow-hidden flex flex-col justify-center items-center bg-white'>
                {page}
              </div>
            ) : (
              <p className='w-full flex flex-col items-center justify-center'>
                <p className='w-full flex items-center justify-center'>
                  <p className='mr-2'>对话生成服务:</p>
                  <Select 
                    options={chatApiList.map((name) => ({ label: name, value: name }))}
                    defaultValue={currentChatApi}
                    onChange={async (value) => { 
                      await setChatApi(value)
                    }}
                  />
                </p>
                <p className='w-3/4 border-b border-blue-900 my-4' />
                {ready === false ? (
                  <p className='flex items-center justify-center'>
                    <span>加载中</span>
                    <LoadingOutlined className='ml-[0.3rem] mr-0' />
                  </p>
                ) : (
                  <>
                    <p>服务状态异常</p>
                    <p className='text-sm my-2'>错误信息: {ready}</p>
                    <Button onClick={() => setReady(false)} autoInsertSpace={false}>
                      点击重试
                    </Button>
                  </>
                )}

              </p>
            )}
          <nav className='absolute bottom-6'>
            <Segmented
              disabled={ready !== true}
              className='border border-blue-900 p-1'
              defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
              options={PAGES.map(({ label, icon }) => ({ label, icon, value: label }))}
              onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
            />
          </nav>
          <div className='absolute top-6'>
            <div 
              className='border border-blue-900 rounded-md py-[0.3rem] px-[0.6rem] bg-white text-sm flex justify-center items-center'
              style={ready !== true ? { filter: 'grayscale(100%)', backgroundColor: '#f5f5f5', color: '#b8b8b8' } : undefined}
            >
              <p className='mr-1'>
                当前状态:
              </p>
              <p className='flex justify-center items-center'>
                {disabled === false ? '空闲' : disabled}
              </p>
            </div>
          </div>
        </div>
      </div>
      {messageElement}
      <div id='live2d' className='-z-50 w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
