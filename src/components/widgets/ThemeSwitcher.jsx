import { Switch, ConfigProvider } from 'antd'
import { SunFilled, MoonFilled } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'

export default function ThemeSwitcher() {
  // 主题按钮
  const button = useRef(null)
  // 设置主题切换按钮颜色
  const [themeBtnColor, setThemeBtnColor] = useState('#fff0f0')
  // 主题切换事件处理函数
  const handleThemeChange = (checked) => {
    const htmlClasses = document.documentElement.classList
    if (checked) {
      setThemeBtnColor('#FFD700') // 设置为亮色
      htmlClasses.remove('dark')
    } else {
      setThemeBtnColor('#F18F01') // 设置为暗色
      htmlClasses.add('dark')
    }
  }
  // 如果系统是暗色模式，则点一下按钮
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      button.current.click() 
    }
  }, [])
  // 渲染
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F18F01', /* 亮色背景颜色 */
          colorPrimaryHover: '#D16F00', /* 亮色背景颜色 (hover) */
          colorTextQuaternary: '#833500', /* 暗色背景颜色 */
          colorTextTertiary: '#631500', /* 暗色背景颜色 (hover) */
        },
        components: {
          Switch: {
            handleBg: themeBtnColor,
          },
        },
      }}
    >
      <div className='theme-switcher'>
        <Switch
          checkedChildren={<SunFilled />}
          unCheckedChildren={<MoonFilled />}
          defaultChecked 
          onChange={handleThemeChange} 
          ref={button}
        />
      </div>
    </ConfigProvider>
  )
}