import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'

const LIVE2D_TO_IGNORE = ['fox-boy', 'cat-boy']

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

const path = resolve(__dirname ?? import.meta.dirname, '../src/lib/utils.ts')
const content = await fs.readFile(path, 'utf-8')
await fs.writeFile(path, content.replace(/\.\/api\/tauri\/api\./g, './api/web/api.'))

const publicTauri = resolve(__dirname ?? import.meta.dirname, '../public')
const publicWeb = resolve(__dirname ?? import.meta.dirname, '../public-web')
await fs.rm(publicWeb, { recursive: true, force: true })
await copyDir(publicTauri, publicWeb)
for (const name of LIVE2D_TO_IGNORE) {
  await fs.rm(resolve(publicWeb, `live2d/${name}`), { recursive: true, force: true })
}
