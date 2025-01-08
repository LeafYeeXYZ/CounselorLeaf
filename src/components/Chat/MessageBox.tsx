import { useEffect, useMemo, useState, useRef } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { Bubble } from '@ant-design/x'
import { Button } from 'antd'
import { UserOutlined, CopyOutlined, SoundOutlined, LoadingOutlined } from '@ant-design/icons'

export function MessageBox() {

  const { shortTermMemory } = useMemory()
  const { audiosCache, setAudiosCache } = useSpeakApi()

  const memoryList = useMemo(() => {
    const length = shortTermMemory.length
    if (length !== 0 && shortTermMemory[length - 1].role === 'user') {
      return [...shortTermMemory, { role: 'assistant', content: '__loading__', timestamp: -1 }]
    } else {
      return shortTermMemory
    }
  }, [shortTermMemory])

  useEffect(() => {
    if (shortTermMemory.length !== 0) {
      return
    }
    setAudiosCache([])
  }, [shortTermMemory, setAudiosCache])

  return (
    <div className='w-full flex flex-col gap-3 pr-[0.2rem] py-1'>
      {memoryList.map((memo, index) => (
        <BubbleWithFooter 
          key={index} 
          role={memo.role}
          content={memo.content}
          audio={audiosCache.find(({ timestamp }) => timestamp === memo.timestamp)?.audio ?? undefined}
        />
      ))}
    </div>
  )
}

function BubbleWithFooter({ role, content, audio }: { role: string, content: string, audio?: Uint8Array }) {

  const { userName, selfName } = useMemory()
  const { messageApi } = useStates()
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audio) {
      audioRef.current = new Audio(URL.createObjectURL(new Blob([audio], { type: 'audio/wav' })))
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audio])

  return (
    <Bubble
      header={role === 'user' ? userName : selfName}
      footer={role === 'assistant' && <div className='flex gap-1'>
        <Button 
          type='text' 
          icon={<CopyOutlined />} 
          size='small'
          onClick={async () => {
            await navigator.clipboard.writeText(content)
            messageApi?.success('已复制到剪贴板')
          }}
        />
        <Button
          type='text'
          icon={playing ? <LoadingOutlined /> : <SoundOutlined />}
          size='small'
          disabled={!audioRef.current}
          onClick={playing ? () => {
            audioRef.current!.pause()
            audioRef.current!.currentTime = 0
            setPlaying(false)
          } : () => {
            audioRef.current!.onended = () => setPlaying(false)
            audioRef.current!.play()
            setPlaying(true)
          }}
        />
      </div>}
      placement={role === 'user' ? 'end' : 'start'}
      content={content}
      loading={content === '__loading__'}
      avatar={role === 'user' ? 
        { icon: <UserOutlined />, className: 'bg-blue-200 text-blue-900' } : 
        { src: '/avatar.jpg' }
      }
    />
  )
}
