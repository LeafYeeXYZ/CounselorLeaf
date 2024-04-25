import '../styles/App.css'
import { useState } from 'react'
import useDialog from '../libs/useDialog.jsx'

import Prompt from './Prompt.jsx'
import Messages from './Messages.jsx'
import Dialog from './Dialog.jsx'

// 主组件
function App() {
  /** 
   * 创建一个保存对话内容的状态 
   * @type {Array<{role: string, content: string}>}
   */
  const [messages, setMessages] = useState([])
  // 使用 useDialog 自定义 Hook
  const { dialogState, dialogAction, dialogRef } = useDialog()

  return (
    <main className="container">

      <Messages 
        messages={messages}
      />

      <Prompt 
        messages={messages}
        setMessages={setMessages}
        dialogAction={dialogAction}
      />

      <Dialog 
        ref={dialogRef}
        dialogState={dialogState} 
        dialogAction={dialogAction}
      />

    </main>
  )
}

export default App
