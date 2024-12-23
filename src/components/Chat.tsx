import { flushSync } from 'react-dom'
import { useRef, useEffect, useState } from 'react'
import { Button, Form, Input, Tag } from 'antd'
import { MessageOutlined, ClearOutlined, LoadingOutlined, NotificationOutlined } from '@ant-design/icons'
import { useApi } from '../lib/useApi.ts'
import { useStates } from '../lib/useStates.ts'
import { useMemory } from '../lib/useMemory.ts'
import { sleep, clone } from '../lib/utils.ts'
import emojiReg from 'emoji-regex'

interface FormValues {
  text: string
}

export function Chat() {

  const [form] = Form.useForm<FormValues>()
  const memoContainerRef = useRef<HTMLDivElement>(null)
  const { disabled, setDisabled, messageApi } = useStates()
  const { chat, speak, listen, live2d } = useApi()
  const { getPrompt, shortTermMemory, setShortTermMemory, userName, selfName } = useMemory()
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [shortTermMemory])
  const [recognition, setRecognition] = useState<ReturnType<ListenApi> | null>(null)
  const [tokenUsage, setTokenUsage] = useState<number | null>(null)

  const onFinish = async (values: FormValues) => {
    const prev = clone(shortTermMemory)
    const time = Date.now()
    try {
      const input = [
        ...prev,
        { role: 'user', content: values.text, timestamp: time },
      ]
      const answer = chat([
        { role: 'system', content: getPrompt() },
        ...input.map(({ role, content }) => ({ role, content })),
      ])
      let response = ''
      
      await setShortTermMemory(input)
      const reg = /。|？|！|,|，|;|；|~|～/g
      const emoji = emojiReg()
      let current = ''
      let buffer = ''
      live2d?.clearTips()
      for await (const chunk of answer) {
        const text = chunk.response ?? ''
        buffer += text
        response += text
        const splited = buffer.split(reg).filter((s) => s.length !== 0)
        if (splited.length > 1) {
          const { promise, resolve, reject } = Promise.withResolvers<void>() // 等待这句话说完
          for (const s of splited.slice(0, -1)) {
            if (typeof speak === 'function') {
              speak(splited.slice(0, -1).join('').replace(emoji, '')).then(() => resolve()).catch((e) => reject(e))
            }
            let words = ''
            for (const w of s) {
              current += w
              await setShortTermMemory([...input, { role: 'assistant', content: current, timestamp: time }])
              words += w
              live2d?.tipsMessage(words, 10000, Date.now())
              await sleep(30)
            }
            const comma = response[current.length]
            if (comma.match(reg)) {
              current += comma
              await setShortTermMemory([...input, { role: 'assistant', content: current, timestamp: time }])
              await sleep(30)
            }
            await sleep(1000) // 每个句子之间的间隔
          }
          buffer = splited[splited.length - 1]
          if (typeof speak === 'function') {
            await promise // 等待这句话说完
          }
        }
        if (chunk.done) {
          setTokenUsage(chunk.token ?? null)
        }
      }
      if (buffer.length !== 0) {
        const { promise, resolve, reject } = Promise.withResolvers<void>() // 等待这句话说完
        if (typeof speak === 'function') {
          speak(buffer.replace(emoji, '')).then(() => resolve()).catch((e) => reject(e))
        }
        let words = ''
        for (const w of buffer) {
          current += w
          await setShortTermMemory([...input, { role: 'assistant', content: current, timestamp: time }])
          if (!w.match(reg)) {
            words += w
          }
          live2d?.tipsMessage(words, 2000, Date.now())
          await sleep(30)
        }
        if (typeof speak === 'function') {
          await promise // 等待这句话说完
        }
      }
      await setShortTermMemory([...input, { role: 'assistant', content: response, timestamp: time }])

    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : '未知错误')
      await setShortTermMemory(prev)
    }
  }
  const onUpdate = async () => {
    messageApi?.info('本功能暂未实现, 目前仅为清除短时记忆')
    await setShortTermMemory([])
  }

  return (
    <section className='w-full max-w-md overflow-hidden flex flex-col justify-center items-center'>
      <Form
        className='w-full max-h-[calc(100dvh-10.25rem)] relative overflow-auto p-6 pb-2 rounded-md border border-blue-900'
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
          label={<span>消息{tokenUsage !== null && <Tag className='ml-[0.35rem]'>记忆负荷: {tokenUsage}</Tag>}</span>}
          name='text'
          rules={[{ required: true, message: '请输入消息' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <div className='w-full flex justify-between items-center gap-3'>
            {recognition !== null ? (
              <Button
                className='w-full'
                icon={<LoadingOutlined />}
                onClick={async () => {
                  try {
                    recognition!.stop()
                    const text = await recognition!.result
                    form.setFieldsValue({ text })
                    messageApi?.success('语音识别成功')
                  } catch (e) {
                    messageApi?.warning(e instanceof Error ? e.message : typeof e === 'string' ? e : '未知错误')
                  } finally {
                    setRecognition(null)
                  }
                }}
              >
                结束录音
              </Button>
            ) : (
              <Button
                className='w-full'
                icon={<NotificationOutlined />}
                disabled={disabled !== false || listen === null}
                onClick={() => {
                  messageApi?.info('再次点击按钮可以结束录音')
                  const recognition = listen!()
                  setRecognition(recognition)
                  recognition.start()
                }}
              >
                开始录音
              </Button>
            )}
            <Button 
              htmlType='submit' 
              className='w-full'
              icon={<MessageOutlined />}
            >
              发送
            </Button>
            <Button 
              className='w-full' 
              icon={<ClearOutlined />} 
              disabled={disabled !== false || shortTermMemory.length === 0}
              onClick={async () => { 
                flushSync(() => setDisabled('更新记忆中...'))
                await onUpdate()
                form.resetFields()
                flushSync(() => setDisabled(false))
              }}>
              更新记忆
            </Button>
          </div>
        </Form.Item>
        <Form.Item label='短时记忆'>
          <div className='w-full max-h-60 overflow-auto border rounded-md p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-all' ref={memoContainerRef}>
            <div className='w-full flex flex-col gap-3'>
              {shortTermMemory.map(({ role, content }, index) => (
                <div key={index} className='flex flex-col gap-1' style={{ textAlign: role === 'user' ? 'right' : 'left' }}>
                  <div className='w-full text-sm font-bold'>
                    {role === 'user' ? userName : selfName}
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
