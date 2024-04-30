import { cloneDeep } from 'lodash-es'
import { set } from 'idb-keyval'
import { Message } from '../components/App.jsx'

interface clearCurrentParams {
  current: Message
  setCurrent: React.Dispatch<React.SetStateAction<Message>>
  history: Message[]
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function clearCurrent({ current, setCurrent, history, setHistory }: clearCurrentParams) {
  /**
   * 清除当前对话并保存到历史对话中  
   * 如果需要在历史对话中删除指定对话, 则传入对话的时间戳
   */
  function clear(
    deleteTime: string = '', 
    newCurrent: Message = { time: Date.now().toString(), title: '', messages: [] }
  ): void {
    const systemStatus = localStorage.getItem('systemStatus')
    if (systemStatus !== 'idle') {
      alert(`致命错误, 请确保在调用 clearCurrent.jsx -> clear() 时, 系统状态为 'idle', 当前系统状态为: ${systemStatus}`)
      return
    }

    localStorage.setItem('systemStatus', '更新本地数据 (clearCurrent.jsx -> clear())')
    // 获取标题
    const title = current.title
    // 更新历史对话
    let newHistory = cloneDeep(history) || []
    if (current.messages.length) {
      const time = Date.now().toString()
      newHistory.unshift({ time, title, messages: cloneDeep(current.messages) })
    }
    if (deleteTime) {
      // 删除指定对话
      newHistory = newHistory.filter(item => item.time !== deleteTime)
    }
    setHistory(newHistory)
    setCurrent(newCurrent)
    Promise.all([
      set('historyMessages', newHistory),
      set('currentMessages', newCurrent)
    ]).then(() => localStorage.setItem('systemStatus', 'idle'))
  }

  return clear
}