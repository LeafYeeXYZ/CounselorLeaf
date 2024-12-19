import { flushSync } from 'react-dom'
import { useRef, useEffect } from 'react'
import { Button, Form, Input, Collapse } from 'antd'
import { FileDoneOutlined, MessageOutlined } from '@ant-design/icons'
import { useApi } from '../lib/useApi.ts'
import { useStates } from '../lib/useStates.ts'
import { sleep, clone } from '../lib/utils.ts'

interface FormValues {
  text: string
}

export function Chat() {

  const [form] = Form.useForm<FormValues>()
  const { disabled, setDisabled, live2d, currentChat, setCurrentChat } = useStates()
  const { chat } = useApi()
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [currentChat.messages])

  const onFinish = async (values: FormValues) => {
    // TODO: 语音
    const { text } = values
    const input = [...clone(currentChat.messages), { role: 'user', content: text }]
    flushSync(() => setCurrentChat({ ...currentChat, messages: input }))
    const answer = await chat(input)
    let response = ''
    let current = ''
    let buffer = ''
    live2d?.clearTips()
    for await (const chunk of answer) {
      const text = chunk.response ?? ''
      buffer += text
      response += text
      const splited = buffer.split(/。|？|！|,|，|;|；/).filter((s) => s.length !== 0)
      if (splited.length > 1) {
        for (const s of splited.slice(0, -1)) {
          let words = ''
          for (const w of s) {
            current += w
            flushSync(() => setCurrentChat({ ...currentChat, messages: [...input, { role: 'assistant', content: current }] }))
            words += w
            live2d?.tipsMessage(words, 10000, Date.now())
            await sleep(30)
          }
          const comma = response[current.length]
          if (comma.match(/。|？|！|,|，|;|；/)) {
            current += comma
            flushSync(() => setCurrentChat({ ...currentChat, messages: [...input, { role: 'assistant', content: current }] }))
            await sleep(30)
          }
          await sleep(1000) // 每个句子之间的间隔
        }
        buffer = splited[splited.length - 1]
      }
    }
    if (buffer.length !== 0) {
      let words = ''
      for (const w of buffer) {
        current += w
        flushSync(() => setCurrentChat({ ...currentChat, messages: [...input, { role: 'assistant', content: current }] }))
        words += w
        live2d?.tipsMessage(words, 2000, Date.now())
        await sleep(30)
      }
    }
    setCurrentChat({ ...currentChat, messages: [...input, { role: 'assistant', content: response }] })
  }

  return (
    <section className='w-full max-w-md overflow-hidden flex flex-col justify-center items-center'>
      <Form
        className='w-full overflow-auto p-6 pb-2 bg-white rounded-md border border-yellow-950'
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
        }}
      >
        <Form.Item
          label='输入'
          name='text'
          rules={[{ required: true, message: '请输入消息' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item >
          <div className='grid grid-cols-2 gap-4'>
            <Button htmlType='submit' className='mr-4 w-full' icon={<MessageOutlined />}>
              提交
            </Button>
            <Button className='w-full' icon={<FileDoneOutlined />}> 
              保存并重置
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Collapse
            defaultActiveKey={['current']}
            items={[{
              key: 'current',
              label: '文字记录',
              children: (
                <div className='w-full max-h-40 overflow-auto' ref={chatRef}>
                  <div className='w-full flex flex-col gap-3'>
                    {currentChat.messages.map(({ role, content }, index) => (
                      <div key={index} className='flex flex-col gap-1' style={{ textAlign: role === 'user' ? 'right' : 'left' }}>
                        <div className='w-full text-sm font-bold'>
                          {role === 'user' ? '我' : '他'}
                        </div>
                        <div className='w-full text-sm'>
                          {content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            }]}
          />
        </Form.Item>
      </Form>
    </section>
  )
}
