import { create } from 'zustand'
import { set, get, getWeather } from '../utils.ts'

type API = { 
  setQWeatherApiKey: (apiKey?: string) => Promise<void>
  testQWeatherApiKey: () => Promise<boolean>
} & Plugins

const qWeatherApiKey = await get('qweather_api_key') || ''

export const usePlugins = create<API>()((setState, getState) => ({
  qWeatherApiKey,
  testQWeatherApiKey: async () => {
    if (sessionStorage.getItem('qweather_tested') === 'pass') {
      return true
    }
    const { qWeatherApiKey } = getState()
    await getWeather(qWeatherApiKey)
    sessionStorage.setItem('qweather_tested', 'pass')
    return true
  },
  setQWeatherApiKey: async (apiKey) => {
    setState({ qWeatherApiKey: apiKey || '' })
    await set('qweather_api_key', apiKey || '')
    sessionStorage.removeItem('qweather_tested')
    return
  },
}))
