import { cloneDeep } from 'lodash-es'
import { set } from 'idb-keyval'

/**
 * 用于清除当前对话并保存到历史对话中
 * @returns {Function} clear
 */
export default function clearCurrent({ messages, setMessages, duringChat, history, setHistory }) {

  /**
   * 清除当前对话并保存到历史对话中  
   * 如果需要在历史对话中删除指定对话, 则传入对话的时间戳
   * @param {string} deleteTime 要删除的对话的时间戳
   * @param {array} newMessages 新的对话内容
   */
  function clear(deleteTime = '', newMessages = []) {
    duringChat.current = false
    // 更新历史对话
    let newHistory = cloneDeep(history) || []
    if (messages.length) {
      const time = Date.now().toString()
      newHistory.unshift({ time, title: '', messages: cloneDeep(messages) })
    }
    if (deleteTime) {
      // 删除指定对话
      newHistory = newHistory.filter(item => item.time !== deleteTime)
    }
    setHistory(newHistory)
    set('historyMessages', newHistory).then(() => {
      setMessages(newMessages)
      document.querySelector('.prompt-textarea').value = ''
    })
  }

  return clear
}