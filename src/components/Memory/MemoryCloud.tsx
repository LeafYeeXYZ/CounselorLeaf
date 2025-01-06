import { useStates } from '../../lib/hooks/useStates.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { Form, Button, Input, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'

export function MemoryCloud() {

  const { 
    importAllMemory,
    exportAllMemory,
  } = useMemory()
  const { 
    messageApi,
    disabled,
    setDisabled,
  } = useStates()
  const {
    cloudflareAccountId,
    cloudflareApiToken,
    cloudflareKVNamespaceId,
    uploadToCloudflareKV,
    getFromCloudflareKV,
    setCloudflareApiToken,
    setCloudflareAccountId,
    setCloudflareKVNamespaceId,
  } = usePlugins()

  const [form] = Form.useForm()
  const [cloudflareAccountIdModified, setCloudflareAccountIdModified] = useState(false)
  const [cloudflareApiTokenModified, setCloudflareApiTokenModified] = useState(false)
  const [cloudflareKVNamespaceIdModified, setCloudflareKVNamespaceIdModified] = useState(false)

  return (
    <Form 
      form={form}
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-9.6rem)]'
      initialValues={{
        cloudflareAccountId,
        cloudflareApiToken,
        cloudflareKVNamespaceId,
      }}
    >
      <Form.Item label='Cloudflare Account ID'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setCloudflareAccountId()
                setCloudflareAccountIdModified(false)
                form.setFieldsValue({ cloudflareAccountId: '' })
                messageApi?.success('Cloudflare Account ID 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='cloudflareAccountId'>
            <Input.Password className='w-full' onChange={() => setCloudflareAccountIdModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={cloudflareAccountIdModified ? 'primary' : 'default'}
              onClick={async () => {
                const accountId = form.getFieldValue('cloudflareAccountId')
                await setCloudflareAccountId(accountId || '')
                setCloudflareAccountIdModified(false)
                messageApi?.success('Cloudflare Account ID 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='Cloudflare API Token'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setCloudflareApiToken()
                setCloudflareApiTokenModified(false)
                form.setFieldsValue({ cloudflareApiToken: '' })
                messageApi?.success('Cloudflare API Token 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='cloudflareApiToken'>
            <Input.Password className='w-full' onChange={() => setCloudflareApiTokenModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={cloudflareApiTokenModified ? 'primary' : 'default'}
              onClick={async () => {
                const apiToken = form.getFieldValue('cloudflareApiToken')
                await setCloudflareApiToken(apiToken || '')
                setCloudflareApiTokenModified(false)
                messageApi?.success('Cloudflare API Token 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='Cloudflare KV Namespace ID'>
        <Space.Compact block>
          <Tooltip title='清除已保存的值' color='blue'>
            <Button 
              icon={<DeleteOutlined />}
              onClick={async () => {
                await setCloudflareKVNamespaceId()
                setCloudflareKVNamespaceIdModified(false)
                form.setFieldsValue({ cloudflareKVNamespaceId: '' })
                messageApi?.success('Cloudflare KV Namespace ID 已清除')
              }}
            />
          </Tooltip>
          <Form.Item noStyle name='cloudflareKVNamespaceId'>
            <Input.Password className='w-full' onChange={() => setCloudflareKVNamespaceIdModified(true)} />
          </Form.Item>
          <Tooltip title='保存修改' color='blue'>
            <Button
              type={cloudflareKVNamespaceIdModified ? 'primary' : 'default'}
              onClick={async () => {
                const namespaceId = form.getFieldValue('cloudflareKVNamespaceId')
                await setCloudflareKVNamespaceId(namespaceId || '')
                setCloudflareKVNamespaceIdModified(false)
                messageApi?.success('Cloudflare KV Namespace ID 已更新')
              }}
              icon={<SaveOutlined />}
            />
          </Tooltip>
        </Space.Compact>
      </Form.Item>
      <Form.Item>
        <div className='flex justify-between items-center gap-4'>
          <Button 
            block
            disabled={!cloudflareAccountId || !cloudflareApiToken || !cloudflareKVNamespaceId || disabled !== false}
            loading={disabled === '上传记忆中'}
            onClick={async () => {
              try {
                flushSync(() => setDisabled('上传记忆中'))
                const memory = await exportAllMemory()
                await uploadToCloudflareKV('memory', memory)
                messageApi?.success('记忆已上传至 Cloudflare KV 数据库')
              } catch (e) {
                messageApi?.error(`记忆上传失败: ${e instanceof Error ? e.message : e}`)
              } finally {
                setDisabled(false)
              }
            }}
          >
            导出并上传记忆
          </Button>
          <Button 
            block
            disabled={!cloudflareAccountId || !cloudflareApiToken || !cloudflareKVNamespaceId || disabled !== false}
            loading={disabled === '下载记忆中'}
            onClick={async () => {
              try {
                flushSync(() => setDisabled('下载记忆中'))
                const memory = await getFromCloudflareKV('memory')
                await importAllMemory(memory || '')
                messageApi?.success('已从 Cloudflare KV 下载并导入记忆')
              } catch (e) {
                messageApi?.error(`记忆下载失败: ${e instanceof Error ? e.message : e}`)
              } finally {
                setDisabled(false)
              }
            }}
          >
            下载并导入记忆
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
