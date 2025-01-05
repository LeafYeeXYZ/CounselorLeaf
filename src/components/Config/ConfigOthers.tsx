import { useStates } from '../../lib/hooks/useStates.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { Form, Input } from 'antd'

export function ConfigOthers() {

  const { 
    qWeatherApiKey,
    setQWeatherApiKey,
  } = useStates()
  const {
    selfName,
  } = useMemory()

  return (
    <Form 
      layout='vertical' 
      className='w-full border border-blue-900 rounded-md p-5 pb-1 overflow-auto max-h-[calc(100dvh-9.6rem)]'
    >
      <Form.Item label='和风天气 API Key'>
        <Input
          placeholder={`设置后, ${selfName}将联网获取当前位置的天气信息`}
          value={qWeatherApiKey}
          onChange={async (e) => await setQWeatherApiKey(e.target.value || '')}
        />
      </Form.Item>
    </Form>
  )
}
