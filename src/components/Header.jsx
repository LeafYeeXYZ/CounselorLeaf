import '../styles/Header.css'
import ThemeSwitcher from './ThemeSwitcher.jsx'

export default function Header() {
  return (
    <header className='header'>
      <ThemeSwitcher />
      <p className='header-title'>有小叶子陪着你的树洞</p>
    </header>
  )
}