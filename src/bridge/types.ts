// frontend-architecture.md §6.2 — 네이티브 통신 메시지 타입

export type NativeOS = 'ios' | 'android' | 'web'

export interface BridgeMessage<T = unknown> {
  handler: string
  action: string
  payload?: T
}
