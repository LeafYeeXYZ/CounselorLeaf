import { create } from 'zustand'
import { uuid } from './utils.ts'
import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'
import type { Chat } from './types.ts'

type GlobalState = {
  disabled: boolean
  setDisabled: (disabled: boolean) => void
  live2d: Oml2dEvents & Oml2dMethods & Oml2dProperties | null
  setLive2d: (live2d: Oml2dEvents & Oml2dMethods & Oml2dProperties | null) => void
  currentChat: Chat
  setCurrentChat: (currentChat: Chat) => void
  updateCurrentChat: (updater: (currentChat: Chat) => Chat) => void
}

export const useStates = create<GlobalState>()((set) => ({
  disabled: false,
  setDisabled: (disabled) => set({ disabled }),
  live2d: null,
  setLive2d: (live2d) => set({ live2d }),
  currentChat: { uuid: uuid(), title: '', messages: [] },
  setCurrentChat: (currentChat) => set({ currentChat }),
  updateCurrentChat: (updater) => set((state) => ({ currentChat: updater(state.currentChat) })),
}))
