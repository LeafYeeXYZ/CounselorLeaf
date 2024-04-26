import { BookFilled } from '@ant-design/icons'
import PropTypes from 'prop-types'

export default function SidebarSwitcher({ sidebarRef, contentRef }) {

  return (
    <button 
      className='sidebar-switcher' 
      onClick={() => {
        sidebarRef.current.classList.toggle('sidebar-control')
        contentRef.current.classList.toggle('content-control')
      }}
    ><BookFilled /></button>
  )
}

SidebarSwitcher.propTypes = {
  sidebarRef: PropTypes.object.isRequired,
  contentRef: PropTypes.object.isRequired,
}