import { useStates } from '../lib/hooks/useStates.ts'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { Form, Button, Input, Space } from 'antd'

export function MemoryMain() {

  const { 
    userName,
    selfName,
    setUserName,
    setSelfName,
    memoryAboutSelf,
    memoryAboutUser,
  } = useMemory()
  const { messageApi } = useStates()

  const [form] = Form.useForm()

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-16rem)]'
      initialValues={{
        userName,
        selfName,
      }}
    >
      <Form.Item label='你和他的名字'>
        <Space.Compact block>
          <Form.Item noStyle name='userName'>
            <Input 
              addonBefore='你叫'
              placeholder='请输入'
            />
          </Form.Item>
          <Form.Item noStyle name='selfName'>
            <Input 
              addonBefore='他叫'
              placeholder='请输入'
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
      <Form.Item label='他的关于自己的记忆'>
        <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
          {memoryAboutSelf || '没有记忆'}
        </div>
      </Form.Item>
      <Form.Item label='他的关于你的记忆'>
        <div className='w-full max-h-32 overflow-auto border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
          {memoryAboutUser || '没有记忆'}
        </div>
      </Form.Item>
    </Form>
  )
}
