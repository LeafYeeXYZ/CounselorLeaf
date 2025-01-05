import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { Form, Select, Space, Input, Button } from 'antd'
import { useState } from 'react'

export function ConfigVoice() {

  const { setSpeakApi, speakApiList, currentSpeakApi, f5TtsEndpoint, fishSpeechEndpoint, setF5TtsEndpoint, setFishSpeechEndpoint } = useSpeakApi()
  const { setListenApi, listenApiList, currentListenApi } = useListenApi()
  const [form] = Form.useForm()
  const { messageApi } = useStates()
  const [f5TtsEndpointModified, setF5TtsEndpointModified] = useState(false)
  const [fishSpeechEndpointModified, setFishSpeechEndpointModified] = useState(false)

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-9.6rem)]'
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
      <Form.Item label='F5 TTS API Endpoint'>
        <Space.Compact block>
          <Form.Item noStyle name='f5TtsEndpoint' initialValue={f5TtsEndpoint}>
            <Input onChange={() => setF5TtsEndpointModified(true)} />
          </Form.Item>
          <Button
            type={f5TtsEndpointModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setF5TtsEndpoint(form.getFieldValue('f5TtsEndpoint'))
              setF5TtsEndpointModified(false)
              messageApi?.success('F5 TTS API Endpoint 已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='Fish Speech API Endpoint'>
        <Space.Compact block>
          <Form.Item noStyle name='fishSpeechEndpoint' initialValue={fishSpeechEndpoint}>
            <Input onChange={() => setFishSpeechEndpointModified(true)} />
          </Form.Item>
          <Button
            type={fishSpeechEndpointModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setFishSpeechEndpoint(form.getFieldValue('fishSpeechEndpoint'))
              setFishSpeechEndpointModified(false)
              messageApi?.success('Fish Speech API Endpoint 已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
      <hr className='border-t border-blue-900 mb-4' />
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
