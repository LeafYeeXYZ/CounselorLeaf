import { useStates } from '../../lib/hooks/useStates.ts'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export function ChatCheck({ setReady }: { setReady: (ready: boolean) => void }) {

  const { setDisabled, disabled, qWeatherApiKey } = useStates()
  const { testChat, chat, openaiModelName, setUsedToken } = useChatApi()
  const { testListen } = useListenApi()
  const { testSpeak } = useSpeakApi()
  const { shouldUpdateMemory, updateMemory } = useMemory()
  const [statusText, setStatusText] = useState<string>('加载中')
  const [statusError, setStatusError] = useState<boolean>(false)

  // 初始化
  useEffect(() => {
    if (statusText !== '加载中') {
      return
    }
    // 加载服务
    Promise.all([
      testChat(),
      typeof testSpeak === 'function' ? testSpeak() : Promise.resolve(true),
      typeof testListen === 'function' ? testListen() : Promise.resolve(true),
      typeof testListen === 'function' ? navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => stream.getTracks().forEach((track) => track.stop())) : Promise.resolve(true),
      qWeatherApiKey ? new Promise<void>((resolve, reject) => { navigator.geolocation.getCurrentPosition(() => resolve(), reject) }) : Promise.resolve(),
    ]).then(async () => {
      if (shouldUpdateMemory()) {
        setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>)
        setStatusText('更新记忆中')
        await updateMemory(chat, openaiModelName)
        setUsedToken(undefined)
      }
      return
    }).then(() => {
      setReady(true)
      setDisabled((disabled === true || disabled === '加载出错') ? false : disabled)
    }).catch((e) => {
      setStatusError(true)
      setStatusText(e.message)
      setDisabled('加载出错')
    })
  }, [setDisabled, testChat, testSpeak, testListen, setReady, statusText, disabled, shouldUpdateMemory, updateMemory, chat, qWeatherApiKey, openaiModelName, setUsedToken])
  
  return (
    <div 
      style={(disabled === true || disabled === '加载出错') ? {} : { animation: 'hideStart 1s forwards' }}
      className='flex gap-[0.3rem] justify-center items-center flex-col w-full max-h-[calc(100dvh-9.6rem)] p-4 rounded-md border border-blue-900'>
      {statusError ? (<>
        <div>加载出错:</div>
        <div className='text-center'>{statusText}</div>
        <div>请检查服务状态或修改设置</div>
        <Button className='mt-[0.3rem]' onClick={() => {
          setStatusText('加载中')
          setStatusError(false)
        }}>点击重试</Button>
      </>) : (<>
        <div className='flex gap-[0.3rem] justify-center items-center'>
          {statusText} <LoadingOutlined />
        </div>
      </>)}
    </div>
  )
}
