import PropTypes from 'prop-types'
import { useState } from 'react'
import { set } from 'idb-keyval'
import { cloneDeep } from 'lodash-es'

export default function NewChat({ messages, setMessages, duringChat, submitRef, promptRef, history, setHistory }) {

  const [btn, setBtn] = useState(null)

  const clearButton = (
    <button
      className='prompt-clear'
      onClick={e => {
        e.preventDefault()
        if (messages.length) setBtn(confireButton)
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
          duringChat.current = false
          promptRef.current.value = ''
          if (submitRef.current.textContent !== '发送') submitRef.current.textContent = '请稍候...'
          // 更新历史对话
          const newHistory = cloneDeep(history) || []
          const time = Date.now()
          newHistory.unshift({ time, title: '', messages: cloneDeep(messages) })
          setHistory(newHistory)
          set('historyMessages', newHistory).then(() => {
            // 更新当前对话
            setMessages([])
            setBtn(clearButton)
          })
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
  setMessages: PropTypes.func.isRequired,
  duringChat: PropTypes.object.isRequired,
  submitRef: PropTypes.object.isRequired,
  promptRef: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
}