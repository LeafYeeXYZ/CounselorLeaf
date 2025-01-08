import { env } from './lib/env.ts'
import { openLink } from './lib/utils.ts'
import { version } from '../package.json'

import { useState, useEffect, type ReactNode } from 'react'
import { useStates } from './lib/hooks/useStates.ts'
import { useLive2dApi } from './lib/hooks/useLive2dApi.ts'
import { useMemory } from './lib/hooks/useMemory.ts'
import { useIsMobile } from './lib/hooks/useIsMobile.ts'

import { message, Menu } from 'antd'
import { SettingOutlined, BookOutlined, CommentOutlined, LoadingOutlined, ExportOutlined, FontSizeOutlined, AudioOutlined, CloudSyncOutlined, IdcardOutlined, ReadOutlined, LayoutOutlined, BlockOutlined, ApiOutlined, BorderlessTableOutlined, CloudOutlined } from '@ant-design/icons'
import { MemoryAction } from './components/Memory/MemoryAction.tsx'
import { MemoryDiary } from './components/Memory/MemoryDiary.tsx'
import { MemoryMain } from './components/Memory/MemoryMain.tsx'
import { MemoryCloud } from './components/Memory/MemoryCloud.tsx'
import { ConfigMain } from './components/Config/ConfigMain.tsx'
import { ConfigVoice } from './components/Config/ConfigVoice.tsx'
import { ConfigLayout } from './components/Config/ConfigLayout.tsx'
import { ConfigPlugins } from './components/Config/ConfigPlugins.tsx'
import { ChatIndex } from './components/Chat/ChatIndex.tsx'
import { Debug } from './components/Debug.tsx'

const DEFAULT_PAGE = 'chat-text'
const PAGES: Record<string, ReactNode> = {
  'memory-main': <MemoryMain />,
  'memory-diary': <MemoryDiary />,
  'memory-action': <MemoryAction />,
  'memory-cloud': <MemoryCloud />,
  'config-main': <ConfigMain />,
  'config-service': <ConfigVoice />,
  'config-layout': <ConfigLayout />,
  'config-plugins': <ConfigPlugins />,
  'chat-text': <ChatIndex to='text' />,
  'chat-voice': <ChatIndex to='voice' />,
}

