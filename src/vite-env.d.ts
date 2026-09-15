/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BRIDGE_DEBUG: string
  /** OZ 리포트 html5viewer 폴더 URL(끝 슬래시 포함). 비면 뷰어 자리 화면. */
  readonly VITE_OZ_VIEWER_URL: string
  /** OZ 리포트 서버 서블릿 URL. */
  readonly VITE_OZ_SERVLET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
