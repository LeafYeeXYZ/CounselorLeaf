import { useApi } from '../lib/useApi.ts'
import { Form, Select } from 'antd'

export function Config() {

  const { 
    setSpeakApi, 
    setStoreApi, 
    setChatApi, 
    setLive2d,
    speakApiList,
    storeApiList,
    chatApiList,
    live2dList,
    currentSpeakApi,
    currentStoreApi,
    currentChatApi,
    currentLive2d,
  } = useApi()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-yellow-950 rounded-md p-6 pb-2 overflow-auto'
      >
        <Form.Item label='语音回复'>
          <Select 
            options={speakApiList.map((name) => ({ label: name, value: name }))}
            value={currentSpeakApi}
            onChange={(value) => { localStorage.setItem('speakApi', value); setSpeakApi(value) }}
          />
        </Form.Item>
        <Form.Item label='存储方案'>
          <Select 
            options={storeApiList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentStoreApi}
            onChange={(value) => { localStorage.setItem('storeApi', value); setStoreApi(value) }}
          />
        </Form.Item>
        <Form.Item label='聊天服务'>
          <Select 
            options={chatApiList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentChatApi}
            onChange={(value) => { localStorage.setItem('chatApi', value); setChatApi(value) }}
          />
        </Form.Item>
        <Form.Item label='聊天形象'>
          <Select 
            options={live2dList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentLive2d}
            onChange={(value) => { localStorage.setItem('live2d', value); setLive2d(value) }}
          />
        </Form.Item>
      </Form>
    </section>
  )
}
