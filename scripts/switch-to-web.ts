import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'

const path = resolve(__dirname ?? import.meta.dirname, '../src/lib/utils.ts')
const content = await fs.readFile(path, 'utf-8')
await fs.writeFile(path, content.replace(/\.\/api\/tauri\/api\./g, './api/web/api.'))
