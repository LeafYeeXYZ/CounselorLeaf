import { useStates } from '../../lib/hooks/useStates.ts'
import { toBase64 } from '../../lib/utils.ts'
import { Form, Select, Upload, Button } from 'antd'
import { FileImageOutlined, UndoOutlined } from '@ant-design/icons'
import { useLive2dApi } from '../../lib/hooks/useLive2dApi.ts'

export function ConfigLayout() {

  const { 
    setLoadLive2d,
    live2dList,
    currentLive2d,
  } = useLive2dApi()
  const { 
    setBackground, 
    messageApi 
  } = useStates()

  return (
    <Form 
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-9.6rem)]'
    >
      <Form.Item label='聊天形象'>
        <Select 
          options={live2dList.map((name) => ({ label: name, value: name }))}
          defaultValue={currentLive2d}
          onChange={async (value) => { 
            await setLoadLive2d(value)
          }}
        />
      </Form.Item>
      <Form.Item label='背景图片'>
        <div className='flex justify-between flex-nowrap gap-3'>
          <Upload
            accept='.jpg,.jpeg,.png'
            showUploadList={false}
            beforeUpload={async (file) => {
              const base64 = toBase64(await file.arrayBuffer())
              await setBackground(`data:${file.type};base64,${base64}`)
              messageApi?.success('背景设置成功')
              return false
            }}
          >
            <Button icon={<FileImageOutlined />}>
              点击上传
            </Button>
          </Upload>
          <Button 
            className='w-full' 
            icon={<UndoOutlined />}
            onClick={async () => {
              await setBackground()
              messageApi?.success('已恢复默认背景')
            }}
          >
            恢复默认背景
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
