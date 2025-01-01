import { flushSync } from 'react-dom'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Button, Form, Input, Tag, Popover, Popconfirm } from 'antd'
import { MessageOutlined, ClearOutlined, LoadingOutlined, NotificationOutlined, BarsOutlined, RestOutlined } from '@ant-design/icons'
import { useApi } from '../lib/hooks/useApi.ts'
import { useStates } from '../lib/hooks/useStates.ts'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { sleep, clone } from '../lib/utils.ts'
import emojiReg from 'emoji-regex'

interface FormValues {
  text: string
}

export function ChatReady() {

  const [form] = Form.useForm<FormValues>()
  const memoContainerRef = useRef<HTMLDivElement>(null)
  const { disabled, setDisabled, messageApi } = useStates()
  const { chat, speak, listen, live2d, maxToken, usedToken, setUsedToken } = useApi()
  const { chatWithMemory, updateMemory, shortTermMemory, setShortTermMemory, userName, selfName, updateCurrentSummary, setCurrentSummary } = useMemory()
  useEffect(() => {
    if (memoContainerRef.current) {
      memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight
    }
  }, [shortTermMemory])
  const [recognition, setRecognition] = useState<ReturnType<ListenApi> | null>(null)
  const memoryPressure = useMemo<number | undefined>(() => usedToken && usedToken / maxToken, [usedToken, maxToken])

  const onFinish = async (values: FormValues) => {
    const prev = clone(shortTermMemory)
    const time = Date.now()
    try {
      const input = [
        ...prev,
        { role: 'user', content: values.text, timestamp: time },
      ]
      const answer = chatWithMemory(chat, values.text)
      let response = ''
      let tokenSet = false
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
          let _speak: Promise<void> = Promise.resolve()
          for (const s of splited.slice(0, -1)) {
            if (typeof speak === 'function') {
              _speak = speak(splited.slice(0, -1).join('').replace(emoji, ''))
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
          await _speak
        }
        if (chunk.done && chunk.token !== undefined) {
          tokenSet = true
          await setUsedToken(chunk.token)
        }
      }
      // 直接开始更新总结
      const summarize = updateCurrentSummary(chat)
      // 等待最后一句话说完
      if (buffer.length !== 0) {
        let _speak: Promise<void> = Promise.resolve()
        if (typeof speak === 'function') {
          _speak = speak(buffer.replace(emoji, ''))
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
        await _speak
      }
      const output = [...input, { role: 'assistant', content: response, timestamp: time }]
      if (!tokenSet) {
        tokenSet = true
        await setUsedToken(output.map(({ content }) => content).join('').length + prompt.length)
      }
      await setShortTermMemory(output)
      // 等待更新总结
      flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>))
      await summarize
    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : '未知错误')
      await setShortTermMemory(prev)
    }
  }

  return (
    <Form
      className='w-full max-h-[calc(100dvh-10.25rem)] relative overflow-auto p-6 pb-2 rounded-md border border-blue-900'
      layout='vertical'
      form={form}
      onFinish={async (values: FormValues) => {
        if (usedToken && usedToken >= maxToken) {
          messageApi?.error('记忆负荷过大, 请先更新记忆')
          return
        }
        flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>对话中 <LoadingOutlined /></p>))
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
        label={<span>
          消息{(typeof usedToken === 'number' && usedToken > 0) && (
            <Popover 
              content={`${usedToken} / ${maxToken}`}
            >
              <Tag 
                color={memoryPressure! > 0.8 ? 'red' : memoryPressure! > 0.6 ? 'orange' : 'green'}
                className='ml-[0.35rem]'
              >记忆负荷: {(memoryPressure! * 100).toFixed(0)}%</Tag>
            </Popover>
          )}
        </span>}
        name='text'
        rules={[{ required: true, message: '请输入消息' }]}
      >
        <Input.TextArea 
          autoSize={{ minRows: 3, maxRows: 3 }}
        />
      </Form.Item>
      <Form.Item>
        <div className='w-full flex justify-between items-center gap-3'>
          <Popover
            title='语音输入'
            content='点击按钮开始, 再次点击结束'
            trigger={['hover', 'click']}
          >
            <Button
              disabled={disabled !== false || listen === null}
              onClick={recognition !== null ? async () => {
                try {
                  recognition.stop()
                  const text = await recognition.result
                  form.setFieldsValue({ text })
                  messageApi?.success('语音识别成功')
                } catch (e) {
                  messageApi?.warning(e instanceof Error ? e.message : typeof e === 'string' ? e : '未知错误')
                } finally {
                  setRecognition(null)
                }
              } : () => {
                messageApi?.info('再次点击按钮结束说话')
                const recognition = listen!()
                setRecognition(recognition)
                recognition.start()
              }}
            >
              {recognition !== null ? <LoadingOutlined /> : <NotificationOutlined />}
            </Button>
          </Popover>
          <Button 
            htmlType='submit' 
            className='w-full'
            icon={<MessageOutlined />}
          >
            发送
          </Button>
          <Popover
            title='更多'
            trigger={(disabled !== false || shortTermMemory.length === 0) ? 'click' : ['hover', 'click']}
            content={<div className='flex flex-col gap-2'>
              <Popconfirm
                title={<span>系统会根据时间自动更新记忆<br />但您也可以通过本功能手动更新<br />您确定要立即更新记忆吗?</span>}
                onConfirm={async () => {
                  try {
                    flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>更新记忆中 <LoadingOutlined /></p>))
                    await updateMemory(chat)
                    await setUsedToken(undefined)
                    messageApi?.success('记忆更新成功')
                    form.resetFields()
                  } catch (error) {
                    messageApi?.error(error instanceof Error ? error.message : '未知错误')
                  } finally {
                    setDisabled(false)
                  }
                }}
                okText='确定'
                cancelText='取消'
              >
                <Button 
                  className='w-full' 
                  icon={<ClearOutlined />} 
                  disabled={disabled !== false || shortTermMemory.length === 0}
                >
                  更新记忆
                </Button>
              </Popconfirm>
              <Popconfirm
                title={<span>本操作将直接清除当前对话内容<br />不会更新记忆和自我概念<br />您确定要清楚当前对话吗?</span>}
                onConfirm={async () => {
                  try {
                    flushSync(() => setDisabled(<p className='flex justify-center items-center gap-[0.3rem]'>清除对话中 <LoadingOutlined /></p>))
                    await setShortTermMemory([])
                    await setCurrentSummary('')
                    await setUsedToken(undefined)
                    messageApi?.success('对话已清除')
                    form.resetFields()
                  } catch (error) {
                    messageApi?.error(error instanceof Error ? error.message : '未知错误')
                  } finally {
                    setDisabled(false)
                  }
                }}
                okText='确定'
                cancelText='取消'
              >
                <Button 
                  className='w-full' 
                  icon={<RestOutlined />}
                  disabled={disabled !== false || shortTermMemory.length === 0}
                >
                  清除当前对话
                </Button>
              </Popconfirm>
            </div>}
          >
            <Button
              disabled={disabled !== false || shortTermMemory.length === 0}
            >
              <BarsOutlined />
            </Button>
          </Popover>
        </div>
      </Form.Item>
      <Form.Item label='短时记忆'>
        <div className='w-full max-h-[calc(100dvh-27.5rem)] overflow-auto border rounded-md p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-all' ref={memoContainerRef}>
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
  )
}
