import '../styles/Messages.css'
import PropTypes from 'prop-types'
import { DEFAULT_MSG } from '../config.json'
import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { marked } from 'marked'

export default function Messages({ messages }) {
  const messagesList = [{ role: 'assistant', content: DEFAULT_MSG }]
    .concat(messages)
    .map((message, index) => {
      // 更新对话内容, 修复 <br> <hr> 标签
      let msg = marked.parse(message.content)
      msg.replace(/<br>/g, '<br />').replace(/<hr>/g, '<hr />')
      return (
        <div key={index} className={`message-${message.role}`}>
          <div className='message-content' dangerouslySetInnerHTML={{ __html: msg }} />
        </div>
      )
    })

  useEffect(() => {
    // 滚动到底部
    const messagesContainer = document.querySelector('.messages-container')
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    // 保存对话内容
    set('currentMessages', messages) // Promise
  }, [messages])

  return (
    <div className='messages-container'>
      {messagesList}
    </div>
  )
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
}