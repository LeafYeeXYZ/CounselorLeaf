import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'

const PATH_TO_COPY_DURING_BUILD = ['rabbit-boy', 'evil-boy']

const path = resolve(__dirname ?? import.meta.dirname, '../src/lib/useApi.ts')
const content = await fs.readFile(path, 'utf-8')
await fs.writeFile(path, content
  .replace('./api.store.ts', '../web/api.store.ts')
  .replace('./api.live2d.ts', '../web/api.live2d.ts')
  .replace('./api.chat.ts', '../web/api.chat.ts')
)

await fs.mkdir(resolve(__dirname ?? import.meta.dirname, '../public-web'))
await fs.copyFile(resolve(__dirname ?? import.meta.dirname, '../public/favicon.ico'), resolve(__dirname ?? import.meta.dirname, '../public-web/favicon.ico'))
await fs.copyFile(resolve(__dirname ?? import.meta.dirname, '../public/avatar.jpg'), resolve(__dirname ?? import.meta.dirname, '../public-web/avatar.jpg'))
await fs.mkdir(resolve(__dirname ?? import.meta.dirname, '../public-web/live2d'))

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

for (const dir of PATH_TO_COPY_DURING_BUILD) {
  await copyDir(resolve(__dirname ?? import.meta.dirname, '../public/live2d', dir), resolve(__dirname ?? import.meta.dirname, '../public-web/live2d', dir))
}
