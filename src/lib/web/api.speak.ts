export type SpeakApi = (
  text: string
) => Promise<void>

export { speakApiList } from '../tauri/api.speak.ts'
