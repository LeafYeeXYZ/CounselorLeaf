import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { Form, Select, Space, Input, Button, Tooltip } from 'antd'
import { useState, useEffect } from 'react'
import { SaveOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons'

export function ConfigVoice() {

  const { setSpeakApi, speakApiList, currentSpeakApi, f5TtsEndpoint, fishSpeechEndpoint, setF5TtsEndpoint, setFishSpeechEndpoint } = useSpeakApi()
  const { setListenApi, listenApiList, currentListenApi } = useListenApi()
  const [form] = Form.useForm()
  const { messageApi } = useStates()
  const [f5TtsEndpointModified, setF5TtsEndpointModified] = useState(false)
  const [fishSpeechEndpointModified, setFishSpeechEndpointModified] = useState(false)
  useEffect(() => form.setFieldsValue({ f5TtsEndpoint }), [f5TtsEndpoint, form])
  useEffect(() => form.setFieldsValue({ fishSpeechEndpoint }), [fishSpeechEndpoint, form])

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full bg-white border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-full'
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
      <Form.Item 
        label={<div className='flex gap-1'>
          <div>播放测试音频</div>
          <Tooltip color='blue' title='Safari 浏览器可能会阻止应用直接播放音频, 在此处手动播放一次有助于解决在聊天中的相关错误'>
            <InfoCircleOutlined />
          </Tooltip>
        </div>}
      >
        <audio className='w-full' controls src='/tts/luoshaoye.wav' />
      </Form.Item>
      <Form.Item label='F5 TTS API Endpoint'>
        <Space.Compact block>
          <Tooltip title='恢复默认值' color='blue'>
            <Button 
              type='default' 
              autoInsertSpace={false} 
              icon={<ReloadOutlined />}
              onClick={async () => {
                await setF5TtsEndpoint()
                setF5TtsEndpointModified(false)
                messageApi?.success('F5 TTS API Endpoint 已恢复默认值')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='f5TtsEndpoint'>
            <Input onChange={() => setF5TtsEndpointModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={f5TtsEndpointModified ? 'primary' : 'default'}
              autoInsertSpace={false} 
              icon={<SaveOutlined />}
              onClick={async () => {
                await setF5TtsEndpoint(form.getFieldValue('f5TtsEndpoint'))
                setF5TtsEndpointModified(false)
                messageApi?.success('F5 TTS API Endpoint 已更新')
              }}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='Fish Speech API Endpoint'>
        <Space.Compact block>
          <Tooltip title='恢复默认值' color='blue'>
            <Button 
              type='default' 
              autoInsertSpace={false} 
              icon={<ReloadOutlined />}
              onClick={async () => {
                await setFishSpeechEndpoint()
                setFishSpeechEndpointModified(false)
                messageApi?.success('Fish Speech API Endpoint 已恢复默认值')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='fishSpeechEndpoint'>
            <Input onChange={() => setFishSpeechEndpointModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={fishSpeechEndpointModified ? 'primary' : 'default'}
              autoInsertSpace={false} 
              icon={<SaveOutlined />}
              onClick={async () => {
                await setFishSpeechEndpoint(form.getFieldValue('fishSpeechEndpoint'))
                setFishSpeechEndpointModified(false)
                messageApi?.success('Fish Speech API Endpoint 已更新')
              }}
            />
          </Tooltip>
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
