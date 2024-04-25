import '../styles/Messages.css'
import PropTypes from 'prop-types'
import { DEFAULT_MSG } from '../config.json'
import { useEffect } from 'react'
import { set } from 'idb-keyval'

export default function Messages({ messages }) {
  const messagesList = [{ role: 'assistant', content: DEFAULT_MSG }]
    .concat(messages)
    .map((message, index) => (
      <div key={index} className={`message-${message.role}`}>
        <div className='message-content' dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    ))

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