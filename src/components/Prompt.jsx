import '../styles/Prompt.css'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { cloneDeep } from 'lodash-es'
import { SERVER } from '../config.json'
import NewChat from './widgets/NewChat.jsx'

function Prompt({ messages, setMessages, dialogAction, duringChat, history, setHistory }) {
  // 引用元素
  const submitRef = useRef(null)
  const promptRef = useRef(null)
  // 封装立即更新函数
  function flushUpdates(newMessages) {
    if (!duringChat.current) return
    flushSync(() => setMessages(newMessages))
  }
  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event) {
    event.preventDefault()
    const originalMessages = cloneDeep(messages)
    // 异步处理
    try {
      // 设置标志位
      duringChat.current = true
      // 禁用按钮
      submitRef.current.disabled = true
      submitRef.current.textContent = '思考中...'
      // 获取用户输入的提示词
      const text = promptRef.current.value
      if (!text) throw { title: '提示', message: '请输入对话内容', self: true }
      // 更新对话内容
      flushUpdates([...originalMessages, { role: 'user', content: text }, { role: 'loading', content: '思考中...' }])
      // 发送请求
      const body = cloneDeep(messages)
      body.push({ role: 'user', content: text })
      const res = await fetch(`${SERVER}/counselor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: body })
      })
      const data = await res.json()
      if (!data.success) throw { title: '生成失败', message: `Prompt -> handleSubmit -> ${data.message}`, self: true }
      // 更新对话内容
      flushUpdates([...originalMessages, { role: 'user', content: text }, { role: 'assistant', content: data.result.response }])
      // 删除输入框内容
      promptRef.current.value = ''
    } 
    catch (error) {
      if (typeof error === 'object' && error.self) {
        dialogAction({ type: 'open', title: error.title, content: error.message })
      } else {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
      // 恢复对话内容
      flushUpdates(originalMessages)
    } 
    finally {
      // 清除标志位
      duringChat.current = false
      // 启用按钮
      submitRef.current.disabled = false
      submitRef.current.textContent = '发送'
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

      <NewChat
        messages={messages}
        setMessages={setMessages}
        duringChat={duringChat}
        submitRef={submitRef}
        promptRef={promptRef}
        history={history}
        setHistory={setHistory}
      />

      <button 
        className='prompt-submit'
        ref={submitRef}
        onClick={handleSubmit}
      >发送</button>

    </form>
  )
}

Prompt.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
  duringChat: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
}

export default Prompt