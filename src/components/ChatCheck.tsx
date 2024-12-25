import { useStates } from '../lib/useStates.ts'
import { useApi } from '../lib/useApi.ts'
import { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export function ChatCheck({ setReady }: { setReady: (ready: boolean) => void }) {

  const { setDisabled, disabled } = useStates()
  const { testChat, testListen, testSpeak } = useApi()
  const [status, setStatus] = useState<string>('')

  // 初始化
  useEffect(() => {
    if (status !== '') {
      return
    }
    // 加载服务
    testChat().then(() => {
      // 测试语音合成功能
      return typeof testSpeak === 'function' ? testSpeak() : Promise.resolve(true)
    }).then(() => {
      // 测试语音转文字功能
      return typeof testListen === 'function' ? testListen() : Promise.resolve(true)
    }).then(() => {
      // 如果语音转文字功能开启, 请求权限
      return typeof testListen === 'function' ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.resolve(null)
    }).then((stream) => {
      // 关闭音频流
      if (stream !== null) {
        stream.getTracks().forEach((track) => track.stop())
      }
      // 设置通知 API
      return Promise.resolve()
    }).then(() => {
      // 完成加载
      setReady(true)
      setDisabled((disabled === true || disabled === '加载出错') ? false : disabled)
    }).catch((e) => {
      setStatus(e.message)
      setDisabled('加载出错')
    })
  }, [setDisabled, testChat, testSpeak, testListen, setReady, status, disabled])
  
  return (
    <div 
      style={(disabled === true || disabled === '加载出错') ? {} : { animation: 'hideStart 1s forwards' }}
      className='flex gap-[0.3rem] justify-center items-center flex-col w-full max-h-[calc(100dvh-10.25rem)] p-4 rounded-md border border-blue-900'>
      {status ? (<>
        <div>加载出错:</div>
        <div>{status}</div>
        <div>请检查服务状态或修改设置</div>
        <Button className='mt-[0.3rem]' onClick={() => setStatus('')}>点击重试</Button>
      </>) : (<>
        <div className='flex gap-[0.3rem] justify-center items-center'>
          加载中 <LoadingOutlined />
        </div>
      </>)}
    </div>
  )
}
