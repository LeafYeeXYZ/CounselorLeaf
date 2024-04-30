import '../styles/Header.css'
import ThemeSwitcher from './widgets/ThemeSwitcher.tsx'
import SidebarSwitcher from './widgets/SidebarSwitcher.tsx'

interface HeaderProps {
  sidebarRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
}

export default function Header({ sidebarRef, contentRef }: HeaderProps) {
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