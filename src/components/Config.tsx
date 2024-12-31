import { useApi } from '../lib/hooks/useApi.ts'
import { useStates } from '../lib/hooks/useStates.ts'
import { toBase64 } from '../lib/utils.ts'
import { Form, Select, Upload, Button } from 'antd'
import { FileImageOutlined, UndoOutlined } from '@ant-design/icons'

export function Config() {

  const { 
    setSpeakApi, 
    setChatApi, 
    setLoadLive2d,
    setListenApi,
    speakApiList,
    chatApiList,
    live2dList,
    listenApiList,
    currentSpeakApi,
    currentChatApi,
    currentLive2d,
    currentListenApi,
  } = useApi()
  const { setBackground, messageApi } = useStates()

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Form 
        layout='vertical' 
        className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-10.25rem)]'
      >
        <Form.Item label='语音合成服务'>
          <Select 
            options={speakApiList.map((name) => ({ label: name, value: name }))}
            value={currentSpeakApi}
            onChange={async (value) => { 
              await setSpeakApi(value)
            }}
          />
        </Form.Item>
        <Form.Item label='对话生成服务'>
          <Select 
            options={chatApiList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentChatApi}
            onChange={async (value) => { 
              await setChatApi(value)
            }}
          />
        </Form.Item>
        <Form.Item label='语音识别服务'>
          <Select 
            options={listenApiList.map((name) => ({ label: name, value: name }))}
            defaultValue={currentListenApi}
            onChange={async (value) => { 
              await setListenApi(value)
            }}
          />
        </Form.Item>
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
                setBackground(`data:${file.type};base64,${base64}`)
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
              onClick={() => {
                setBackground()
                messageApi?.success('已恢复默认背景')
              }}
            >
              恢复默认背景
            </Button>
          </div>
        </Form.Item>
      </Form>
    </section>
  )
}
