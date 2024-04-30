import { clear } from 'idb-keyval'
import { DialogAction } from './useDialog.tsx'

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
      可能无法正常使用本应用  
      建议使用最新版本  
      Chrome/Edge/Firefox/Safari  
      等现代浏览器
    `)
  }
}

/**
 * 1. 如果 IndexedDB 版本号小于目标版本号则清空 IndexedDB  
 * 2. 检查浏览器版本是否符合要求, 如果不符合要求，弹出提示框
 */
export default async function clearDB(targetVersion: string): Promise<undefined | DialogAction> {
  // 检查浏览器版本是否符合要求
  checkBrowser()

  // 获取当前版本号
  const thisVersion = localStorage.getItem('dbVersion') || 'noVersion'
  // 如果当前版本号不同于目标版本号则清空 IndexedDB
  if (thisVersion !== targetVersion && thisVersion !== 'noVersion') {
    const dbStatu = localStorage.getItem('dbStatu')
    if (dbStatu === 'readyToClear') {
      await clear()
      localStorage.setItem('dbVersion', targetVersion)
      localStorage.setItem('dbStatu', 'cleared')
      return
    } else {
      localStorage.setItem('dbStatu', 'readyToClear')
      return { type: 'open', title: '提示', content: '网站数据需要更新, 请保存重要数据后刷新网页; 在网页刷新前, 一些功能可能无法正常使用' }
    }
  } else if (thisVersion === 'noVersion') {
    localStorage.setItem('dbVersion', targetVersion)
  }
  return
}