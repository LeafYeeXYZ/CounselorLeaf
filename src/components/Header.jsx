import '../styles/Header.css'
import ThemeSwitcher from './widgets/ThemeSwitcher.jsx'
import NewChat from './widgets/NewChat.jsx'
import PropTypes from 'prop-types'

export default function Header({ messages, setMessages }) {
  return (
    <header className='header'>
      <NewChat 
        messages={messages}
        setMessages={setMessages} 
      />
      <ThemeSwitcher />
      <p className='header-title'>有小叶子陪着你的树洞</p>
    </header>
  )
}

Header.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired
}