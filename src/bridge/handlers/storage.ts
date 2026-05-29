import { postToNative } from '../native'

// frontend-architecture.md §6.2 — 네이티브 보안저장소(Keychain/Keystore) 접근
export const storage = {
  set(key: string, value: string): void {
    postToNative({ handler: 'storage', action: 'set', payload: { key, value } })
  },
  get(key: string): void {
    postToNative({ handler: 'storage', action: 'get', payload: { key } })
  },
}
