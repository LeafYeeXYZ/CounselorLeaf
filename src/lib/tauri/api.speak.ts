let voices: SpeechSynthesisVoice[] = []
while (voices.length === 0) {
  await new Promise(resolve => setTimeout(resolve, 50))
  voices = speechSynthesis.getVoices()
}
const speak_browser: SpeakApi = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = voices.find(v => v.lang === 'zh-CN')
  if (voice) {
    utterance.voice = voice
  } else {
    throw new Error('No Chinese voice found')
  }
  utterance.pitch = 0.7 // 音高
  utterance.rate = 1.2 // 语速
  return new Promise<void>(resolve => {
    utterance.onend = () => resolve()
    speechSynthesis.speak(utterance)
  })
}
const test_browser: SpeakApiTest = async () => {
  return true
}

export const speakApiList: SpeakApiList = [
  { name: '关闭', api: null, test: null },
  { name: 'Web Speech API', api: speak_browser, test: test_browser },
]
