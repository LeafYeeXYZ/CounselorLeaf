import '../styles/App.css'
import '../styles/Theme.css'

import clearDB from '../libs/check.js'
import { useRef, useEffect, useState } from 'react'
import { useDialog } from '../libs/useDialog.tsx'
import clearCurrent from '../libs/clearCurrent.jsx'
import { get } from 'idb-keyval'

import Prompt from './Prompt.tsx'
import Messages from './Messages.tsx'
import Dialog from './Dialog.tsx'
import Header from './Header.tsx'
import History from './History.tsx'
import NewChat from './widgets/NewChat.tsx'

const initDialog = await clearDB('24042714')
const initCurrent = await get('currentMessages')
const initHistory = await get('historyMessages')

export type Message = {
  time: string
  title: string
  messages: { role: 'user' | 'assistant' | 'loading', content: string }[]
}

// 主组件
export function App() {
  // 用来标记全局工作状态 'idle' | string (提示信息)
  localStorage.setItem('systemStatus', 'idle')
  /** 保存对话内容的状态, 与 currentMessages 同步 */
  const [current, setCurrent] = useState<Message>(initCurrent || { time: Date.now().toString(), title: '', messages: [] })
  /** 保存历史对话的状态, 与 historyMessages 同步 */
  const [history, setHistory] = useState<Message[]>(initHistory || [])
  /** 操作 dialog 的自定义 hook */
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 引用
  const sidebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // 用于清除当前对话并将其保存到 history 中的函数
  const clear = clearCurrent({ current, setCurrent, history, setHistory })
  // 更新提示
  useEffect(() => {
    initDialog && dialogAction(initDialog)
  }, [dialogAction])

  return (
    <main className="container">

      <div className='sidebar' ref={sidebarRef}>

        <History
          history={history}
          setHistory={setHistory}
          clear={clear}
          dialogAction={dialogAction}
        />
        
      </div>

      <div className='content' ref={contentRef}>

        <Header 
          sidebarRef={sidebarRef}
          contentRef={contentRef}
        />

        <Messages 
          current={current}
        />

        <Prompt 
          current={current}
          setCurrent={setCurrent}
          dialogAction={dialogAction}
        >
          <NewChat
            // 设置 key 以便在 messages 更新时重新渲染
            key={current.time}
            current={current}
            clear={clear}
            dialogAction={dialogAction}
          />
        </Prompt>

      </div>

      <Dialog 
        ref={dialogRef}
        dialogState={dialogState} 
        dialogAction={dialogAction}
      />

    </main>
  )
}

