import { create } from 'zustand'
import { set, get, listenApiList } from '../utils.ts'

type API = {
  listen: ListenApi | null
  testListen: ListenApiTest | null
  listenApiList: string[]
  currentListenApi: string
  setListenApi: (name: string) => Promise<void>
}

const localListenApi = await get('default_listen_api')
const defaultListenApi = listenApiList.find(({ name }) => name === localListenApi) ?? listenApiList[0]

export const useListenApi = create<API>()((setState) => ({
  listen: defaultListenApi.api,
  testListen: defaultListenApi.test,
  listenApiList: listenApiList.map(({ name }) => name),
  currentListenApi: defaultListenApi.name,
  setListenApi: async (name) => {
    const item = listenApiList.find(api => api.name === name)
    if (item) {
      setState({ listen: item.api, currentListenApi: name, testListen: item.test })
      await set('default_listen_api', name)
    }
    return
  },
}))
