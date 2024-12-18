import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Button, Form, Select, Input, Collapse } from 'antd'
import type { Live2dApi } from '../lib/types.ts'
import { uuid } from '../lib/utils.ts'

interface FormValues {
  text: string
  voice: boolean
}

export function Chat() {

  const [form] = Form.useForm<FormValues>()
  const [disabled, setDisabled] = useState(true)
  const [live2d, setLive2d] = useState<Live2dApi | null>(null)

  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
  useEffect(() => {
    api.loadChat().then(chats => {
      const chat = chats[0]
      chat && setMessages(chat.messages)
    })
  }, [])
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [messages])

  const onFinish = async (values: FormValues) => {
    const { text, voice } = values
    const newMessages = [...messages, { role: 'user', content: text }]
    flushSync(() => setMessages(newMessages))
    const answer = await api.chat(newMessages)
    let response = ''
    let current = ''
    let buffer = ''
    live2d?.stop()
    for await (const chunk of answer) {
      const text = chunk.response ?? ''
      buffer += text
      response += text
      const splited = buffer.split(/。|？|！|,|，|;|；/).filter((s) => s.length !== 0)
      if (splited.length > 1) {
        for (const s of splited.slice(0, -1)) {
          for (const w of s) {
            flushSync(() => setMessages([...newMessages, { role: 'assistant', content: current + w }]))
            current += w
            await new Promise((resolve) => setTimeout(resolve, 30))
          }
          const comma = response[current.length]
          if (comma.match(/。|？|！|,|，|;|；/)) {
            flushSync(() => setMessages([...newMessages, { role: 'assistant', content: current + comma }]))
            current += comma
            await new Promise((resolve) => setTimeout(resolve, 30))
          }
          live2d?.say(s)
          voice && await api.speak(s)
        }
        buffer = splited[splited.length - 1]
      }
    }
    if (buffer.length !== 0) {
      for (const w of buffer) {
        flushSync(() => setMessages([...newMessages, { role: 'assistant', content: current + w }]))
        current += w
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      live2d?.say(buffer)
      voice && await api.speak(buffer)
    }
    const resultMessages = [...newMessages, { role: 'assistant', content: response }]
    setMessages(resultMessages)
    await api.saveChat({ uuid: uuid(), title: '对话', messages: resultMessages })
    live2d?.stop()
  }

  useEffect(() => {
    const live2d = api.loadLive2d(document.getElementById('live2d')!)
    setLive2d(live2d)
    setDisabled(false)
    return () => {
      live2d.remove()
      setLive2d(null)
      setDisabled(true)
    }
  }, [])

  return (
    <main className='w-dvw h-dvh overflow-hidden flex flex-row justify-center items-center bg-yellow-50'>
      <Form
        className='max-w-md w-full overflow-auto p-6 pb-2 bg-white rounded-md border border-yellow-950'
        layout='vertical'
        form={form}
        onFinish={async (values: FormValues) => {
          flushSync(() => setDisabled(true))
          await onFinish(values)
          flushSync(() => setDisabled(false))
        }}
        disabled={disabled}
        initialValues={{
          text: '你好!',
          voice: true,
        }}
      >
        <Form.Item
          label='语音'
          name='voice'
          rules={[{ required: true, message: '请选择是否开启语音' }]}
        >
          <Select
            options={[
              { label: '开启', value: true },
              { label: '关闭', value: false },
            ]}
          />
        </Form.Item>
        <Form.Item
          label='输入'
          name='text'
          rules={[{ required: true, message: '请输入消息' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' className='mr-4'>
            提交
          </Button>
          <Button onClick={() => speechSynthesis.cancel()}>
            停止
          </Button>
        </Form.Item>
      </Form>
      <Collapse
        defaultActiveKey={['messages']}
        className='w-1/3 ml-8 overflow-hidden bg-white rounded-md border border-yellow-950'
        items={[
          {
            key: 'messages',
            label: '文字记录',
            children: (<div className='w-full max-h-[30rem] overflow-auto' ref={container}>
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className='text-gray-500'>{message.role === 'user' ? '我' : '小叶子'}</span>
                  <p className='mt-2'>{message.content}</p>
                </div>
              ))}
            </div>)
          }
        ]}
      />
      <div id='live2d' className='w-0 h-[40rem]'></div>
    </main>
  )
}
