import { useState, type ReactNode } from 'react'
import { Segmented } from 'antd'
import { useStates } from '../lib/hooks/useStates.ts'
import { ChatCheck } from './ChatCheck.tsx'
import { ChatText } from './ChatText.tsx'
import { ChatVoice } from './ChatVoice.tsx'

const PAGES: { label: string, element: ReactNode, id: 'text' | 'voice' }[] = [
  { label: '聊天', element: <ChatText />, id: 'text' },
  { label: '对话', element: <ChatVoice />, id: 'voice' },
]

export function Chat() {

  const [ready, setReady] = useState<boolean>(false)
  const { disabled, chatMode, setChatMode } = useStates()

  return (
    <section className='w-full overflow-hidden flex flex-col justify-center items-center'>
      {ready ? (<>
        <Segmented
          disabled={disabled !== false}
          className='border border-blue-900 p-1 absolute top-[4.5rem]'
          defaultValue={chatMode}
          options={PAGES.map(({ label, id }) => ({ label, value: id }))}
          onChange={setChatMode}
        />
        {PAGES.find(({ id }) => id === chatMode)!.element}
      </>) : <ChatCheck setReady={setReady} />}
    </section>
  )
}
