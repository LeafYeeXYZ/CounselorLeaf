import { cloneDeep } from 'lodash-es'
import { set } from 'idb-keyval'

/**
 * 用于清除当前对话并保存到历史对话中
 * @returns {Function} clear
 */
export default function clearCurrent({ current, setCurrent, history, setHistory }) {

  /**
   * 清除当前对话并保存到历史对话中  
   * 如果需要在历史对话中删除指定对话, 则传入对话的时间戳
   * @param {string} deleteTime 要删除的对话的时间戳
   * @param {array} newCurrent 新的对话内容
   */
  function clear(deleteTime = '', newCurrent = { time: Date.now().toString(), title: '', messages: [] }) {
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