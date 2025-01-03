import { useState, useRef } from 'react'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { Segmented } from 'antd'
import { useStates } from '../lib/hooks/useStates.ts'
import { ChatCheck } from './ChatCheck.tsx'
import { ChatText } from './ChatText.tsx'
import { ChatVoice } from './ChatVoice.tsx'

export function Chat() {

  const [ready, setReady] = useState<boolean>(false)
  const { shortTermMemory } = useMemory()
  const shortTermMemoryRef = useRef<ShortTermMemory[]>(shortTermMemory)
  const { disabled, chatMode, setChatMode } = useStates()

  return (
    <section className='w-full overflow-hidden flex flex-col justify-center items-center'>
      {ready ? (<>
        <Segmented
          disabled={disabled !== false}
          className='border border-blue-900 p-1 absolute top-[4.5rem]'
          defaultValue={chatMode}
          options={[ { label: '聊天', value: 'text' }, { label: '对话', value: 'voice' } ]}
          onChange={setChatMode}
        />
        {chatMode === 'text' ? <ChatText shortTermMemoryRef={shortTermMemoryRef} /> : <ChatVoice shortTermMemoryRef={shortTermMemoryRef} />}
      </>) : <ChatCheck setReady={setReady} />}
    </section>
  )
}
