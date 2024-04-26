import '../styles/App.css'
import '../styles/Theme.css'
import { useState, useRef } from 'react'
import useDialog from '../libs/useDialog.jsx'

import Prompt from './Prompt.jsx'
import Messages from './Messages.jsx'
import Dialog from './Dialog.jsx'
import Header from './Header.jsx'
import History from './History.jsx'

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

  return (
    <main className="container">

      <div className='sidebar' ref={sidebarRef}>

        <History
          messages={messages}
          setMessages={setMessages}
          history={history}
          setHistory={setHistory}
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
          history={history}
          setHistory={setHistory}
        />

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
