import { useChatApi } from '../lib/hooks/useChatApi.ts'
import { useStates } from '../lib/hooks/useStates.ts'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { Form, Button, Space, Input, Tag, InputNumber, Select } from 'antd'
import { useState } from 'react'

export function ConfigMain() {

  const { 
    openaiEndpoint,
    openaiApiKey,
    openaiModelName,
    maxToken,
    setOpenaiEndpoint,
    setOpenaiApiKey,
    setOpenaiModelName,
    setMaxToken,
  } = useChatApi()
  const {
    useStructuredOutputs,
    setUseStructuredOutputs,
  } = useMemory()
  const { messageApi } = useStates()
  const [form] = Form.useForm()
  const [openaiModelNameModified, setOpenaiModelNameModified] = useState(false)
  const [openaiApiKeyModified, setOpenaiApiKeyModified] = useState(false)
  const [openaiEndpointModified, setOpenaiEndpointModified] = useState(false)
  const [maxTokenModified, setMaxTokenModified] = useState(false)

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-16rem)]'
    >
      <Form.Item label={<span>推理服务地址<Tag className='ml-[0.3rem]'>OpenAI Endpoint</Tag></span>}>
        <Space.Compact block>
          <Form.Item noStyle name='openaiEndpoint' initialValue={openaiEndpoint}>
            <Input className='w-full' onChange={() => setOpenaiEndpointModified(true)} />
          </Form.Item>
          <Button
            type={openaiEndpointModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setOpenaiEndpoint(form.getFieldValue('openaiEndpoint'))
              setOpenaiEndpointModified(false)
              messageApi?.success('推理服务地址已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label={<span>推理服务密钥<Tag className='ml-[0.3rem]'>OpenAI API Key</Tag></span>}>
        <Space.Compact block>
          <Form.Item noStyle name='openaiApiKey' initialValue={openaiApiKey}>
            <Input className='w-full' onChange={() => setOpenaiApiKeyModified(true)} />
          </Form.Item>
          <Button
            type={openaiApiKeyModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setOpenaiApiKey(form.getFieldValue('openaiApiKey'))
              setOpenaiApiKeyModified(false)
              messageApi?.success('推理服务密钥已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label={<span>推理服务模型<Tag className='ml-[0.3rem]'>OpenAI Model Name</Tag></span>}>
        <Space.Compact block>
          <Form.Item noStyle name='openaiModelName' initialValue={openaiModelName}>
            <Input className='w-full' onChange={() => setOpenaiModelNameModified(true)} />
          </Form.Item>
          <Button 
            type={openaiModelNameModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setOpenaiModelName(form.getFieldValue('openaiModelName'))
              setOpenaiModelNameModified(false)
              messageApi?.success('推理服务模型已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='使用结构化输出功能'>
        <Select
          defaultValue={useStructuredOutputs}
          onChange={async (value) => {
            await setUseStructuredOutputs(value)
            messageApi?.success(`模型将${value ? '' : '不'}使用结构化输出`)
          }}
          options={[
            { label: '是 (使用 { type: \'json_schema\' })', value: true },
            { label: '否 (使用 { type: \'json_object\' })', value: false },
          ]}
        />
      </Form.Item>
      <Form.Item label='推理模型最大 Token 数'>
        <Space.Compact block>
          <Form.Item noStyle name='maxToken' initialValue={maxToken}>
            <InputNumber className='w-full' onChange={() => setMaxTokenModified(true)} min={2_000} max={120_000} step={1_000} />
          </Form.Item>
          <Button
            type={maxTokenModified ? 'primary' : 'default'}
            autoInsertSpace={false} 
            onClick={async () => {
              await setMaxToken(Number(form.getFieldValue('maxToken')))
              setMaxTokenModified(false)
              messageApi?.success('推理模型最大 Token 数已更新')
            }}
          >更新</Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  )
}
