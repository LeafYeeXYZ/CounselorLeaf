import PropTypes from 'prop-types'
import { useState } from 'react'

export default function NewChat({ current, clear, dialogAction }) {

  const [btn, setBtn] = useState(null)

  const clearButton = (
    <button
      className='prompt-clear'
      onClick={e => {
        e.preventDefault()
        if (current.messages.length) {
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
          const systemStatus = localStorage.getItem('systemStatus')
          if (systemStatus !== 'idle') {
            dialogAction({ type: 'open', title: '请稍候', content: `请等待${systemStatus}完成后重试` })
            return
          }
          // 更新历史对话, 创造新对话
          clear()
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
  current: PropTypes.object.isRequired,
  clear: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
}