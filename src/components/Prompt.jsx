import '../styles/Prompt.css'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { cloneDeep } from 'lodash-es'
import { SERVER } from '../config.json'
import { flushSync } from 'react-dom'
import { set } from 'idb-keyval'

export default function Prompt({ children, current, setCurrent, dialogAction }) {
  // 引用元素
  const submitRef = useRef(null)
  const promptRef = useRef(null)

  // 点击生成按钮时的事件处理函数
  async function handleSubmit(event) {
    event.preventDefault()
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
      submitRef.current.disabled = true
      submitRef.current.textContent = '思考中...'
      // 获取用户输入的提示词
      const text = promptRef.current.value
      if (!text) throw { title: '提示', message: '请输入对话内容', self: true }
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
      if (!data.success) throw { title: '生成失败', message: `Prompt -> handleSubmit -> ${data.message}`, self: true }
      // 更新对话内容
      const newCurrent = cloneDeep({
        time: backup.time,
        title: backup.title,
        messages: [...backup.messages, { role: 'user', content: text }, { role: 'assistant', content: data.result.response }]
      })
      setCurrent(newCurrent)
      // 删除输入框内容
      promptRef.current.value = ''
      set('currentMessages', newCurrent)
      .then(() => localStorage.setItem('systemStatus', 'idle'))
    } 
    catch (error) {
      if (typeof error === 'object' && error.self) {
        dialogAction({ type: 'open', title: error.title, content: error.message })
      } else {
        dialogAction({ type: 'open', title: '生成失败', content: `Prompt -> handleSubmit -> ${error.name}: ${error.message}` })
      }
      // 恢复对话内容
      setCurrent(backup)
      localStorage.setItem('systemStatus', 'idle')
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

Prompt.propTypes = {
  children: PropTypes.element.isRequired,
  current: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
}