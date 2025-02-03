import { flushSync } from 'react-dom'
import { sleep } from '../../lib/utils.ts'
import emojiReg from 'emoji-regex'

import { useRef, useEffect, useState, type RefObject } from 'react'
import { useStates } from '../../lib/hooks/useStates.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useLive2dApi } from '../../lib/hooks/useLive2dApi.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'

import { ClearOutlined, LoadingOutlined, RestOutlined, DashboardOutlined } from '@ant-design/icons'
import { Button, Popover, Popconfirm, type GetRef } from 'antd'
import { MessageBox } from './MessageBox.tsx'
import { Sender } from '@ant-design/x'

const DELAY_MS_BEFORE_START_RESPONSE = 1500

export function ChatVoice({ shortTermMemoryRef }: { shortTermMemoryRef: RefObject<ShortTermMemory[]> }) {

  const { disabled, setDisabled, messageApi } = useStates()
  const { qWeatherApiKey } = usePlugins()
  const { chat, usedToken, setUsedToken, openaiModelName, maxToken, addThinkCache } = useChatApi()
  const { vectorApi } = useVectorApi()
  const { speak, addAudioCache } = useSpeakApi()
  const { listen } = useListenApi()
  const { live2d } = useLive2dApi()
  const { chatWithMemory, updateMemory, shortTermMemory, setShortTermMemory, selfName, setCurrentSummary, updateCurrentSummary } = useMemory()
  const [recognition, setRecognition] = useState<ReturnType<ListenApi> | null>(null)

  const [reduceMessage, setReduceMessage] = useState<number>(0)
  useEffect(() => {
    if (shortTermMemory.length === 0) {
      setReduceMessage(0)
    }
  }, [shortTermMemory])
  
  const [canSpeak, setCanSpeak] = useState<boolean>(false)
  const [textBuffer, setTextBuffer] = useState<string>('')

  const senderRef = useRef<GetRef<typeof Sender>>(null)
  useEffect(() => {
    if (shortTermMemory.length === 0) {
      senderRef.current?.focus()
    }
  }, [shortTermMemory])

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [shortTermMemory])

  const [memoMaxHeight, setMemoMaxHeight] = useState<string>('0px')
  useEffect(() => {
    const initSenderHeight = senderRef.current?.nativeElement.clientHeight
    setMemoMaxHeight(`calc(100dvh - ${initSenderHeight}px - 11rem)`)
  }, [])

  const onChat = async (text: string) => { // 注意: 和 ChatText 的 onChat 的语音播放逻辑不同
    const prev = shortTermMemoryRef.current
    const time = Date.now()
    try {
      const input = [
        ...prev,
        { role: 'user', content: text, timestamp: time },
      ]
      await setShortTermMemory(input)
      live2d?.tipsMessage('......', 20000, Date.now())
      const { result, tokens, output: o, think } = await chatWithMemory(
        chat, 
        openaiModelName, 
        input.slice(reduceMessage),
        async (input) => {
          let vec: number[] | undefined = undefined
          try {
            vec = await vectorApi(input)
          } catch {
            messageApi?.warning('输出向量化失败, 记忆提取功能将无法使用')
          }
          return vec
        },
        { qWeatherApiKey }
      )
      if (think) {
        await addThinkCache({ timestamp: time, content: think })
      }
      const output = [...input.slice(0, reduceMessage), ...o]
      const updateSummary = updateCurrentSummary(
        chat, 
        openaiModelName, 
        output.filter(out => !prev.some(p => p.timestamp === out.timestamp)),
      )
      await setUsedToken(tokens)
      const reg = /。|？|！|,|，|;|；|~|～|!|\?|\. |…|\n|\r|\r\n|:|：|……/
      const emoji = emojiReg()
      const { audio } = typeof speak === 'function' ? await speak(result.replace(emoji, '')) : { audio: null }
      audio && await addAudioCache({ timestamp: time, audio })
      const say = audio ? new Promise((resolve, reject) => {
        const v = new Audio(URL.createObjectURL(new Blob([audio], { type: 'audio/wav' })))
        v.onended = resolve
        v.onerror = reject
        v.play().catch(reject)
      }) : Promise.resolve()
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>{selfName}回应中 <LoadingOutlined /></p>))
      let current = ''
      let staps = ''
      for (const w of result) {
        current += w
        await setShortTermMemory([...output, { role: 'assistant', content: current, timestamp: time }])
        await sleep(30)
        if (w.match(reg)) {
          staps = ''
          await sleep(1200)
        } else {
          staps += w
          live2d?.tipsMessage(staps, 10000, Date.now())
        }
      }
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>等待更新记忆结束 <LoadingOutlined /></p>))
      const r = await updateSummary
      await setCurrentSummary(r.result)
      const currentTokens = Math.max(tokens, r.tokens)
      const pressure = currentTokens / maxToken
      if (pressure > 0.9) {
        setReduceMessage((prev) => prev + 2)
      } else if (pressure > 0.85) {
        setReduceMessage((prev) => prev + 1)
      } else if (pressure < 0.75) {
        setReduceMessage(0)
      }
      await setUsedToken(currentTokens)
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>等待对话结束 <LoadingOutlined /></p>))
      await say.catch((e) => messageApi?.error(`语音播放失败: ${e instanceof Error ? e.message : e}`))
      const newMemory = [...output, { role: 'assistant', content: result, timestamp: time }]
      await setShortTermMemory(newMemory)
      shortTermMemoryRef.current = newMemory
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
    <div className='w-full max-h-full relative overflow-hidden p-4 bg-white rounded-md border border-blue-900 gap-4 flex flex-col'>
      <div 
        className='w-full overflow-auto border rounded-lg p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-none'
        style={{ maxHeight: memoMaxHeight }}
        ref={messagesRef}
      >
        {shortTermMemory.length ? <MessageBox /> : <span className='text-gray-400'>无对话内容</span>}
      </div>
      <Sender
        ref={senderRef}
        readOnly
        header={<div className='w-full flex justify-start items-center gap-2 p-2 pb-0'>
          <Popconfirm
            title={<span>系统会根据时间自动更新记忆<br />但您也可以通过本功能手动更新<br />您确定要立即更新记忆吗?</span>}
            onConfirm={async () => {
              try {
                flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>))
                const { tokens } = await updateMemory(
                  chat, 
                  openaiModelName, 
                  async (input) => {
                    let vec: number[] | undefined = undefined
                    try {
                      vec = await vectorApi(input)
                    } catch {
                      messageApi?.warning('记忆索引失败, 请稍后手动索引')
                    }
                    return vec
                  },
                )
                await setUsedToken(tokens)
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
              size='small'
              icon={<ClearOutlined />} 
              disabled={disabled !== false || shortTermMemory.length === 0 || recognition !== null}
            >
              <span className='text-xs'>更新记忆</span>
            </Button>
          </Popconfirm>
          <Popconfirm
            title={<span>本操作将直接清除当前对话内容<br />不会更新记忆和自我概念<br />您确定要清除当前对话吗?</span>}
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
              size='small'
              icon={<RestOutlined />}
              disabled={disabled !== false || shortTermMemory.length === 0 || recognition !== null}
            >
              <span className='text-xs'>清除当前对话</span>
            </Button>
          </Popconfirm>
          {(typeof usedToken === 'number' && usedToken > 0) && (
            <Popover 
              title='记忆负荷'
              content={<div className='flex flex-col gap-1'>
                <div>上次词元用量: {usedToken} / {maxToken}</div>
                <div>下次消息输入: {shortTermMemory.length - reduceMessage} / {shortTermMemory.length}</div>
              </div>}
            >
              <Button
                size='small'
                icon={<DashboardOutlined />}
                disabled={disabled !== false}
              >
                <span className='text-xs'>{(usedToken / maxToken * 100).toFixed(0)}%</span>
              </Button>
            </Popover>
          )}
        </div>}
        onSubmit={async () => {
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
        onCancel={stopCallback}
        disabled={recognition !== null && canSpeak === false}
        loading={recognition !== null}
        value={recognition === null ? '点击右侧按钮开始对话' : canSpeak ? textBuffer ? textBuffer : `${selfName}在听...` : '请稍等...'}
        onChange={() => {
          setTimeout(() => {
            setMemoMaxHeight(`calc(100dvh - ${senderRef.current?.nativeElement.clientHeight}px - 11.5rem)`)
          }, 10)
        }}
      />
    </div>
  )
}
