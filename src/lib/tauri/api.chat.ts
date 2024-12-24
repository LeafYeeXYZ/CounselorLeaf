import type { ListResponse } from 'ollama'
import ollama from 'ollama/browser'

const model: string = import.meta.env.VITE_OLLAMA_MODEL_NAME ?? 'qwen2.5:7b'
const token: string = import.meta.env.VITE_OLLAMA_MAX_TOKENS ?? '100000'
const chat_ollama: ChatApi = async function* (messages: { role: string, content: string }[]) {
  const response = await ollama.chat({
    model,
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
  if (models.every(({ name }) => name !== model)) {
    throw new Error(`Ollama 缺少模型 ${model}`)
  }
  return true
}
export const chatApiList: ChatApiList = [
  { 
    name: `Ollama - ${model}`, 
    api: chat_ollama, 
    test: test_ollama,
    maxToken: parseInt(token),
  },
]
