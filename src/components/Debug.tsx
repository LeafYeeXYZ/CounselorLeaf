import { useMemory } from '../lib/hooks/useMemory.ts'
import { useStates } from '../lib/hooks/useStates.ts'
import { Popover, Button } from 'antd'

export function Debug() {

  const { currentSummary, resetAllMemory } = useMemory()
  const { messageApi } = useStates()

  return (
    <Popover
      trigger={['hover', 'click']}
      title='调试信息'
      content={<div className='flex flex-col items-center justify-center gap-2 text-sm'>
        <div>当前摘要: {currentSummary}</div>
        <Button
          block
          danger
          onClick={async () => {
            await resetAllMemory()
            messageApi?.success('已重置记忆')
          }}
        >
          重置记忆
        </Button>
      </div>}
    >
      <div className='fixed w-8 h-8 rounded-full border border-yellow-500 bg-yellow-50 top-2 right-2 opacity-50 hover:opacity-100 transition-opacity' />
    </Popover>
  )
}