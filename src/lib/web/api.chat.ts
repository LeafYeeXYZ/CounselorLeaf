import { env } from '../env.ts'
import { pipeline, type TextGenerationPipeline } from '@huggingface/transformers'

const chat_web: ChatApi = async function* (messages) {
  const response = await fetch(env.VITE_WEB_SERVER_URL + '/being/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })
  const json = await response.json()
  if (!json.success) {
    throw new Error('API 请求失败')
  }
  const data = json.result.response as string
  let done = false
  for (let i = 0; i < data.length; i++) {
    const response = data[i]
    if (i === data.length - 1) {
      done = true
    }
    if (done) {
      yield { response, done }
    } else {
      yield { response, done }
    }
  }
}
const test_web: ChatApiTest = async () => {
  try {
    const response = await fetch(env.VITE_WEB_SERVER_URL + '/being/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg: 'ping' }),
    })
    const json = await response.json()
    if (json?.msg !== 'pong') {
      throw new Error('服务器返回错误')
    }
    return true
  } catch (e) {
    throw new Error(`Cloudflare API 测试失败: ${e instanceof Error ? e.message : e}`)
  }
}

let pipe: TextGenerationPipeline | null = null
const chat_wasm: ChatApi = async function* (messages) {
  if (!pipe) {
    throw new Error('Transformers.js 未初始化')
  }
  const response = await pipe(messages, { max_length: env.VITE_WASM_MAX_TOKENS })
  // @ts-expect-error Transformers.js 的类型定义问题
  const result = response[0].generated_text
  const text = result[result.length - 1].content
  for (let i = 0; i < text.length; i++) {
    const response = text[i]
    yield { response, done: i === text.length - 1 }
  }
}
const test_wasm: ChatApiTest = async () => {
  try {
    if (pipe) {
      return true
    }
    if (env.VITE_USE_WEB_GPU) {
      pipe = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', { device: 'webgpu' })
    } else {
      pipe = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct')
    }
    return true
  } catch (e) {
    throw new Error(`Transformers.js 初始化失败: ${e instanceof Error ? e.message : e}`)
  }
}

export const chatApiList: ChatApiList = [
  { 
    name: 'Cloudflare AI - qwen1.5:14b', 
    api: chat_web, 
    test: test_web, 
    maxToken: env.VITE_WEB_MAX_TOKENS,
  },
  {
    name: 'Transformers.js - qwen2.5:0.5b',
    api: chat_wasm,
    test: test_wasm,
    maxToken: env.VITE_WASM_MAX_TOKENS,
  }
]
