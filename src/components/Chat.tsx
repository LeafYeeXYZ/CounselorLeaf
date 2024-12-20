import { flushSync } from 'react-dom'
import { useRef, useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { MessageOutlined, ClearOutlined } from '@ant-design/icons'
import { useApi } from '../lib/useApi.ts'
import { useStates } from '../lib/useStates.ts'
import { sleep, clone } from '../lib/utils.ts'

interface FormValues {
  text: string
}

export function Chat() {

  const [form] = Form.useForm<FormValues>()
  const { disabled, setDisabled, live2d, messageApi } = useStates()
  const [currentChat, setCurrentChat] = useState<{ role: string, content: string }[]>([])
  const { chat, currentLive2d } = useApi()
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [currentChat])

  const prompt = '你是一个心理学专业的学生, 男性, 名叫小叶子. 请你以支持的, 非指导性的方式陪伴对方. 请不要回复长的和正式的内容, 避免说教, 表现得像一个真实、专业、共情、可爱的朋友. 回复务必要简短, 且不要使用任何 Markdown 格式. 多使用 Emoji 来表达情绪和让对话更生动.'
  const onFinish = async (values: FormValues) => {
    try {
      // TODO: 语音
      const { text } = values
      const input = [
        ...clone(currentChat), 
        { role: 'user', content: text },
      ]
      flushSync(() => setCurrentChat(input))
      const answer = await chat([
        { role: 'system', content: prompt },
        ...input,
      ])
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
              flushSync(() => setCurrentChat([...input, { role: 'assistant', content: current }]))
              words += w
              live2d?.tipsMessage(words, 10000, Date.now())
              await sleep(30)
            }
            const comma = response[current.length]
            if (comma.match(/。|？|！|,|，|;|；/)) {
              current += comma
              flushSync(() => setCurrentChat([...input, { role: 'assistant', content: current }]))
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
          flushSync(() => setCurrentChat([...input, { role: 'assistant', content: current }]))
          if (!w.match(/。|？|！|,|，|;|；/)) {
            words += w
          }
          live2d?.tipsMessage(words, 2000, Date.now())
          await sleep(30)
        }
      }
      setCurrentChat([...input, { role: 'assistant', content: response }])
    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : '未知错误')
    }
  }

  return (
    <section className='w-full max-w-md overflow-hidden flex flex-col justify-center items-center'>
      <Form
        className='w-full overflow-auto p-6 pb-2 rounded-md border border-yellow-950'
        layout='vertical'
        form={form}
        onFinish={async (values: FormValues) => {
          flushSync(() => setDisabled('对话中...'))
          form.setFieldValue('text', '')
          await onFinish(values)
          flushSync(() => setDisabled(false))
        }}
        initialValues={{
          text: '你好!',
        }}
        disabled={disabled !== false}
      >
        <Form.Item
          label='消息'
          name='text'
          rules={[{ required: true, message: '请输入消息' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item >
          <div className='w-full flex justify-between items-center'>
            <Button htmlType='submit' className='w-[48%]' icon={<MessageOutlined />}>
              发送
            </Button>
            <Button className='w-[48%]' icon={<ClearOutlined />} onClick={() => { setCurrentChat([]); form.resetFields() }}>
              重置
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <div className='w-full max-h-40 overflow-auto border rounded-md p-3 border-yellow-950' ref={chatRef}>
            <div className='w-full flex flex-col gap-3'>
              {currentChat.map(({ role, content }, index) => (
                <div key={index} className='flex flex-col gap-1' style={{ textAlign: role === 'user' ? 'right' : 'left' }}>
                  <div className='w-full text-sm font-bold'>
                    {role === 'user' ? '我' : currentLive2d}
                  </div>
                  <div className='w-full text-sm'>
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form.Item>
      </Form>
    </section>
  )
}
