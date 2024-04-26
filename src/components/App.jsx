import '../styles/App.css'
import '../styles/Theme.css'
import { useState, useRef } from 'react'
import useDialog from '../libs/useDialog.jsx'
import clearCurrent from '../libs/clearCurrent.jsx'

import Prompt from './Prompt.jsx'
import Messages from './Messages.jsx'
import Dialog from './Dialog.jsx'
import Header from './Header.jsx'
import History from './History.jsx'
import NewChat from './widgets/NewChat.jsx'

import { get } from 'idb-keyval'
const initMessages = await get('currentMessages') || []
const initHistoryMessages = await get('historyMessages') || []

// 主组件
function App() {
  /** 
   * 创建一个保存对话内容的状态 
   * @type {Array<{
   *   role: 'user' | 'assistant' | 'loading',
   *   content: string
   * }>[]}
   * @info 会与 currentMessages 同步
   */
  const [messages, setMessages] = useState(initMessages)
  /** 
   * 创建一个保存历史对话的状态 
   * @type {Array<{
   *   time: string,
   *   title: string | undefined,
   *   messages: Array<{
   *     role: 'user' | 'assistant' | 'loading',
   *     content: string
   *   }>[]
   * }>}
   * @info 会与 historyMessages 同步
   */
  const [history, setHistory] = useState(initHistoryMessages)
  
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction, dialogRef } = useDialog()
  // 引用
  const sidebarRef = useRef(null)
  const contentRef = useRef(null)
  const duringChat = useRef(false) // 表示是否正在向服务器发送请求, 如果手动设置为 false, 则不会将新消息同步
  // 用于清除当前 messages 并将其保存到 history 中的函数
  const clear = clearCurrent({ messages, setMessages, duringChat, history, setHistory })

  return (
    <main className="container">

      <div className='sidebar' ref={sidebarRef}>

        <History
          history={history}
          setHistory={setHistory}
          clear={clear}
        />
        
      </div>

      <div className='content' ref={contentRef}>

        <Header 
          sidebarRef={sidebarRef}
          contentRef={contentRef}
        />

        <Messages 
          messages={messages}
        />

        <Prompt 
          messages={messages}
          setMessages={setMessages}
          dialogAction={dialogAction}
          duringChat={duringChat}
        >
          <NewChat
            // 设置 key 以便在 messages 更新时重新渲染
            key={JSON.stringify(messages).length.toString() + Date.now()}
            messages={messages}
            clear={clear}
            duringChat={duringChat}
            dialogAction={dialogAction}
          />
        </Prompt>

        <Dialog 
          ref={dialogRef}
          dialogState={dialogState} 
          dialogAction={dialogAction}
        />

      </div>

    </main>
  )
}

export default App
