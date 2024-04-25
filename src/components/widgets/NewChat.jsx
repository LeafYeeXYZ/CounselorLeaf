import PropTypes from 'prop-types'

export default function NewChat({ messages, setMessages }) {
  return (
    <div className='new-chat'>
      <button 
        className='new-chat-button'
        onClick={() => {
          if (messages.length) {
            setMessages([])
          }
        }}
      >新对话</button>
    </div>
  )
}

NewChat.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
}