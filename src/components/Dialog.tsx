import { forwardRef } from 'react'
import '../styles/Dialog.css'
import { DialogState, DialogAction } from '../libs/useDialog.tsx'

interface DialogProps {
  dialogState: DialogState
  dialogAction: React.Dispatch<DialogAction>
}

function DialogComponent(
  { dialogState, dialogAction }: DialogProps,
  ref: React.ForwardedRef<HTMLDialogElement>
) {
  // 关闭对话框
  function closeDialog() {
    dialogAction({ type: 'close', title: '', content: '' })
  }

  return (
    <dialog className='dialog-main' ref={ref}>
      <div className="dialog-container">
        <div className='dialog-sub'>
          <div className="dialog-title">{dialogState.title}</div>
          <div className="dialog-content">{dialogState.content}</div>
        </div>
        <button className="dialog-button" onClick={closeDialog}>
          确定
        </button>
      </div>
    </dialog>
  )
}

const Dialog = forwardRef(DialogComponent)

export default Dialog