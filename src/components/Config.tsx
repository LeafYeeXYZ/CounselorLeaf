import { useApi } from '../lib/useApi.ts'
import { Form, Select } from 'antd'

export function Config() {

  const { 
    setSpeakApi, 
    setChatApi, 
    setLoadLive2d,
    setListenApi,
    speakApiList,
    chatApiList,
    live2dList,
    listenApiList,
    currentSpeakApi,
    currentChatApi,
    currentLive2d,
    currentListenApi,
  } = useApi()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto'
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
        <Form.Item label='聊天形象'>
          <Select 
            options={live2dList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentLive2d}
            onChange={async (value) => { 
              await setLoadLive2d(value)
            }}
          />
        </Form.Item>
      </Form>
    </section>
  )
}
