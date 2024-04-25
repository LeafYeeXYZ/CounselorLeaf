import '../styles/Messages.css'
import PropTypes from 'prop-types'
import { DEFAULT_MSG } from '../config.json'

export default function Messages({ messages }) {
  const messagesList = [{ role: 'assistant', content: DEFAULT_MSG }]
    .concat(messages)
    .map((message, index) => (
      <div key={index} className={`message-${message.role}`}>
        <div className='message-content' dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    ))

  return (
    <div className='messages-container'>
      {messagesList}
    </div>
  )
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
}