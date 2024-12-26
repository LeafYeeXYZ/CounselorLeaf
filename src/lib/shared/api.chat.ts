import type { ListResponse } from 'ollama'
import { Ollama } from 'ollama/browser'
import { env } from '../env.ts'

const ollama = new Ollama({ host: env.VITE_OLLAMA_SERVER_URL })

const chat_ollama: ChatApi = async function* (messages: { role: string, content: string }[]) {
  const response = await ollama.chat({
    model: env.VITE_OLLAMA_MODEL_NAME,
    messages,
    stream: true,
  })
  for await (const chunk of response) {
    if (chunk.done) {
      yield { response: chunk.message.content ?? '', done: true, token: chunk.prompt_eval_count + chunk.eval_count }
    } else {
      yield { response: chunk.message.content ?? '', done: false }
    }
  }
}
const test_ollama: ChatApiTest = async () => {
  const { models } = await ollama.list().catch((err) => {
    if (err.message === 'Load failed') {
      throw new Error('Ollama 服务未启动')
    }
  }) as ListResponse
  if (models.every(({ name }) => name !== env.VITE_OLLAMA_MODEL_NAME)) {
    throw new Error(`Ollama 缺少模型 ${env.VITE_OLLAMA_MODEL_NAME}`)
  }
  return true
}
export const chatApiList: ChatApiList = [
  { 
    name: `Ollama - ${env.VITE_OLLAMA_MODEL_NAME}`,
    api: chat_ollama, 
    test: test_ollama,
    maxToken: env.VITE_OLLAMA_MAX_TOKENS,
  },
]
