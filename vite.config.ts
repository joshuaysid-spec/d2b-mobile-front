import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

// frontend-architecture.md §16.2 — path alias '@/' → src/
//
// 코드 스플리팅 정책 (대형 프로젝트 — 라우트별 lazy + vendor 분리):
//   1) 라우트 페이지: src/router.tsx 에서 React.lazy() 로 분리 (페이지별 chunk)
//   2) Vendor 청크: 아래 manualChunks 에서 의존성 라이브러리를 도메인별로 분리
//      - 캐시 효율 ↑ (앱 코드만 바뀌어도 vendor chunk 는 그대로)
//      - 첫 진입 시에도 병렬 다운로드 가능
//
// 폰트 self-host (폐쇄망 대응):
//   globals.css 가 @import 하는 npm 폰트 패키지(pretendard-gov · material-symbols)의 woff2 는
//   Vite 가 dist 로 자동 복사하지 못한다(빌드 경고 "didn't resolve at build time"). 그대로 배포하면
//   폐쇄망에서 폰트 404 → Pretendard 폴백·아이콘 텍스트 깨짐. 그래서 viteStaticCopy 로 node_modules
//   의 woff2 를 빌드된 CSS 가 기대하는 dist/assets/ 하위 경로로 직접 복사한다(상대 url 그대로 해석됨).
//   ※ 복사 대상 경로는 빌드 CSS 의 url() 상대경로 기준 — Pretendard=./woff2-dynamic-subset/*,
//     Material Symbols=./material-symbols-outlined.woff2 (둘 다 dist/assets/ 기준).
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      // ※ 이 플러그인은 src 디렉토리 구조를 보존하므로, 평탄 복사하려면 rename.stripBase:true 필수.
      //   (없으면 dist/assets/node_modules/... 처럼 원본 경로째 복사됨)
      targets: [
        {
          // Pretendard dynamic-subset 120개 woff2 (unicode-range 별 지연 로드)
          src: 'node_modules/pretendard-gov/dist/web/variable/woff2-dynamic-subset/*',
          dest: 'assets/woff2-dynamic-subset',
          rename: { stripBase: true },
        },
        {
          // Material Symbols Outlined 아이콘 가변폰트
          src: 'node_modules/material-symbols/material-symbols-outlined.woff2',
          dest: 'assets',
          rename: { stripBase: true },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      // docs/ 는 소스가 아니라 HMR 대상이 아니다. 특히 docs/spec 의 pptx 설계서가
      // PowerPoint 등으로 열려 잠기면(EBUSY) Vite 워처가 크래시(exit 1)하므로 감시 제외.
      // dist/ 는 빌드 산출물 — 감시하면 npm run build 때마다 dev 페이지가 전체 새로고침되어 튐.
      ignored: ['**/docs/**', '**/dist/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 코어 — 모든 페이지가 의존, 거의 안 바뀜 (캐시 최우선)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Radix primitives — Checkbox/RadioGroup/Select/Dialog/Accordion 등 다수 사용
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
          ],
          // 데이터·날짜 유틸 — 캘린더/리스트 페이지에서 공통 사용
          'vendor-data': ['@tanstack/react-query', 'axios', 'dayjs', 'zustand'],
          // 폼·검증 — 입력 폼이 있는 여러 화면 공통 (react-hook-form + zod)
          'vendor-form': ['react-hook-form', 'zod', '@hookform/resolvers'],
        },
      },
    },
    // 라우트별 lazy 가 안 된 큰 청크(예: ComponentGuidePage) 가 있을 수 있어 한도 약간 상향.
    chunkSizeWarningLimit: 600,
  },
})
