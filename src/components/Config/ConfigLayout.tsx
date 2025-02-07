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
    setBackground, 
    isFullScreen,
    setIsFullScreen,
  } = useLive2dApi()
  const { 
    messageApi,
  } = useStates()

  return (
    <div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
      <Form layout='vertical'>
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
          <div className='flex justify-between flex-col items-center gap-4'>
            <Upload.Dragger
              showUploadList={false}
              className='w-full'
              accept='.jpg,.jpeg,.png'
              beforeUpload={async (file) => {
                try {
                  const base64 = toBase64(await file.arrayBuffer())
                  await setBackground(`data:${file.type};base64,${base64}`)
                  messageApi?.success('背景设置成功')
                } catch (e) {
                  messageApi?.error(`背景设置失败: ${e instanceof Error ? e.message : e}`)
                }
                return false
              }}
            >
              <Button
                type='text'
                block
                icon={<FileImageOutlined />}
              >
                上传背景
              </Button>
              <p className='text-xs mt-[0.3rem]'>可点击上传或直接拖拽文件到此处</p>
            </Upload.Dragger>
            <Button 
              className='w-full' 
              block
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
        <Form.Item label='背景图片显示区域'>
          <Select 
            options={[
              { label: '全屏', value: true },
              { label: '模型区域', value: false },
            ]}
            defaultValue={isFullScreen}
            onChange={async (value) => { 
              await setIsFullScreen(value)
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
