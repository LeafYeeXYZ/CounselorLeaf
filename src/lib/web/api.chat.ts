const url: string = import.meta.env.VITE_WEB_SERVER_URL ?? ''
const token: string = import.meta.env.VITE_WEB_MAX_TOKENS ?? '1000'
const chat_web = async function* (messages: { role: string, content: string }[]) {
  const response = await fetch(url + '/being/chat', {
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
  const response = await fetch(url + '/being/test', {
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

export const chatApiList: ChatApiList = [
  { 
    name: 'Cloudflare AI - qwen1.5:14b', 
    api: chat_web, 
    test: test_web, 
    maxToken: parseInt(token),
  },
]
