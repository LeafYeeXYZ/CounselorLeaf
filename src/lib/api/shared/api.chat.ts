import 'openai/shims/web'
import OpenAI from 'openai'
import { env } from '../../env.ts'

const client = new OpenAI({
  baseURL: env.VITE_OPENAI_ENDPOINT,
  apiKey: env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export const chatApiList: ChatApiList = [{
  name: env.VITE_MODEL_LABEL_NAME || `Ollama - ${env.VITE_OPENAI_MODEL_NAME}`,
  api: client,
  test: async () => {
    const { data } = await client.models.list().catch((err) => {
      if (err.message === 'Connection error.') {
        throw new Error('推理模型未启动')
      } else {
        throw err
      }
    })
    if (data.every(({ id }) => id !== env.VITE_OPENAI_MODEL_NAME)) {
      throw new Error(`当前服务缺少模型 ${env.VITE_OPENAI_MODEL_NAME}`)
    }
    return true
  },
  maxToken: env.VITE_OPENAI_MAX_TOKENS,
}]
