import { useState } from 'react'
import { ChatCheck } from './ChatCheck.tsx'
import { ChatReady } from './ChatReady.tsx'

export function Chat() {

  const [ready, setReady] = useState<boolean>(false)

  return (
    <section className='w-full overflow-hidden flex flex-col justify-center items-center'>
      {ready ? <ChatReady /> : <ChatCheck setReady={setReady} />}
    </section>
  )
}
