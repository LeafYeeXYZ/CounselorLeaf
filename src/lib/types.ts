export type SpeakApi = (
  text: string
) => Promise<void>

export type ChatApi = (
  messages: { role: string, content: string }[],
) => Promise<AsyncGenerator<{ response: string, done: boolean }, void, void>>

export type LoadLive2d = (
  element: HTMLElement,
) => Live2dApi

export type Live2dApi = {
  stop: () => void
  say: (text: string) => void
  remove: () => void
}

export type Chat = {
  uuid: string
  title: string
  messages: { role: string, content: string }[]
}

export type LoadChat = () => Promise<Chat[]>
export type SaveChat = (chat: Chat) => Promise<void>
export type DeleteChat = (uuid: string) => Promise<void>
