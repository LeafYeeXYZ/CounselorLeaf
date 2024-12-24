let voices: SpeechSynthesisVoice[] = []
while (voices.length === 0) {
  await new Promise(resolve => setTimeout(resolve, 50))
  voices = speechSynthesis.getVoices()
}

const WEB_SPEECH_API_VOICE = voices.find(v => v.lang === 'zh-CN' && v.name === 'Tingting') ?? voices.find(v => v.lang === 'zh-CN')
const WEB_SPEECH_API_PITCH = 0.85 // 音高
const WEB_SPEECH_API_RATE = 1.15 // 语速

const speak_browser: SpeakApi = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text)
  if (WEB_SPEECH_API_VOICE) {
    utterance.voice = WEB_SPEECH_API_VOICE
  } else {
    throw new Error('No Chinese voice found')
  }
  utterance.pitch = WEB_SPEECH_API_PITCH
  utterance.rate = WEB_SPEECH_API_RATE
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
