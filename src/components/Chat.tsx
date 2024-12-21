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
  const memoContainerRef = useRef<HTMLDivElement>(null)
  const [currentChat, setCurrentChat] = useState<{ role: string, content: string }[]>([])
  const { disabled, setDisabled, live2d, messageApi } = useStates()
  const { chat, currentLive2d, getPrompt } = useApi()
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [currentChat])

  const onFinish = async (values: FormValues) => {
    try {
      const input = [
        ...clone(currentChat), 
        { role: 'user', content: values.text },
      ]
      const answer = await chat([
        { role: 'system', content: getPrompt() },
        ...input,
      ])
      let response = ''
      
      // -------------------------- 以下为对话显示逻辑 --------------------------
      flushSync(() => setCurrentChat(input))
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
      // -------------------------- 以上为对话显示逻辑 --------------------------

    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : '未知错误')
    }
  }

  return (
    <section className='w-full max-w-md overflow-hidden flex flex-col justify-center items-center'>
      <Form
        className='w-full overflow-auto p-6 pb-2 rounded-md border border-blue-900'
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
        <Form.Item>
          <div className='w-full flex justify-between items-center'>
            <Button htmlType='submit' className='w-[48%]' icon={<MessageOutlined />}>
              发送
            </Button>
            <Button className='w-[48%]' icon={<ClearOutlined />} onClick={() => { setCurrentChat([]); form.resetFields() }}>
              更新长时记忆
            </Button>
          </div>
        </Form.Item>
        <Form.Item label='短时记忆'>
          <div className='w-full max-h-40 overflow-auto border rounded-md p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-all' ref={memoContainerRef}>
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
