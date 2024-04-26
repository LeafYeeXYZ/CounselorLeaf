import '../styles/Header.css'
import ThemeSwitcher from './widgets/ThemeSwitcher.jsx'
import SidebarSwitcher from './widgets/SidebarSwitcher.jsx'
import PropTypes from 'prop-types'

export default function Header({ sidebarRef, contentRef }) {
  return (
    <header className='header'>
      <SidebarSwitcher
        sidebarRef={sidebarRef}
        contentRef={contentRef}
      />
      <ThemeSwitcher />
      <p className='header-title'>有小叶子陪着你的树洞</p>
    </header>
  )
}

Header.propTypes = {
  sidebarRef: PropTypes.object.isRequired,
  contentRef: PropTypes.object.isRequired,
}