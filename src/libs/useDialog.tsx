import { useReducer, useRef } from 'react'

/** 对话框的状态 */
export type DialogState = {
  title: string
  content: string
  ele: React.MutableRefObject<HTMLDialogElement | null>
}
/** 对话框的操作 */
export type DialogAction = {
  type: 'open' | 'close'
  title: string
  content: string
}

/** 定义 reducer 函数 */
function reducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'open': {
      state.ele.current && state.ele.current.show()
      return { title: action.title, content: action.content, ele: state.ele }
    }
    case 'close': {
      state.ele.current && state.ele.current.close()
      return { title: '', content: '', ele: state.ele }
    }
    default: {
      throw new TypeError(`Unsupported action type: ${action.type}`)
    }
  }
}

type UseDialogReturns = {
  dialogState: DialogState
  dialogAction: React.Dispatch<DialogAction>
  dialogRef: React.RefObject<HTMLDialogElement>
}

/** 创建一个对话框的 Hook */
export function useDialog(): UseDialogReturns {
  // 创建一个对话框的引用
  const dialogRef = useRef<HTMLDialogElement>(null)
  // 使用 useReducer
  const [dialogState, dialogAction] = useReducer(reducer, { title: '', content: '', ele: dialogRef })
  // 返回操作函数
  return { dialogState, dialogAction, dialogRef }
}

