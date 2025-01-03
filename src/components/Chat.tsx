import { useState, type ReactNode } from 'react'
import { Segmented } from 'antd'
import { ChatCheck } from './ChatCheck.tsx'
import { ChatText } from './ChatText.tsx'
import { ChatVoice } from './ChatVoice.tsx'

const PAGES: { label: string, element: ReactNode, isDefault?: boolean }[] = [
  { label: '聊天', element: <ChatText />, isDefault: true },
  { label: '对话', element: <ChatVoice /> },
]

export function Chat() {

  const [ready, setReady] = useState<boolean>(false)
  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)

  return (
    <section className='w-full overflow-hidden flex flex-col justify-center items-center'>
      {ready ? (<>
        <Segmented
          className='border border-blue-900 p-1 absolute top-[4.5rem]'
          defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
          options={PAGES.map(({ label }) => ({ label, value: label }))}
          onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
        />
        {page}
      </>) : <ChatCheck setReady={setReady} />}
    </section>
  )
}
