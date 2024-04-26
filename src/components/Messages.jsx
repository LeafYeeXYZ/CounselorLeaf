import '../styles/Messages.css'
import PropTypes from 'prop-types'
import { DEFAULT_MSG } from '../config.json'
import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { marked } from 'marked'

export default function Messages({ messages }) {

  useEffect(() => {
    // 滚动到底部
    const messagesContainer = document.querySelector('.messages-container')
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    // 保存对话内容
    set('currentMessages', messages) // Promise
  }, [messages])

  return (
    <div className='messages-container'>
      <div key={-1} className='message-assistant'>
        <div className='message-content'>
          {DEFAULT_MSG}
        </div>
      </div>
      {
        messages.map((message, index) => {
          let msg = marked.parse(message.content)
          msg.replace(/<br>/g, '<br />').replace(/<hr>/g, '<hr />')
          return (
            <div key={index} className={`message-${message.role}`}>
              <div className='message-content' dangerouslySetInnerHTML={{ __html: msg }} />
            </div>
          )
        })
      }
    </div>
  )
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
}