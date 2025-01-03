import { useApi } from '../lib/hooks/useApi.ts'
import { Form, Select } from 'antd'

export function ConfigService() {

  const { 
    setSpeakApi, 
    setChatApi, 
    setListenApi,
    speakApiList,
    chatApiList,
    listenApiList,
    currentSpeakApi,
    currentChatApi,
    currentListenApi,
  } = useApi()

  return (
    <Form 
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-16rem)]'
    >
      <Form.Item label='语音合成服务'>
        <Select 
          options={speakApiList.map((name) => ({ label: name, value: name }))}
          value={currentSpeakApi}
          onChange={async (value) => { 
            await setSpeakApi(value)
          }}
        />
      </Form.Item>
      <Form.Item label='对话生成服务'>
        <Select 
          options={chatApiList.map((name) => ({ label: name, value: name }))}
          defaultValue={currentChatApi}
          onChange={async (value) => { 
            await setChatApi(value)
          }}
        />
      </Form.Item>
      <Form.Item label='语音识别服务'>
        <Select 
          options={listenApiList.map((name) => ({ label: name, value: name }))}
          defaultValue={currentListenApi}
          onChange={async (value) => { 
            await setListenApi(value)
          }}
        />
      </Form.Item>
    </Form>
  )
}
