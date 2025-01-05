import { useRef, useEffect } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'

export function MessageBox() {

  const memoContainerRef = useRef<HTMLDivElement>(null)
  const { shortTermMemory, userName, selfName } = useMemory()
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [shortTermMemory])

  return (
    <div className='w-full flex flex-col gap-3'>
      {shortTermMemory.map(({ role, content }, index) => (
        <div key={index} className='flex flex-col gap-1' style={{ textAlign: role === 'user' ? 'right' : 'left' }}>
          <div className='w-full text-sm font-bold'>
            {role === 'user' ? userName : selfName}
          </div>
          <div className='w-full text-sm'>
            {content}
          </div>
        </div>
      ))}
    </div>
  )
}
