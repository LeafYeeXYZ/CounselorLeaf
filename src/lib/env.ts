export const env: Env = {
  VITE_MODEL_MAX_TOKENS: import.meta.env.VITE_MODEL_MAX_TOKENS ?
    Number(import.meta.env.VITE_MODEL_MAX_TOKENS) :
    100_000,
  VITE_F5_TTS_SERVER_URL: import.meta.env.VITE_F5_TTS_SERVER_URL ?
    String(import.meta.env.VITE_F5_TTS_SERVER_URL) :
    'http://127.0.0.1:5010/api',
  VITE_FISH_SPEECH_SERVER_URL: import.meta.env.VITE_FISH_SPEECH_SERVER_URL ?
    String(import.meta.env.VITE_FISH_SPEECH_SERVER_URL) :
    'http://127.0.0.1:8080',
  VITE_DEBUG_COMPONENT: import.meta.env.VITE_DEBUG_COMPONENT === 'on',
}
