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

function _speak_f5tts(text: string, isTest: true): Promise<boolean>
function _speak_f5tts(text: string, isTest: false): Promise<void>
async function _speak_f5tts(text: string, isTest: boolean): Promise<boolean | void> {
  try {
    const url = 'http://127.0.0.1:5010/api'
    const refText: string = await (await fetch('/tts/luoshaoye.txt')).text()
    const refAudio: Uint8Array = new Uint8Array(await (await fetch('/tts/luoshaoye.wav')).arrayBuffer())
    const formData = new FormData()
    formData.append('ref_text', refText)
    formData.append('gen_text', text)
    formData.append('model', 'f5-tts')
    formData.append('audio', new Blob([refAudio], { type: 'audio/wav' }))
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`)
    }
    if (isTest) {
      return
    }
    const audio = new Uint8Array(await res.arrayBuffer())
    const blob = new Blob([audio], { type: 'audio/wav' })
    const audioUrl = URL.createObjectURL(blob)
    const audioElement = new Audio(audioUrl)
    audioElement.play()
    return new Promise<void>(resolve => {
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
    })
  } catch (e) {
    throw new Error(`F5 TTS API 错误: ${e instanceof Error ? e.message : e}`)
  }
}
const speak_f5tts: SpeakApi = async (text: string) => {
  return _speak_f5tts(text, false)
}
const test_f5tts: SpeakApiTest = async () => {
  return _speak_f5tts('你好', true)
}

export const speakApiList: SpeakApiList = [
  { name: '关闭', api: null, test: null },
  { name: 'Web Speech API', api: speak_browser, test: test_browser },
  { name: 'F5 TTS API', api: speak_f5tts, test: test_f5tts },
]
