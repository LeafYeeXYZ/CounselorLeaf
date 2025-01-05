import { useMemory } from '../../lib/hooks/useMemory.ts'
import { Collapse, Tag } from 'antd'
import { getTime } from '../../lib/utils.ts'

export function MemoryDiary() {

  const { 
    longTermMemory,
  } = useMemory()

  return (
    <div className='w-full max-h-[calc(100dvh-9.6rem)] border border-blue-900 rounded-md overflow-auto transition-all'>
      <Collapse
        className='border-none'
        size='small'
        items={longTermMemory?.length !== 0 ? longTermMemory.map((item) => {
          return {
            key: item.uuid,
            label: item.title,
            children: (
              <div className='w-full flex flex-col gap-2'>
                <div>{item.summary}</div>
                <div>开始时间:<Tag className='mx-1'>{getTime(item.startTime)}</Tag></div>
                <div>结束时间:<Tag className='mx-1'>{getTime(item.endTime)}</Tag></div>
              </div>
            ),
          }
        }) : [{ key: 'none', label: '没有记忆', children: <div></div> }]}
      />
    </div>
  )
}
