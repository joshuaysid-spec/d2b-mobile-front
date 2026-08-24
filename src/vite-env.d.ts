/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** B서버(2원화) 주소 — 미설정 시 전 요청이 VITE_API_BASE_URL(A서버)로 감. */
  readonly VITE_API_BASE_URL_B?: string
  readonly VITE_BRIDGE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
