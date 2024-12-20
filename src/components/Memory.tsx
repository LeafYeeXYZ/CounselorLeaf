import { useApi } from '../lib/useApi.ts'
import { Form, Tag, Collapse, type CollapseProps } from 'antd'
import { useMemo } from 'react'

export function Memory() {

  const { 
    memoryAboutSelf,
    memoryAboutUser,
    longTermMemory,
    shortTermMemory,
  } = useApi()

  const longTermMemoryItems = useMemo<CollapseProps['items']>(() => {
    return longTermMemory.map((item) => {
      const start = new Date(item.start)
      const end = new Date(item.end)
      return {
        key: item.uuid,
        label: `${start.getFullYear().toString().slice(2)}-${start.getMonth() + 1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()} - ${end.getFullYear().toString().slice(2)}-${end.getMonth() + 1}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`,
        children: (
          <div className='w-full'>
            {item.summary}
          </div>
        ),
      }
    })
  }, [longTermMemory])

  const shortTermMemoryItems = useMemo<CollapseProps['items']>(() => {
    return shortTermMemory.map((item) => {
      const date = new Date(item.timestamp)
      return {
        key: item.timestamp,
        label: `${date.getFullYear().toString().slice(2)}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        children: (
          <div className='w-full'>
            <Tag color={item.role === 'user' ? 'blue' : 'green'}>{item.role === 'user' ? '你' : '我'}</Tag> {item.content}
          </div>
        ),
      }
    })
  }, [shortTermMemory])

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-yellow-950 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-12rem)]'
      >
        <Form.Item label='关于自己的记忆'>
          <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-yellow-950'>
            {memoryAboutSelf || '没有记忆'}
          </div>
        </Form.Item>
        <Form.Item label='关于你的记忆'>
          <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-yellow-950'>
            {memoryAboutUser || '没有记忆'}
          </div>
        </Form.Item>
        <Form.Item label='长时记忆'>
          <div className='w-full max-h-48 overflow-auto rounded-lg border border-yellow-950'>
            <Collapse
              className='border-none'
              items={longTermMemoryItems?.length !== 0 ? longTermMemoryItems : [{ key: 'none', label: '没有记忆', children: <div></div> }]}
            />
          </div>
        </Form.Item>
        <Form.Item label='短时记忆'>
          <div className='w-full max-h-48 overflow-auto rounded-lg border border-yellow-950'>
            <Collapse
              className='border-none'
              items={shortTermMemoryItems?.length !== 0 ? shortTermMemoryItems : [{ key: 'none', label: '没有记忆', children: <div></div> }]}
            />
          </div>
        </Form.Item>
      </Form>
    </section>
  )
}
