import '../styles/Prompt.css'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { cloneDeep } from 'lodash-es'
import { SERVER } from '../config.json'
import { marked } from 'marked'

function Prompt({ messages, setMessages, dialogAction }) {
  // 封装立即更新函数
  function flushUpdates(newMessages) {
    flushSync(() => setMessages(newMessages))
  }
  // 引用元素
  const submitRef = useRef(null)
  const promptRef = useRef(null)
  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event) {
    event.preventDefault()
    const originalMessages = cloneDeep(messages)
    // 异步处理
    try {
      // 禁用按钮
      submitRef.current.disabled = true
      submitRef.current.textContent = '思考中...'
      // 获取用户输入的提示词
      const text = promptRef.current.value
      if (!text) throw { title: '提示', message: '请输入提示词', self: true }
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
      if (!data.success) throw { title: '生成失败', message: data.message, self: true }
      // 更新对话内容
      const mdMessage = await marked.parse(data.result.response)
      flushUpdates([...originalMessages, { role: 'user', content: text }, { role: 'assistant', content: mdMessage }])
      // 删除输入框内容
      promptRef.current.value = ''
    } 
    catch (error) {
      if (typeof error === 'object' && error.self) {
        dialogAction({ type: 'open', title: '生成失败', content: error.message })
      } else {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
      // 恢复对话内容
      flushUpdates(originalMessages)
    } 
    finally {
      // 启用按钮
      submitRef.current.disabled = false
      submitRef.current.textContent = '发送'
    }
  }

  return (
    <form action="#" className='prompt-container'>

      <textarea
        name="prompt" 
        cols="30" 
        rows="10" 
        placeholder="请输入"
        className='prompt-textarea'
        ref={promptRef}
      ></textarea>

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
}

export default Prompt