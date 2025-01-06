import { create } from 'zustand'
import { set, get, getWeather } from '../utils.ts'

type API = { 
  setQWeatherApiKey: (apiKey?: string) => Promise<void>
  testQWeatherApiKey: () => Promise<boolean>

  uploadToCloudflareKV: (key: string, value: string) => Promise<void>
  getFromCloudflareKV: (key: string) => Promise<string | null>
  setCloudflareApiToken: (apiToken?: string) => Promise<void>
  setCloudflareAccountId: (accountId?: string) => Promise<void>
  setCloudflareKVNamespaceId: (namespaceId?: string) => Promise<void>
} & Plugins

const qWeatherApiKey = await get('qweather_api_key') || ''
const cloudflareApiToken = await get('cloudflare_api_token') || ''
const cloudflareAccountId = await get('cloudflare_account_id') || ''
const cloudflareKVNamespaceId = await get('cloudflare_kv_namespace_id') || ''

export const usePlugins = create<API>()((setState, getState) => ({
  uploadToCloudflareKV: async (key, value) => {
    const { cloudflareApiToken, cloudflareAccountId, cloudflareKVNamespaceId } = getState()
    if (!cloudflareApiToken || !cloudflareAccountId || !cloudflareKVNamespaceId) {
      throw new Error('请先设置 Cloudflare 相关 API 凭证')
    }
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKVNamespaceId}/values/${key}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    return
  },
  getFromCloudflareKV: async (key) => {
    const { cloudflareApiToken, cloudflareAccountId, cloudflareKVNamespaceId } = getState()
    if (!cloudflareApiToken || !cloudflareAccountId || !cloudflareKVNamespaceId) {
      throw new Error('请先设置 Cloudflare 相关 API 凭证')
    }
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKVNamespaceId}/values/${key}`, {
      headers: {
        'Authorization': `Bearer ${cloudflareApiToken}`,
      },
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const { result } = await response.json()
    return result
  },
  cloudflareApiToken,
  cloudflareAccountId,
  cloudflareKVNamespaceId,
  setCloudflareApiToken: async (apiToken) => {
    setState({ cloudflareApiToken: apiToken || '' })
    await set('cloudflare_api_token', apiToken || '')
    return
  },
  setCloudflareAccountId: async (accountId) => {
    setState({ cloudflareAccountId: accountId || '' })
    await set('cloudflare_account_id', accountId || '')
    return
  },
  setCloudflareKVNamespaceId: async (namespaceId) => {
    setState({ cloudflareKVNamespaceId: namespaceId || '' })
    await set('cloudflare_kv_namespace_id', namespaceId || '')
    return
  },
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
