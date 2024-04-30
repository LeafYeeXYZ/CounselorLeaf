import '../styles/Messages.css'
import { DEFAULT_MSG } from '../config.json'
import { useEffect } from 'react'
import { marked } from 'marked'
import { get, set } from 'idb-keyval'
import { Message } from './App.tsx'

// 将头像以 base64 的形式保存在 idb-keyval 中
let assistantAvatar = await get('assistantAvatar')
if (!assistantAvatar) {
  const data = await fetch('/avatar.jpg')
  const blob = await data.blob()
  const base64 = await new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result)
  })
  await set('avatar', base64)
  assistantAvatar = base64
}

// 随机颜色头像 (渐变色)
function randomColor(): string {
  const max = 240
  const min = 180
  const deg = `${Math.floor(Math.random() * 360)}deg`
  const random = () => Math.floor(Math.random() * (max - min) + min)
  const color = () => `rgb(${random()}, ${random()}, ${random()})`
  return `linear-gradient(${deg}, ${color()}, ${color()})`
}

export default function Messages({ current }: { current: Message }) {

  useEffect(() => {
    // 滚动到底部
    const messagesContainer = document.querySelector('.messages-container')!
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }, [current.messages])

  const userAvatar = randomColor()

  return (
    <div className='messages-container'>
      <div key={-1} className='message-assistant'>
        <img className='message-avatar' src={assistantAvatar} alt='avatar' />
        <div className='message-content'>
          {DEFAULT_MSG}
        </div>
      </div>
      {
        current.messages.map((message, index) => {
          let msg = marked.parse(message.content) as string
          msg.replace(/<br>/g, '<br />').replace(/<hr>/g, '<hr />')
          return (
            <div key={index} className={`message-${message.role}`}>
              {
                message.role === 'assistant' &&
                <img className='message-avatar' src={assistantAvatar} alt='avatar' />
              }
              <div className='message-content' dangerouslySetInnerHTML={{ __html: msg }} />
              {
                message.role === 'user' &&
                <div className='message-avatar' style={{ background: userAvatar }} />
              }
            </div>
          )
        })
      }
    </div>
  )
}
