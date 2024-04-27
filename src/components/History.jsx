import PropTypes from 'prop-types'
import '../styles/History.css'
import { DeleteFilled, EditFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash-es'
import { useState, useRef } from 'react'
import { set } from 'idb-keyval'

function HistoryItem({ item, history, setHistory, clear, dialogAction }) {
  // 用于切换编辑状态
  const [edit, setEdit] = useState(false)
  // 引用
  const inputRef = useRef(null)
  const titleRef = useRef(null)
  // 初始对话内容
  const backup = cloneDeep(item)
  // 一般状态的组件
  const normalState = (
    <div className='history-item'>

      <button className='history-item-title'
        ref={titleRef}
        onClick={e => {
          e.preventDefault()
          const systemStatus = localStorage.getItem('systemStatus')
          if (systemStatus !== 'idle') {
            dialogAction({ type: 'open', title: '请稍候', content: `请等待${systemStatus}完成后重试` })
            return
          }
          // 禁用标题输入框
          titleRef.current.disabled = true
          // 将当前对话保存到历史对话中, 并清空当前对话
          clear(backup.time, backup)
          // 如果是手机端, 点一下侧边栏按钮
          if (window.innerWidth <= 768) {
            document.querySelector('.sidebar-switcher').click()
          } 
          // 启用标题输入框 (不需要, 因为页面会刷新)
          // titleRef.current.disabled = false        
        }}      
      >{item.title || '无标题对话'}</button>

      <button className='history-item-edit'
        onClick={e => {
          e.preventDefault()
          setEdit(true)
        }}      
      ><EditFilled /></button>

      <button className='history-item-delete'
        onClick={e => {
          e.preventDefault()
          const systemStatus = localStorage.getItem('systemStatus')
          if (systemStatus !== 'idle') {
            dialogAction({ type: 'open', title: '请稍候', content: `请等待${systemStatus}完成后重试` })
            return
          }
          localStorage.setItem('systemStatus', '更新本地数据 (HistoryItem.jsx -> normalState -> delete)')
          const data = cloneDeep(history).filter(i => i.time !== item.time)
          setHistory(data)
          set('historyMessages', data).then(() => localStorage.setItem('systemStatus', 'idle'))
        }}
      ><DeleteFilled /></button>

    </div>
  )
  // 编辑状态的组件
  const editState = (
    <div className='history-item'>

      <input className='history-item-title' defaultValue={item.title || '无标题对话'} ref={inputRef} />

      <button className='history-item-save'
        onClick={e => {
          e.preventDefault()
          const systemStatus = localStorage.getItem('systemStatus')
          if (systemStatus !== 'idle') {
            dialogAction({ type: 'open', title: '请稍候', content: `请等待${systemStatus}完成后重试` })
            return
          }
          localStorage.setItem('systemStatus', '更新本地数据 (HistoryItem.jsx -> editState -> save)')
          const data = cloneDeep(history).map(i => {
            if (i.time === item.time) {
              return { ...i, title: inputRef.current.value || '' }
            } else {
              return i
            }
          })
          setHistory(data)
          setEdit(false)
          set('historyMessages', data).then(() => localStorage.setItem('systemStatus', 'idle'))          
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

export default function History({ history, setHistory, clear, dialogAction }) {

  // 渲染历史对话
  const historyItems = []
  for (const item of history) {
    historyItems.push(
      <HistoryItem
        key={item.time}
        item={item}
        history={history}
        setHistory={setHistory}
        clear={clear}
        dialogAction={dialogAction}
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
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
}

HistoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  dialogAction: PropTypes.func.isRequired,
}