import type { ListResponse } from 'ollama'
import { Ollama } from 'ollama/browser'
import { env } from '../../env.ts'

const ollama = new Ollama({ host: env.VITE_OLLAMA_SERVER_URL })

const chat_ollama: ChatApi = ollama
const test_ollama: ChatApiTest = async () => {
  const { models } = await ollama.list().catch((err) => {
    if (err.message === 'Load failed') {
      throw new Error('Ollama 服务未启动')
    } else {
      throw err
    }
  }) as ListResponse
  if (models.every(({ name }) => name !== env.VITE_OLLAMA_MODEL_NAME)) {
    throw new Error(`Ollama 缺少模型 ${env.VITE_OLLAMA_MODEL_NAME}`)
  }
  return true
}
export const chatApiList: ChatApiList = [
  { 
    name: env.VITE_OLLAMA_LABEL_NAME || `Ollama - ${env.VITE_OLLAMA_MODEL_NAME}`,
    api: chat_ollama, 
    test: test_ollama,
    maxToken: env.VITE_OLLAMA_MAX_TOKENS,
  },
]
