import { useApi } from '../lib/hooks/useApi.ts'
import { Form, Select } from 'antd'

export function ConfigService() {

  const { 
    setSpeakApi, 
    setListenApi,
    speakApiList,
    listenApiList,
    currentSpeakApi,
    currentListenApi,
  } = useApi()
  const [form] = Form.useForm()

  return (
    <Form 
      form={form}
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
