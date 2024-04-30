import { BookFilled } from '@ant-design/icons'

interface SidebarSwitcherProps {
  sidebarRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
}

export default function SidebarSwitcher({ sidebarRef, contentRef }: SidebarSwitcherProps) {

  return (
    <button 
      className='sidebar-switcher' 
      onClick={() => {
        sidebarRef!.current!.classList.toggle('sidebar-control')
        contentRef!.current!.classList.toggle('content-control')
      }}
    ><BookFilled /></button>
  )
}
