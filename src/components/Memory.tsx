import { useStates } from '../lib/hooks/useStates.ts'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { Form, Collapse, type CollapseProps, Button, Popover, Input, Space } from 'antd'
import { ExportOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMemo, useState, useRef } from 'react'

export function Memory() {

  const { 
    userName,
    selfName,
    setUserName,
    setSelfName,
    memoryAboutSelf,
    memoryAboutUser,
    longTermMemory,
    resetAllMemory,
    saveAllMemory,
  } = useMemory()
  const { messageApi } = useStates()

  const longTermMemoryItems = useMemo<CollapseProps['items']>(() => {
    return longTermMemory.map((item) => {
      const start = new Date(item.startTime)
      const end = new Date(item.endTime)
      return {
        key: 'memory', // 故意的, 便于同时展开
        label: item.title,
        children: (
          <div className='w-full'>
            {'['}{start.getFullYear().toString().slice(2)}-{start.getMonth() + 1}-{start.getDate()} {start.getHours()}:{start.getMinutes()}:{start.getSeconds()} - {end.getFullYear().toString().slice(2)}-{end.getMonth() + 1}-{end.getDate()} {end.getHours()}:{end.getMinutes()}:{end.getSeconds()}{'] [回忆次数: '}{item.recallTimes}{'] '}{item.summary}
          </div>
        ),
      }
    })
  }, [longTermMemory])

  const [openDeleteMemory, setOpenDeleteMemory] = useState<boolean>(false)
  const deleteMemoryText = useRef<string>('')
  const [form] = Form.useForm()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        form={form}
        layout='vertical' 
        className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-10.25rem)]'
        initialValues={{
          userName,
          selfName,
        }}
      >
        <Form.Item label='你和他的名字'>
          <Space.Compact block>
            <Form.Item noStyle name='userName'>
              <Input 
                placeholder='你的名字'
              />
            </Form.Item>
            <Form.Item noStyle name='selfName'>
              <Input 
                placeholder='他的名字'
              />
            </Form.Item>
            <Button
              onClick={async () => {
                await setUserName(form.getFieldValue('userName'))
                await setSelfName(form.getFieldValue('selfName'))
                messageApi?.success('更新姓名成功')
              }}
              autoInsertSpace={false}
            >
              更新
            </Button>
          </Space.Compact>
        </Form.Item>
        <Form.Item label='关于自己的记忆'>
          <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
            {memoryAboutSelf || '没有记忆'}
          </div>
        </Form.Item>
        <Form.Item label='关于你的记忆'>
          <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
            {memoryAboutUser || '没有记忆'}
          </div>
        </Form.Item>
        <Form.Item label='长时记忆'>
          <div className='w-full max-h-60 overflow-auto rounded-lg border border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
            <Collapse
              className='border-none'
              size='small'
              items={longTermMemoryItems?.length !== 0 ? longTermMemoryItems : [{ key: 'none', label: '没有记忆', children: <div></div> }]}
            />
          </div>
        </Form.Item>
        <Form.Item>
          <div className='w-full flex justify-between items-center gap-4'>
            <Button 
              block
              icon={<ExportOutlined />}
              onClick={async () => {
                await saveAllMemory().then((path) => messageApi?.success(`记忆已导出至 ${path}`)).catch(() => {})
              }}
            >
              导出记忆
            </Button>
            <Popover
              title='确定要重置所有记忆吗, 此操作无法撤销'
              trigger='click'
              open={openDeleteMemory}
              onOpenChange={setOpenDeleteMemory}
              content={<>
                <Input 
                  className='mb-3'
                  placeholder='请输入"删除所有记忆"后点击确定'
                  onChange={(e) => deleteMemoryText.current = e.target.value}
                />
                <div className='flex justify-between items-center gap-3'>
                  <Button 
                    block 
                    onClick={async () => {
                      if (deleteMemoryText.current === '删除所有记忆') {
                        await resetAllMemory()
                        messageApi?.success('已重置所有记忆')
                      } else {
                        messageApi?.error('输入错误')
                      }
                      setOpenDeleteMemory(false)
                    }}
                  >
                    确定
                  </Button>
                  <Button 
                    block 
                    type='primary'
                    onClick={() => setOpenDeleteMemory(false)}
                  >
                    取消
                  </Button>
                </div>
              </>}
            >
              <Button 
                block 
                danger
                icon={<DeleteOutlined />}
              >
                重置所有记忆
              </Button>
            </Popover>
          </div>
        </Form.Item>
      </Form>
    </section>
  )
}
