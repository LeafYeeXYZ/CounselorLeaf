import { useApi } from '../lib/useApi.ts'
import { Form, Select } from 'antd'
import { useEffect } from 'react'

export function Config() {

  const { 
    getSpeakApiList, 
    getStoreApiList, 
    getChatApiList, 
    getLive2dList, 
    setSpeakApi, 
    setStoreApi, 
    setChatApi, 
    setLive2d,
    getCurrentChatApi,
    getCurrentLive2d,
    getCurrentSpeakApi,
    getCurrentStoreApi,
  } = useApi()

  useEffect(() => {
    const localSpeakApi = localStorage.getItem('speakApi')
    const localStoreApi = localStorage.getItem('storeApi')
    const localChatApi = localStorage.getItem('chatApi')
    const localLive2d = localStorage.getItem('live2d')
    if (localSpeakApi && getSpeakApiList().includes(localSpeakApi)) {
      setSpeakApi(localSpeakApi)
    }
    if (localStoreApi && getStoreApiList().includes(localStoreApi)) {
      setStoreApi(localStoreApi)
    }
    if (localChatApi && getChatApiList().includes(localChatApi)) {
      setChatApi(localChatApi)
    }
    if (localLive2d && getLive2dList().includes(localLive2d)) {
      setLive2d(localLive2d)
    }
  }, [getSpeakApiList, getStoreApiList, getChatApiList, getLive2dList, setSpeakApi, setStoreApi, setChatApi, setLive2d])

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-yellow-950 rounded-md bg-white p-6 pb-2 overflow-auto'
      >
        <Form.Item label='语音回复'>
          <Select 
            options={getSpeakApiList().map(name => ({ label: name, value: name }))}
            defaultValue={getCurrentSpeakApi()}
            onChange={(value) => { localStorage.setItem('speakApi', value); setSpeakApi(value) }}
          />
        </Form.Item>
        <Form.Item label='存储方案'>
          <Select 
            options={getStoreApiList().map(name => ({ label: name, value: name }))}
            defaultValue={getCurrentStoreApi()}
            onChange={(value) => { localStorage.setItem('storeApi', value); setStoreApi(value) }}
          />
        </Form.Item>
        <Form.Item label='聊天服务'>
          <Select 
            options={getChatApiList().map(name => ({ label: name, value: name }))}
            defaultValue={getCurrentChatApi()}  
            onChange={(value) => { localStorage.setItem('chatApi', value); setChatApi(value) }}
          />
        </Form.Item>
        <Form.Item label='聊天形象'>
          <Select 
            options={getLive2dList().map(name => ({ label: name, value: name }))}
            defaultValue={getCurrentLive2d()}
            onChange={(value) => { localStorage.setItem('live2d', value); setLive2d(value) }}
          />
        </Form.Item>
      </Form>
    </section>
  )
}
