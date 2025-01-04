import { flushSync } from 'react-dom'
import { useRef, useEffect, useState, useMemo, type RefObject } from 'react'
import { Button, Form, Tag, Popover, Popconfirm } from 'antd'
import { MessageOutlined, ClearOutlined, LoadingOutlined, BarsOutlined, RestOutlined, SoundOutlined, PauseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useStates } from '../lib/hooks/useStates.ts'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { sleep } from '../lib/utils.ts'
import emojiReg from 'emoji-regex'
import { useChatApi } from '../lib/hooks/useChatApi.ts'
import { useListenApi } from '../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../lib/hooks/useSpeakApi.ts'
import { useLive2dApi } from '../lib/hooks/useLive2dApi.ts'

const DELAY_MS_BEFORE_START_RESPONSE = 2000

export function ChatVoice({ shortTermMemoryRef }: { shortTermMemoryRef: RefObject<ShortTermMemory[]> }) {

  const { disabled, setDisabled, messageApi, qWeatherApiKey } = useStates()
  const { chat, usedToken, setUsedToken, openaiModelName, maxToken } = useChatApi()
  const { speak } = useSpeakApi()
  const { listen } = useListenApi()
  const { live2d } = useLive2dApi()
  const { chatWithMemory, updateMemory, shortTermMemory, setShortTermMemory, userName, selfName, updateCurrentSummary, setCurrentSummary } = useMemory()
  
  const [canSpeak, setCanSpeak] = useState<boolean>(false)
  const [textBuffer, setTextBuffer] = useState<string>('')
  const [recognition, setRecognition] = useState<ReturnType<ListenApi> | null>(null)
  const memoryPressure = useMemo<number | undefined>(() => usedToken && usedToken / maxToken, [usedToken, maxToken])

  const memoContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [shortTermMemory])

  const onChat = async (text: string) => {
    const prev = shortTermMemoryRef.current
    const time = Date.now()
    try {
      const input = [
        ...prev,
        { role: 'user', content: text, timestamp: time },
      ]
      await setShortTermMemory(input)
      const { result, tokens } = await chatWithMemory(chat, openaiModelName, input, { qWeatherApiKey })
      const output = [
        ...input,
        { role: 'assistant', content: result, timestamp: time },
      ]
      await setUsedToken(tokens)
      const reg = /。|？|！|,|，|;|；|~|～|~/g
      const emoji = emojiReg()
      live2d?.clearTips()
      const summary = updateCurrentSummary(chat, openaiModelName, output)
      const { start, finish } = typeof speak === 'function' ? await speak(result.replace(emoji, '')) : { start: Promise.resolve(), finish: Promise.resolve() }
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>等待语音生成 <LoadingOutlined /></p>))
      await start
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>{selfName}回应中 <LoadingOutlined /></p>))
      let current = ''
      let staps = ''
      for (const w of result) {
        current += w
        await setShortTermMemory([...input, { role: 'assistant', content: current, timestamp: time }])
        await sleep(40)
        if (w.match(reg)) {
          staps = ''
          await sleep(1000)
        } else {
          staps += w
          live2d?.tipsMessage(staps, 10000, Date.now())
        }
      }
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>))
      await summary
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>等待对话结束 <LoadingOutlined /></p>))
      await finish
      await setShortTermMemory(output)
      shortTermMemoryRef.current = output
    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : '未知错误')
      await setShortTermMemory(prev)
    }
  }
  const startCallback = () => {
    sessionStorage.setItem('voice_chat_chatted', 'no')
    recognition?.stop()
    const api = listen!(listenCallback)
    setRecognition(api)
    api.start()
    api.result.catch(() => {})
    setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>持续对话中 <LoadingOutlined /></p>)
    setCanSpeak(true)
  }
  const stopCallback = () => {
    recognition?.stop()
    setRecognition(null)
    setDisabled(false)
    setCanSpeak(false)
  }
  const listenCallback = (text: string) => {
    if (sessionStorage.getItem('voice_chat_chatted') === 'yes') {
      return
    }
    if (text === '') {
      return
    }
    clearTimeout(Number(sessionStorage.getItem('voice_chat_timer')))
    setTextBuffer(text)
    sessionStorage.setItem('voice_chat_timer', setTimeout(() => {
      sessionStorage.setItem('voice_chat_chatted', 'yes')
      setCanSpeak(false)
      onChat(text)
        .then(() => {
          setTextBuffer('')
          startCallback()
        })
        .catch((e) => {
          stopCallback()
          messageApi?.error(e instanceof Error ? e.message : '未知错误')
        })
    }, DELAY_MS_BEFORE_START_RESPONSE).toString())
  }

  return (
    <Form
      className='w-full max-h-[calc(100dvh-16rem)] relative overflow-auto p-6 pb-2 rounded-md border border-blue-900'
      layout='vertical'
      disabled={disabled !== false}
    >
      <Form.Item
        label={<span>
          当前状态{(typeof usedToken === 'number' && usedToken > 0) && (
            <Popover 
              content={`${usedToken} / ${maxToken}`}
            >
              <Tag 
                color={memoryPressure! > 0.8 ? 'red' : memoryPressure! > 0.6 ? 'orange' : 'green'}
                className='ml-[0.35rem]'
              >记忆负荷: {(memoryPressure! * 100).toFixed(0)}%</Tag>
            </Popover>
          )}
        </span>}
      >
        <div 
          className='w-full flex justify-center items-center gap-2 border border-[#d9d9d9] rounded-md p-3'
          style={{ 
            backgroundColor: recognition === null ? '#f0f9ff' : canSpeak ? '#f0fdf4' : '#fefce8',
            borderColor: recognition === null ? '#0369a1' : canSpeak ? '#15803d' : '#a16207',
          }}
        >
          {recognition === null ? (<>
            <InfoCircleOutlined className='m-0' />
            <div>点击下方按钮开始对话</div>
          </>) : canSpeak ? (<>
            {textBuffer || (<>
              <MessageOutlined className='m-0' />
              <div>请说</div>
            </>)}
          </>) : (<>
            <LoadingOutlined className='m-0' />
            <div>请稍等</div>
          </>)}
        </div>
      </Form.Item>
      <Form.Item>
        <div className='w-full flex justify-between items-center gap-3'>
          {recognition ? (
            <Button 
              disabled={canSpeak === false}
              className='w-full'
              icon={<PauseOutlined />}
              onClick={stopCallback}
            >
              停止对话
            </Button>
          ) : (
            <Button 
              className='w-full'
              icon={<SoundOutlined />}
              onClick={async () => {
                if (usedToken && usedToken >= maxToken) {
                  messageApi?.error('记忆负荷过大, 请先更新记忆')
                  return
                }
                if (!listen) {
                  messageApi?.error('请先启用语音识别服务')
                  return
                }
                startCallback()
                messageApi?.info('再次点击按钮可暂停对话')
              }}
            >
              开始对话
            </Button>
          )}
          <Popover
            title='更多'
            trigger={(disabled !== false || shortTermMemory.length === 0) ? 'click' : ['hover', 'click']}
            content={<div className='flex flex-col gap-2'>
              <Popconfirm
                title={<span>系统会根据时间自动更新记忆<br />但您也可以通过本功能手动更新<br />您确定要立即更新记忆吗?</span>}
                onConfirm={async () => {
                  try {
                    flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>))
                    await updateMemory(chat, openaiModelName)
                    await setUsedToken(undefined)
                    shortTermMemoryRef.current = []
                    messageApi?.success('记忆更新成功')
                  } catch (error) {
                    messageApi?.error(error instanceof Error ? error.message : '未知错误')
                  } finally {
                    setDisabled(false)
                  }
                }}
                okText='确定'
                cancelText='取消'
              >
                <Button 
                  className='w-full' 
                  icon={<ClearOutlined />} 
                  disabled={disabled !== false || shortTermMemory.length === 0}
                >
                  更新记忆
                </Button>
              </Popconfirm>
              <Popconfirm
                title={<span>本操作将直接清除当前对话内容<br />不会更新记忆和自我概念<br />您确定要清楚当前对话吗?</span>}
                onConfirm={async () => {
                  try {
                    flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>清除对话中 <LoadingOutlined /></p>))
                    await setShortTermMemory([])
                    await setCurrentSummary('')
                    await setUsedToken(undefined)
                    shortTermMemoryRef.current = []
                    messageApi?.success('对话已清除')
                  } catch (error) {
                    messageApi?.error(error instanceof Error ? error.message : '未知错误')
                  } finally {
                    setDisabled(false)
                  }
                }}
                okText='确定'
                cancelText='取消'
              >
                <Button 
                  className='w-full' 
                  icon={<RestOutlined />}
                  disabled={disabled !== false || shortTermMemory.length === 0}
                >
                  清除当前对话
                </Button>
              </Popconfirm>
            </div>}
          >
            <Button
              disabled={disabled !== false || shortTermMemory.length === 0 || recognition !== null}
            >
              <BarsOutlined />
            </Button>
          </Popover>
        </div>
      </Form.Item>
      <Form.Item label='短时记忆'>
        <div className='w-full max-h-[calc(100dvh-31.75rem)] overflow-auto border rounded-md p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-all' ref={memoContainerRef}>
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
        </div>
      </Form.Item>
    </Form>
  )
}
