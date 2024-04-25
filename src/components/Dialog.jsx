import { forwardRef } from 'react'
import '../styles/Dialog.css'
import PropTypes from 'prop-types'

function DialogComponent({ dialogState, dialogAction }, ref) {
  // 关闭对话框
  function closeDialog() {
    dialogAction({ type: 'close' })
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

DialogComponent.propTypes = {
  dialogRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  dialogState: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    ele: PropTypes.instanceOf(Element),
  }).isRequired,
  dialogAction: PropTypes.func.isRequired,
}

export default Dialog