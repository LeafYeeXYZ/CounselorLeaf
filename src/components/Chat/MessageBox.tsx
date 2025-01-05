import { useRef, useEffect, useMemo } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { Bubble } from '@ant-design/x'
import { UserOutlined } from '@ant-design/icons'

export function MessageBox() {

  const memoContainerRef = useRef<HTMLDivElement>(null)
  const { shortTermMemory, userName, selfName } = useMemory()
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [shortTermMemory])
  const memoryList = useMemo(() => {
    const length = shortTermMemory.length
    if (length !== 0 && shortTermMemory[length - 1].role === 'user') {
      return [...shortTermMemory, { role: 'assistant', content: '__loading__' }]
    } else {
      return shortTermMemory
    }
  }, [shortTermMemory])

  return (
    <div className='w-full flex flex-col gap-3 pr-[0.2rem] py-1' ref={memoContainerRef}>
      {memoryList.map(({ role, content }, index) => (
        <Bubble
          header={role === 'user' ? userName : selfName}
          placement={role === 'user' ? 'end' : 'start'}
          content={content}
          loading={content === '__loading__'}
          avatar={role === 'user' ? 
            { icon: <UserOutlined />, className: 'bg-blue-200 text-blue-900' } : 
            { src: '/avatar.jpg' }
          }
          key={index}
        />
      ))}
    </div>
  )
}
