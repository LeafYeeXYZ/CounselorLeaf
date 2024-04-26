import PropTypes from 'prop-types'
import { useState } from 'react'

export default function NewChat({ messages, setMessages, duringChat, submitRef, promptRef }) {
  const [ text, setText ] = useState('新对话')

  return (
    <button 
      className='prompt-clear'
      onClick={e => {
        e.preventDefault()
        // 要求用户确认
        if (text === '新对话' && messages.length) {
          setText('确认开启新对话')
        } else if (text === '确认开启新对话') {
          setText('新对话')
          duringChat.current = false
          promptRef.current.value = ''
          if (submitRef.current.textContent !== '发送') submitRef.current.textContent = '请稍候...'
          setMessages([])
        }
      }} 
      onBlur={e => {
        e.preventDefault()
        if (text === '确认开启新对话') setText('新对话')
      }}
    >{text}</button>
  )
}

NewChat.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
  duringChat: PropTypes.object.isRequired,
  submitRef: PropTypes.object.isRequired,
  promptRef: PropTypes.object.isRequired,
}