import { useApi } from '../lib/useApi.ts'
import { Form, Select } from 'antd'

export function Config() {

  const { 
    setSpeakApi, 
    setChatApi, 
    setLive2d,
    speakApiList,
    chatApiList,
    live2dList,
    currentSpeakApi,
    currentChatApi,
    currentLive2d,
  } = useApi()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-yellow-950 rounded-md p-5 pb-1 overflow-auto'
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
        <Form.Item label='聊天形象'>
          <Select 
            options={live2dList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentLive2d}
            onChange={async (value) => { 
              await setLive2d(value)
            }}
          />
        </Form.Item>
      </Form>
    </section>
  )
}
