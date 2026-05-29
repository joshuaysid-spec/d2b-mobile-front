import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// frontend-architecture.md §16.2 — path alias '@/' → src/
//
// 코드 스플리팅 정책 (대형 프로젝트 — 라우트별 lazy + vendor 분리):
//   1) 라우트 페이지: src/router.tsx 에서 React.lazy() 로 분리 (페이지별 chunk)
//   2) Vendor 청크: 아래 manualChunks 에서 의존성 라이브러리를 도메인별로 분리
//      - 캐시 효율 ↑ (앱 코드만 바뀌어도 vendor chunk 는 그대로)
//      - 첫 진입 시에도 병렬 다운로드 가능
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 코어 — 모든 페이지가 의존, 거의 안 바뀜 (캐시 최우선)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI + Emotion — Icon 컴포넌트가 끌어오는 무거운 의존성. 한 번 받으면 캐시.
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          // Radix primitives — Checkbox/RadioGroup/Select/Dialog/Accordion 등 다수 사용
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
          ],
          // 데이터·날짜 유틸 — 캘린더/리스트 페이지에서 공통 사용
          'vendor-data': ['@tanstack/react-query', 'axios', 'dayjs', 'zustand'],
        },
      },
    },
    // 라우트별 lazy 가 안 된 큰 청크(예: ComponentGuidePage) 가 있을 수 있어 한도 약간 상향.
    chunkSizeWarningLimit: 600,
  },
})
