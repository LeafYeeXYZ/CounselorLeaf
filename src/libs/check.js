import { clear } from 'idb-keyval'

/**
 * 检查浏览器版本是否符合要求  
 * 如果不符合要求，弹出提示框
 */
function checkBrowser() {
  const ua = navigator.userAgent
  const chrome = ua.match(/Chrome\/(\d+)/)
  const firefox = ua.match(/Firefox\/(\d+)/)
  const edge = ua.match(/Edge\/(\d+)/)
  const safari = ua.match(/Safari\/(\d+)/)
  if (
    (chrome && Number(chrome[1]) < 108) ||
    (firefox && Number(firefox[1]) < 101) ||
    (edge && Number(edge[1]) < 108) ||
    (safari && Number(safari[1]) < 15.4)
  ) {
    alert(`
      您的浏览器版本过低  
      无法正常使用本应用  
      建议使用最新版本的
      Chrome/Edge/Safari
      /Firefox等现代浏览器
    `)
  }
}

/**
 * 1. 如果 IndexedDB 版本号小于目标版本号则清空 IndexedDB  
 * 2. 检查浏览器版本是否符合要求, 如果不符合要求，弹出提示框
 * @param {number} targetVersion 网页兼容日期
 * @returns {Promise<undefined | {type: string, title: string, content: string}>} 返回提示框信息
 */
export default async function clearDB(targetVersion) {
  // 检查浏览器版本是否符合要求
  checkBrowser()

  // 获取当前版本号
  const thisVersion = Number(localStorage.getItem('dbVersion')) || 0
  // 如果当前版本号不同于目标版本号则清空 IndexedDB
  if (thisVersion !== targetVersion) {
    const dbStatu = localStorage.getItem('dbStatu')
    if (dbStatu === 'readyToClear') {
      await clear()
      localStorage.setItem('dbVersion', targetVersion)
      localStorage.setItem('dbStatu', 'cleared')
    } else {
      localStorage.setItem('dbStatu', 'readyToClear')
      return { type: 'open', title: '提示', content: '网站数据需要更新, 请保存重要数据后刷新网页; 在网页刷新前, 一些功能可能无法正常使用' }
    }
  }
  return
}