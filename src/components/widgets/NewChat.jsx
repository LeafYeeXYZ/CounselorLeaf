import PropTypes from 'prop-types'
import { useState } from 'react'

export default function NewChat({ messages, clear, duringChat, dialogAction }) {

  const [btn, setBtn] = useState(null)

  const clearButton = (
    <button
      className='prompt-clear'
      onClick={e => {
        e.preventDefault()
        if (messages.length) {
          setBtn(confireButton)
        }
      }}
    >新对话</button>
  )

  const confireButton = (
    <div
      className='prompt-clear'
    >
      <button
        className='prompt-clear-confirm'
        onClick={e => {
          e.preventDefault()
          if (duringChat.current) {
            dialogAction({ type: 'open', title: '请稍候', content: '请等待当前请求结束再开启新对话' })
            return
          }
          // 更新历史对话
          clear('', [])
          // 更换按钮
          setBtn(clearButton)
        }}      
      >确定</button>
      <button
        className='prompt-clear-cancel'
        onClick={e => {
          e.preventDefault()
          setBtn(clearButton)
        }}
      >取消</button>
    </div>
  )

  return btn || clearButton
}

NewChat.propTypes = {
  messages: PropTypes.array.isRequired,
  clear: PropTypes.func.isRequired,
  duringChat: PropTypes.object.isRequired,
  dialogAction: PropTypes.func.isRequired,
}