export const env: Env = {
  VITE_OPENAI_ENDPOINT: import.meta.env.VITE_OPENAI_ENDPOINT ?
    String(import.meta.env.VITE_OPENAI_ENDPOINT) :
    'http://localhost:11434/v1/',
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ?
    String(import.meta.env.VITE_OPENAI_API_KEY) :
    'ollama',
  VITE_OPENAI_MODEL_NAME: import.meta.env.VITE_OPENAI_MODEL_NAME ?
    String(import.meta.env.VITE_OPENAI_MODEL_NAME) :
    'qwen2.5:7b',
  VITE_MODEL_MAX_TOKENS: import.meta.env.VITE_MODEL_MAX_TOKENS ?
    Number(import.meta.env.VITE_MODEL_MAX_TOKENS) :
    100_000,
  VITE_MODEL_LABEL_NAME: import.meta.env.VITE_MODEL_LABEL_NAME ?
    String(import.meta.env.VITE_MODEL_LABEL_NAME) :
    '',
  VITE_F5_TTS_SERVER_URL: import.meta.env.VITE_F5_TTS_SERVER_URL ?
    String(import.meta.env.VITE_F5_TTS_SERVER_URL) :
    'http://127.0.0.1:5010/api',
  VITE_FISH_SPEECH_SERVER_URL: import.meta.env.VITE_FISH_SPEECH_SERVER_URL ?
    String(import.meta.env.VITE_FISH_SPEECH_SERVER_URL) :
    'http://127.0.0.1:8080',
  VITE_DEBUG_COMPONENT: import.meta.env.VITE_DEBUG_COMPONENT === 'on',
}
