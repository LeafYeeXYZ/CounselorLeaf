import { useEffect, useMemo, useState, useRef } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { getDate } from '../../lib/utils.ts'
import { Bubble } from '@ant-design/x'
import { Button, Popover, Tag } from 'antd'
import { UserOutlined, CopyOutlined, SoundOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons'

export function MessageBox() {

  const { shortTermMemory } = useMemory()
  const { audiosCache, setAudiosCache } = useSpeakApi()

  const memoryList = useMemo(() => {
    const memo = shortTermMemory.filter(item => !item.tool_calls)
    if (memo.length !== 0 && memo[memo.length - 1].role !== 'assistant') {
      return [...memo, { role: 'assistant', content: '__loading__', timestamp: -1 }]
    } else {
      return memo
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
          memo={memo}
          audio={audiosCache.find(({ timestamp }) => timestamp === memo.timestamp)?.audio ?? undefined}
        />
      ))}
    </div>
  )
}

function BubbleWithFooter({ memo, audio }: { memo: ShortTermMemory, audio?: Uint8Array }) {

  const { userName, selfName, longTermMemory } = useMemory()
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
      header={memo.role === 'user' ? userName : selfName}
      footer={(memo.role === 'assistant') && <div className='flex gap-1'>
        <Button 
          type='text' 
          icon={<CopyOutlined />} 
          size='small'
          onClick={async () => {
            await navigator.clipboard.writeText(memo.content)
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
      placement={memo.role === 'user' ? 'end' : 'start'}
      content={memo.role === 'tool' ?
        <span className='text-gray-500'>
          已提取记忆<Popover content={(
            <div className='flex flex-col gap-2'>
              <div key={-1}>
                {memo.recall!.length === 0 ? '没能在记忆库中找到更多和相关的记忆' : `在记忆库里找到了一些和"${memo.recall![0].desc}"相关的记忆`}
              </div>
              {memo.recall!.map((item, index) => {
                const m = longTermMemory.find(({ uuid }) => uuid === item.uuid)!
                return (
                  <div key={index} className='flex gap-2'>
                    <Tag className='m-0' color='blue'>{m.title}</Tag>
                    <Tag className='m-0'>{getDate(m.startTime)}</Tag>
                    <Tag className='m-0'>相似度: {item.similarity.toFixed(2)}</Tag>
                  </div>
                )
              })}
            </div>
          )}><InfoCircleOutlined className='ml-[0.3rem]' /></Popover>
        </span> : 
        memo.content
      }
      loading={memo.content === '__loading__'}
      avatar={memo.role === 'user' ? 
        { icon: <UserOutlined />, className: 'bg-blue-200 text-blue-900' } : 
        { src: '/avatar.jpg' }
      }
    />
  )
}
