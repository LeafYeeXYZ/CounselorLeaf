import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'

export type SpeakApi = (
  text: string
) => Promise<void>

export type ChatApi = (
  messages: { role: string, content: string }[],
) => Promise<AsyncGenerator<{ response: string, done: boolean }, void, void>>

export type LoadLive2d = (
  element: HTMLElement,
) => Oml2dMethods & Oml2dEvents & Oml2dProperties

export type Chat = {
  uuid: string
  title: string
  messages: { role: string, content: string }[]
}

export type LoadChat = () => Promise<Chat[]>
export type SaveChat = (chat: Chat) => Promise<void>
export type DeleteChat = (uuid: string) => Promise<void>
