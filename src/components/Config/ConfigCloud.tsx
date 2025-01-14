import { useStates } from '../../lib/hooks/useStates.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { Form, Button, Input, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'

export function ConfigCloud() {

  const { 
    messageApi,
  } = useStates()
  const {
    s3Endpoint,
    s3AccessKey,
    s3SecretKey,
    s3BucketName,
    setS3Endpoint,
    setS3AccessKey,
    setS3SecretKey,
    setS3BucketName,
  } = usePlugins()

  const [form] = Form.useForm()
  const [s3EndpointModified, setS3EndpointModified] = useState(false)
  const [s3AccessKeyModified, setS3AccessKeyModified] = useState(false)
  const [s3SecretKeyModified, setS3SecretKeyModified] = useState(false)
  const [s3BucketNameModified, setS3BucketNameModified] = useState(false)

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full bg-white border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-full'
      initialValues={{
        s3Endpoint,
        s3AccessKey,
        s3SecretKey,
        s3BucketName,
      }}
    >
      <Form.Item label='S3 Endpoint'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setS3Endpoint()
                setS3EndpointModified(false)
                form.setFieldsValue({ s3Endpoint: '' })
                messageApi?.success('S3 Endpoint 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='s3Endpoint'>
            <Input className='w-full' onChange={() => setS3EndpointModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={s3EndpointModified ? 'primary' : 'default'}
              onClick={async () => {
                const endpoint = form.getFieldValue('s3Endpoint')
                await setS3Endpoint(endpoint || '')
                setS3EndpointModified(false)
                messageApi?.success('S3 Endpoint 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='S3 Access Key'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setS3AccessKey()
                setS3AccessKeyModified(false)
                form.setFieldsValue({ s3AccessKey: '' })
                messageApi?.success('S3 Access Key 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='s3AccessKey'>
            <Input.Password className='w-full' onChange={() => setS3AccessKeyModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={s3AccessKeyModified ? 'primary' : 'default'}
              onClick={async () => {
                const accessKey = form.getFieldValue('s3AccessKey')
                await setS3AccessKey(accessKey || '')
                setS3AccessKeyModified(false)
                messageApi?.success('S3 Access Key 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='S3 Secret Key'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setS3SecretKey()
                setS3SecretKeyModified(false)
                form.setFieldsValue({ s3SecretKey: '' })
                messageApi?.success('S3 Secret Key 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='s3SecretKey'>
            <Input.Password className='w-full' onChange={() => setS3SecretKeyModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={s3SecretKeyModified ? 'primary' : 'default'}
              onClick={async () => {
                const secretKey = form.getFieldValue('s3SecretKey')
                await setS3SecretKey(secretKey || '')
                setS3SecretKeyModified(false)
                messageApi?.success('S3 Secret Key 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='S3 Bucket Name'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setS3BucketName()
                setS3BucketNameModified(false)
                form.setFieldsValue({ s3BucketName: '' })
                messageApi?.success('S3 Bucket Name 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='s3BucketName'>
            <Input className='w-full' onChange={() => setS3BucketNameModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={s3BucketNameModified ? 'primary' : 'default'}
              onClick={async () => {
                const bucketName = form.getFieldValue('s3BucketName')
                await setS3BucketName(bucketName || '')
                setS3BucketNameModified(false)
                messageApi?.success('S3 Bucket Name 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
    </Form>
  )
}
