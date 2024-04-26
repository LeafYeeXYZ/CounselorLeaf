import PropTypes from 'prop-types'
import '../styles/History.css'
import { DeleteFilled, EditFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { set } from 'idb-keyval'
import { cloneDeep } from 'lodash-es'
import { useState, useRef } from 'react'

function HistoryItem({ time, title, itemMessages, updateHistory, messages, setMessages }) {
  // 用于切换编辑状态
  const [edit, setEdit] = useState(false)
  // 输入框的引用
  const inputRef = useRef(null)
  // 一般状态的组件
  const normalState = (
    <div className='history-item'>

      <div className='history-item-title'
        onClick={e => {
          e.preventDefault()
          // 1. 将当前对话保存到历史对话中, 并清空当前对话
          if (messages.length) {
            document.querySelector('.prompt-clear').click()
            document.querySelector('.prompt-clear-confirm').click()
          }
          // 2. 将历史对话覆盖到当前对话中
          setMessages(itemMessages)
          // 3. 更新历史对话
          updateHistory(history => {
            const result = history.filter(item => item.time !== time)
            return result
          })          
        }}      
      >{title || '无标题对话'}</div>

      <button className='history-item-edit'
        onClick={e => {
          e.preventDefault()
          setEdit(true)
        }}      
      ><EditFilled /></button>

      <button className='history-item-delete'
        onClick={e => {
          e.preventDefault()
          updateHistory(history => history.filter(item => item.time !== time))
        }}
      ><DeleteFilled /></button>

    </div>
  )
  // 编辑状态的组件
  const editState = (
    <div className='history-item'>

      <input className='history-item-title' defaultValue={title || '无标题对话'} ref={inputRef} />

      <button className='history-item-save'
        onClick={e => {
          e.preventDefault()
          updateHistory(history => {
            const newHistory = history.map(item => {
              if (item.time === time) {
                return { ...item, title: inputRef.current.value || '' }
              } else {
                return item
              }
            })
            return newHistory
          })
          setEdit(false)
        }}      
      ><CheckOutlined /></button>

      <button className='history-item-cancel'
        onClick={e => {
          e.preventDefault()
          setEdit(false)
        }}
      ><CloseOutlined /></button>

    </div>
  )
  return edit ? editState : normalState
}

export default function History({ messages, setMessages, history, setHistory }) {

  /** 用来给子组件更新 history 的函数
   * @param {function} callback 接受 history 作为参数, 返回新的 history
   * @returns {void}
   */
  function updateHistory(callback) {
    const temp = cloneDeep(history) || []
    const newHistory = callback(temp)
    setHistory(newHistory)
    set('historyMessages', newHistory) // Promise
  }

  // 渲染历史对话
  const historyItems = []
  for (const item of history) {
    historyItems.push(
      <HistoryItem
        key={item.time}
        time={item.time}
        title={item.title || ''}
        itemMessages={item.messages}
        updateHistory={updateHistory}
        messages={messages}
        setMessages={setMessages}
      />
    )
  }  

  return (
    <>
      <div className='history-title'>历史对话</div>
      {historyItems.length ? historyItems : <div className='history-empty'>暂无历史对话</div>}
      <div className='history-note'>开启新对话时会自动保存</div>
    </>
  )
}

History.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
}

HistoryItem.propTypes = {
  time: PropTypes.string.isRequired,
  title: PropTypes.string,
  itemMessages: PropTypes.array.isRequired,
  updateHistory: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
}