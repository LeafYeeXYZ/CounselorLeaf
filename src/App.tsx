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

  const { setMessageApi, disabled, setDisabled } = useStates()
  const { loadLive2d, testChat, setChatApi, chatApiList, currentChatApi, testSpeak, setSpeakApi, speakApiList, currentSpeakApi, listenApiList, setListenApi, currentListenApi, testListen, setLive2dApi } = useApi()
  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)
  const [ready, setReady] = useState<boolean | string>(false)
  const [messageApi, messageElement] = message.useMessage()

  // 初始化
  useEffect(() => {
    // 最小宽度, 主要是为了适配网页端, 桌面端已由 Tauri 设置最小宽度和高度
    if (window.innerWidth < 780 || window.innerHeight < 600) {
      document.body.innerHTML = '<div class="w-dvw h-dvh flex justify-center items-center">窗口过小, 请调整后刷新</div>'
      return
    }
    // 加载服务
    if (ready === false) {
      testChat().then(() => {
        // 测试语音合成功能
        return typeof testSpeak === 'function' ? testSpeak() : Promise.resolve(true)
      }).then(() => {
        // 测试语音转文字功能
        return typeof testListen === 'function' ? testListen() : Promise.resolve(true)
      }).then(() => {
        // 如果语音转文字功能开启, 请求权限
        return typeof testListen === 'function' ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.resolve(null)
      }).then((stream) => {
        // 关闭音频流
        if (stream !== null) {
          stream.getTracks().forEach((track) => track.stop())
        }
        // 设置通知 API
        return Promise.resolve()
      }).then(() => {
        // 完成加载
        setReady(true)
        setDisabled(false)
      }).catch((e) => {
        setReady(e.message)
        setDisabled('服务状态异常')
      }).finally(() => {
        // 设置消息 API
        setMessageApi(message)
      })
    }
  }, [ready, messageApi, setDisabled, setMessageApi, testChat, testSpeak, testListen])

  // 加载看板娘
  useEffect(() => {
    if (ready !== true) return
    const live2d = loadLive2d(document.getElementById('live2d')!)
    setLive2dApi(live2d)
    return () => {
      document.getElementById('live2d')!.innerHTML = ''
      setLive2dApi(null)
    }
  }, [ready, loadLive2d, setLive2dApi])

  return (
    <main className='w-dvw h-dvh overflow-hidden'>
      <div className='w-[450px] h-dvh overflow-hidden float-left bg-gray-50 shadow-sm border-r'>
        <div className='w-full h-full overflow-hidden flex flex-col justify-center items-center relative p-8'>
            {ready === true ? (
              <div className='w-full overflow-hidden flex flex-col justify-center items-center bg-white'>
                {page}
              </div>
            ) : (
              <div className='w-full flex flex-col items-center justify-center'>
                <div className='w-full flex items-center justify-center'>
                  <div className='mr-2'>对话生成服务:</div>
                  <Select 
                    options={chatApiList.map((name) => ({ label: name, value: name }))}
                    defaultValue={currentChatApi}
                    onChange={async (value) => { 
                      await setChatApi(value)
                    }}
                  />
                </div>
                <div className='w-full flex items-center justify-center mt-3'>
                  <div className='mr-2'>语音生成服务:</div>
                  <Select 
                    options={speakApiList.map((name) => ({ label: name, value: name }))}
                    defaultValue={currentSpeakApi}
                    onChange={async (value) => { 
                      await setSpeakApi(value)
                    }}
                  />
                </div>
                <div className='w-full flex items-center justify-center mt-3'>
                  <div className='mr-2'>语音识别服务:</div>
                  <Select 
                    options={listenApiList.map((name) => ({ label: name, value: name }))}
                    defaultValue={currentListenApi}
                    onChange={async (value) => { 
                      await setListenApi(value)
                    }}
                  />
                </div>
                <div className='w-3/4 border-b border-blue-900 my-4' />
                {ready === false ? (
                  <div className='flex items-center justify-center'>
                    <span>加载中</span>
                    <LoadingOutlined className='ml-[0.3rem] mr-0' />
                  </div>
                ) : (
                  <>
                    <div>服务状态异常</div>
                    <div className='text-sm my-2'>错误信息: {ready}</div>
                    <Button onClick={() => setReady(false)} autoInsertSpace={false}>
                      点击重试
                    </Button>
                  </>
                )}

              </div>
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
              <div className='mr-1'>
                当前状态:
              </div>
              <div className='flex justify-center items-center'>
                {disabled === false ? '空闲' : disabled}
              </div>
            </div>
          </div>
        </div>
      </div>
      {messageElement}
      <div id='live2d' className='-z-50 w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
