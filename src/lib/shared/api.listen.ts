// @ts-expect-error TS 无法识别 Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const listen_browser: ListenApi = (callback) => {
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = true
  recognition.continuous = true
  const { promise, resolve, reject } = Promise.withResolvers<string>()
  let text = ''
  // @ts-expect-error TS 无法识别 Web Speech API
  recognition.onresult = (event) => {
    text = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript
    }
    typeof callback === 'function' && callback(text)
  }
  recognition.onend = () => {
    resolve(text)
  }
  // @ts-expect-error TS 无法识别 Web Speech API
  recognition.onerror = (event) => {
    reject(event?.message ?? event?.error ?? event)
  }
  return {
    result: promise,
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  }
}
const test_browser: ListenApiTest = async () => {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    return true
  } else {
    throw new Error('Web Speech API 不可用')
  }
}

export const listenApiList: ListenApiList = [
  { name: '关闭', api: null, test: null },
  { name: 'Web Speech API', api: listen_browser, test: test_browser },
]
