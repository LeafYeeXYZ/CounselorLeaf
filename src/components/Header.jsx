import '../styles/Header.css'
import ThemeSwitcher from './widgets/ThemeSwitcher.jsx'
// import PropTypes from 'prop-types'

export default function Header() {
  return (
    <header className='header'>
      <ThemeSwitcher />
      <p className='header-title'>有小叶子陪着你的树洞</p>
    </header>
  )
}
