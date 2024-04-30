import '../styles/Prompt.css'
import React, { useRef } from 'react'
import { cloneDeep } from 'lodash-es'
import { SERVER } from '../config.json'
import { flushSync } from 'react-dom'
import { set } from 'idb-keyval'
import { Message } from './App.tsx'
import { DialogAction } from '../libs/useDialog.tsx'

interface PromptProps {
  children: React.ReactNode
  current: Message
  setCurrent: React.Dispatch<React.SetStateAction<Message>>
  dialogAction: React.Dispatch<DialogAction>
}

class ErrorInfo {
  title: string
  message: string
  self: boolean
  
  constructor(title: string, message: string) {
    this.title = title
    this.message = message
    this.self = true
  }
}

export default function Prompt({ children, current, setCurrent, dialogAction }: PromptProps) {
  // 引用元素
  const submitRef = useRef<HTMLButtonElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)

  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (submitRef.current || promptRef.current) return
    const systemStatus = localStorage.getItem('systemStatus')
    if (systemStatus !== 'idle') {
      dialogAction({ type: 'open', title: '请稍候', content: `请等待${systemStatus}完成后重试` })
      return
    }
    const backup = cloneDeep(current)
    // 异步处理
    try {
      localStorage.setItem('systemStatus', '小叶子组织语言')
      // 禁用按钮
      submitRef.current!.disabled = true
      submitRef.current!.textContent = '思考中...'
      // 获取用户输入的提示词
      const text = promptRef.current!.value
      if (!text) throw new ErrorInfo('提示', '请输入对话内容')
      // 更新对话内容
      flushSync(() => setCurrent({ ...backup, messages: [...backup.messages, { role: 'user', content: text }, { role: 'loading', content: '思考中...' }] }))
      // 发送请求
      const body = cloneDeep(backup.messages)
      body.push({ role: 'user', content: text })
      const res = await fetch(`${SERVER}/counselor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: body })
      })
      const data = await res.json()
      if (!data.success) throw new ErrorInfo('生成失败', `Prompt -> handleSubmit -> ${data.message}`)
      // 更新对话内容
      const newCurrent: Message = cloneDeep({
        time: backup.time,
        title: backup.title,
        messages: [...backup.messages, { role: 'user', content: text }, { role: 'assistant', content: data.result.response }]
      })
      setCurrent(newCurrent)
      // 删除输入框内容
      promptRef.current!.value = ''
      set('currentMessages', newCurrent)
      .then(() => localStorage.setItem('systemStatus', 'idle'))
    } 
    catch (error) {
      if (error instanceof ErrorInfo) {
        dialogAction({ type: 'open', title: error.title, content: error.message })
      } else if (error instanceof Error) {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
      // 恢复对话内容
      setCurrent(backup)
      localStorage.setItem('systemStatus', 'idle')
    } 
    finally {
      // 启用按钮
      submitRef.current!.disabled = false
      submitRef.current!.textContent = '发送'
    }
  }

  return (
    <form action="#" className='prompt-container'>

      <textarea
        name="prompt" 
        placeholder="请在此输入"
        className='prompt-textarea'
        ref={promptRef}
      ></textarea>

      {children}

      <button 
        className='prompt-submit'
        ref={submitRef}
        onClick={handleSubmit}
      >发送</button>

    </form>
  )
}
