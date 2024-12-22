import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'

const PATH_TO_COPY_DURING_BUILD = ['rabbit-boy', 'evil-boy', 'dark-boy', 'gold-boy', 'jiniqi', 'hero-boy']
const path = resolve(__dirname ?? import.meta.dirname, '../src/lib/utils.ts')
const content = await fs.readFile(path, 'utf-8')
await fs.writeFile(path, content.replace(/\.\/tauri\/api\./g, './web/api.'))

const publicTauri = resolve(__dirname ?? import.meta.dirname, '../public')
const publicWeb = resolve(__dirname ?? import.meta.dirname, '../public-web')
await fs.rm(publicWeb, { recursive: true, force: true })
await fs.mkdir(publicWeb)
await fs.copyFile(resolve(publicTauri, './favicon.ico'), resolve(publicWeb, './favicon.ico'))
await fs.copyFile(resolve(publicTauri, './avatar.jpg'), resolve(publicWeb, './avatar.jpg'))
await fs.mkdir(resolve(publicWeb, './live2d'))

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
  await copyDir(resolve(publicTauri, './live2d', dir), resolve(publicWeb, './live2d', dir))
}
