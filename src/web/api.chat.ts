export type ChatApi = (
  messages: { role: string, content: string }[],
) => Promise<AsyncGenerator<{ response: string, done: boolean }, void, void>>
export type ChatApiTest = () => Promise<boolean>

const URL = import.meta.env.VITE_WEB_SERVER_URL ?? ''
const chat_web = async function* (messages: { role: string, content: string }[]) {
  const response = await fetch(URL + '/being/chat', {
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
    yield { response, done }
  }
}
const test_web: ChatApiTest = async () => {
  const response = await fetch(URL + '/being/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ msg: 'ping' }),
  })
  const json = await response.json()
  if (json?.msg !== 'pong') {
    throw new Error('API 测试失败')
  }
  return true
}

export const chatApiList: { name: string, api: ChatApi, test: ChatApiTest }[] = [
  { 
    name: 'Cloudflare AI - qwen1.5:14b',
    api: (messages) => Promise.resolve(chat_web(messages)),
    test: test_web,
  },
]
