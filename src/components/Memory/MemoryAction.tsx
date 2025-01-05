import { useStates } from '../../lib/hooks/useStates.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { Form, Button, Popover, Input, Upload } from 'antd'
import { ExportOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'

export function MemoryAction() {

  const { 
    resetAllMemory,
    saveAllMemory,
    importAllMemory,
  } = useMemory()
  const { messageApi } = useStates()

  const [openDeleteMemory, setOpenDeleteMemory] = useState<boolean>(false)
  const deleteMemoryText = useRef<string>('')
  const [form] = Form.useForm()

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-9.6rem)]'
    >
      <Form.Item label='导出记忆'>
        <Button 
          block
          icon={<ExportOutlined />}
          onClick={async () => {
            await saveAllMemory().then((path) => messageApi?.success(`记忆已导出至 ${path}`)).catch(() => {})
          }}
        >
          导出记忆
        </Button>
      </Form.Item>
      <Form.Item label='导入记忆'>
        <Upload.Dragger
          showUploadList={false}
          accept='.json'
          beforeUpload={async (file) => {
            try {
              const json = await file.text()
              await importAllMemory(json)
              messageApi?.success('记忆导入成功')
            } catch (e) {
              messageApi?.error(`记忆导入失败: ${e instanceof Error ? e.message : e}`)
            }
            return false
          }}
        >
          <Button
            type='text'
            block
            icon={<ImportOutlined />}
          >
            导入记忆
          </Button>
          <p className='text-xs mt-[0.3rem]'>可点击上传或直接拖拽文件到此处</p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label='重置记忆'>
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
      </Form.Item>
    </Form>
  )
}
