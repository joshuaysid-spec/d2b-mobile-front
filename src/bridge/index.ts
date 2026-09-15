import { camera } from './handlers/camera'
import { auth } from './handlers/auth'
import { push } from './handlers/push'
import { storage } from './handlers/storage'
import { navigation } from './handlers/navigation'

// frontend-architecture.md §6.2 — 통합 export
// 컴포넌트에서 `import { bridge } from '@/bridge'` 로 사용.
export const bridge = { camera, auth, push, storage, navigation }

export { detectOS, isNativeApp } from './native'
export type { BridgeMessage, NativeOS } from './types'
