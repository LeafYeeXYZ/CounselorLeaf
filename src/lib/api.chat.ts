import type { ListResponse } from 'ollama'
import ollama from 'ollama/browser'

export type ChatApi = (
  messages: { role: string, content: string }[],
) => Promise<AsyncGenerator<{ response: string, done: boolean }, void, void>>
export type ChatApiTest = () => Promise<boolean>

const model = 'qwen2.5:7b'
const chat_ollama = async function* (messages: { role: string, content: string }[]) {
  const response = await ollama.chat({
    model,
    messages,
    stream: true,
  })
  for await (const chunk of response) {
    if (chunk.done) {
      yield { response: chunk.message.content ?? '', done: true }
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

export const chatApiList: { name: string, api: ChatApi, test: ChatApiTest }[] = [
  { 
    name: 'Ollama - qwen2.5:7b', 
    api: (messages) => Promise.resolve(chat_ollama(messages)),
    test: test_ollama,
  },
]
