export const env: Env = {
  VITE_OLLAMA_SERVER_URL: import.meta.env.VITE_OLLAMA_SERVER_URL ? 
    String(import.meta.env.VITE_OLLAMA_SERVER_URL) : 
    'http://127.0.0.1:11434',
  VITE_OLLAMA_MODEL_NAME: import.meta.env.VITE_OLLAMA_MODEL_NAME ?
    String(import.meta.env.VITE_OLLAMA_MODEL_NAME) :
    'qwen2.5:7b',
  VITE_OLLAMA_MAX_TOKENS: import.meta.env.VITE_OLLAMA_MAX_TOKENS ?
    Number(import.meta.env.VITE_OLLAMA_MAX_TOKENS) :
    100_000,
  VITE_F5_TTS_SERVER_URL: import.meta.env.VITE_F5_TTS_SERVER_URL ?
    String(import.meta.env.VITE_F5_TTS_SERVER_URL) :
    'http://127.0.0.1:5010/api',
  VITE_OLLAMA_LABEL_NAME: import.meta.env.VITE_OLLAMA_LABEL_NAME ?
    String(import.meta.env.VITE_OLLAMA_LABEL_NAME) :
    '',
  VITE_FISH_SPEECH_SERVER_URL: import.meta.env.VITE_FISH_SPEECH_SERVER_URL ?
    String(import.meta.env.VITE_FISH_SPEECH_SERVER_URL) :
    'http://127.0.0.1:8080',
}
