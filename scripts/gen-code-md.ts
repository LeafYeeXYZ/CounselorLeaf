/**
 * 把项目 src 目录下的所有 .ts/.tsx 文件的代码  
 * 集中到一个 markdown 文件中  
 * 以供软件制作权申请材料使用  
 */

import fs from 'node:fs/promises'
import { resolve } from 'node:path'

const FILE_TYPES = ['.ts', '.tsx', '.css', '.rs', '.py']
const CODE_PATHS = [
  resolve(import.meta.dirname, '../src'),
  resolve(import.meta.dirname, '../server'),
  resolve(import.meta.dirname, '../src-tauri/src'),
]
const OUTPUT_PATH = resolve(import.meta.dirname, 'code.md')

let code: string[] = []

console.time('Generate code markdown file done')

for (const path of CODE_PATHS) {
  const files = (await fs.readdir(path, { recursive: true })).filter(file => FILE_TYPES.some(type => file.endsWith(type)))
  const codes = await Promise.all(files.map(async file => {
    const content = await fs.readFile(resolve(path, file), 'utf-8')
    return `---------- 代码路径: ${file} ----------\n\n${content}`
  }))
  code = code.concat(codes)
}

await fs.writeFile(OUTPUT_PATH, `\`\`\`\n${code.join('\n\n')}\n\`\`\``)

console.timeEnd('Generate code markdown file done')
