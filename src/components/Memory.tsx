import { useState, type ReactNode } from 'react'
import { Segmented } from 'antd'
import { MemoryMain } from './MemoryMain.tsx'
import { MemoryDiary } from './MemoryDiary.tsx'
import { MemoryAction } from './MemoryAction.tsx'

const PAGES: { label: string, element: ReactNode, isDefault?: boolean }[] = [
  { label: '名字和自我', element: <MemoryMain />, isDefault: true },
  { label: '他的日记本', element: <MemoryDiary /> },
  { label: '导入和导出', element: <MemoryAction /> },
]

export function Memory() {

  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Segmented
        className='border border-blue-900 p-1 absolute top-[4.5rem]'
        defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
        options={PAGES.map(({ label }) => ({ label, value: label }))}
        onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
      />
      {page}
    </section>
  )
}