export default function App() {

  const [messageApi, messageElement] = message.useMessage()
  const { setMessageApi, disabled, forceAllowNav } = useStates()
  const { loadLive2d, setLive2dApi, background, isFullScreen } = useLive2dApi()
  const { selfName } = useMemory()
  const [current, setCurrent] = useState<string>(DEFAULT_PAGE)
  const isMobile = useIsMobile()

  // 加载消息通知
  useEffect(() => {
    setMessageApi(messageApi)
  }, [messageApi, setMessageApi])

  // 加载看板娘
  useEffect(() => {
    if (isMobile) return
    const live2d = loadLive2d(document.getElementById('live2d')!)
    live2d.stageSlideIn()
    setLive2dApi(live2d)
    return () => {
      document.getElementById('live2d')!.innerHTML = ''
      setLive2dApi(null)
    }
  }, [loadLive2d, setLive2dApi, isMobile])

  // 加载背景
  useEffect(() => {
    const element = document.getElementById('back')! as HTMLImageElement
    element.src = background
  }, [background])

  // 可调整大小
  const LEFT_GAP = 450
  const RIGHT_GAP = 350
  const [x, setX] = useState<number>(LEFT_GAP)
  useEffect(() => { 
    const bg = document.getElementById('back-container')!
    if (isFullScreen) {
      bg.style.width = '100dvw'
    } else if (isMobile) {
      bg.style.width = '0'
    } else {
      bg.style.width = `calc(100dvw - ${x}px)` 
    }
  }, [x, isMobile, isFullScreen])

  // 切换移动模式时发送提示
  useEffect(() => {
    isMobile && messageApi.info('当前为屏幕宽度较小, 将不会显示 Live2D 模型')
  }, [isMobile, messageApi])

  return (
    <main className='w-dvw h-dvh overflow-hidden'>
      {!isMobile && <div 
        className='fixed top-1/2 left-0 w-[0.4rem] h-12 z-50 cursor-ew-resize border border-blue-900 rounded-full bg-blue-50 opacity-50 hover:opacity-100' 
        style={{ marginLeft: `calc(${x}px - 0.25rem)`}} 
        draggable
        // @ts-expect-error 类型提示错误, 运行无问题
        onDragStart={(e) => { e.target.style.opacity = '0' }}
        // @ts-expect-error 类型提示错误, 运行无问题
        onDragEnd={(e) => { e.target.style.opacity = '1' }}
        onDrag={(e) => {
          if (e.clientX < LEFT_GAP || e.clientX > window.innerWidth - RIGHT_GAP) {
            return
          } else {
            setX(e.clientX)
          }
        }}
      />}
      <div 
        className='h-dvh overflow-hidden float-left' 
        style={{ width: isMobile ? '100dvw' : `${x}px`}}
      >
        <div 
          className='w-full h-full overflow-hidden grid'
          style={{ gridTemplateRows: isMobile ? '1fr 3.2rem 2rem' : '1fr 3.2rem 2.8rem'}}
        >
          {/* Page */}
          <div 
            className='w-full h-full overflow-hidden flex flex-col justify-center items-center'
            style={{ padding: isMobile ? '1rem' : '1.5rem'}}
          >
            <div className='w-full overflow-hidden'>
              {PAGES[current]}
            </div>
          </div>
          {/* Nav */}
          <div className='w-full h-full flex justify-center items-center'>
            <div className='flex justify-center items-center bg-white border border-blue-900 rounded-md'>
              <Menu
                className='border-none justify-center bg-transparent'
                mode='horizontal'
                selectedKeys={[current]}
                onClick={({ key }) => setCurrent(key)}
                disabled={disabled !== false && !forceAllowNav}
                items={[
                  { 
                    key: 'memory', label: '记忆', icon: <BookOutlined />,
                    children: [
                      { key: 'memory-main', label: '名字和自我', icon: <IdcardOutlined /> },
                      { key: 'memory-diary', label: `${selfName}的日记本`, icon: <ReadOutlined /> },
                      { key: 'memory-action', label: '导入和导出', icon: <CloudSyncOutlined /> },
                      { key: 'memory-cloud', label: '云备份和恢复', icon: <CloudOutlined /> },
                    ],
                  },
                  { 
                    key: 'chat', label: '聊天', icon: <CommentOutlined />,
                    children: [
                      { key: 'chat-text', label: '文字语音聊天', icon: <FontSizeOutlined /> },
                      { key: 'chat-voice', label: '连续语音对话', icon: <AudioOutlined /> },
                    ],
                  },
                  { 
                    key: 'config', label: '设置', icon: <SettingOutlined />,
                    children: [
                      { key: 'config-main', label: '推理服务设置', icon: <BlockOutlined /> },
                      { key: 'config-service', label: '语音服务设置', icon: <ApiOutlined /> },
                      { key: 'config-layout', label: '自定义设置', icon: <LayoutOutlined /> },
                      { key: 'config-plugins', label: '插件设置', icon: <BorderlessTableOutlined /> },
                    ],
                  },
                ]}
              />
            </div>
          </div>
          {/* Footer */}
          <div className='w-full h-full flex items-center justify-center text-xs'>
            <div className='grid grid-cols-[5.8rem,1fr,5.8rem] gap-3'>
              <div className='flex justify-center items-center border border-blue-900 rounded-md py-[0.1rem] bg-white'>
                <div className='mr-1'>数字生命</div>
                <div>{version}</div>
              </div>
              <div className='flex justify-center items-center border border-blue-900 rounded-md px-[0.4rem] py-[0.1rem] bg-white'>
                <div className='mr-1'>当前状态:</div>
                <div className='flex justify-center items-center'>
                  {disabled === false ? '空闲' : disabled === true ? <div className='flex justify-center items-center gap-[0.3rem]'>
                    <div>加载中</div>
                    <div className='flex items-center justify-center'><LoadingOutlined /></div>
                  </div> : disabled}
                </div>
              </div>
              <div 
                className='cursor-pointer flex justify-center items-center border border-blue-900 rounded-md py-[0.1rem] bg-white'
                onClick={() => openLink('https://github.com/LeafYeeXYZ/DigitalLife')}
              >
                <div className='mr-1'>GitHub</div>
                <ExportOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Widget */}
      {env.VITE_DEBUG_COMPONENT ? <Debug /> : undefined}
      {/* Context Holder */}
      {messageElement}
      <div id='live2d' className='-z-50 w-0 h-0 fixed top-0 left-0'></div>
    </main>
  )
}
