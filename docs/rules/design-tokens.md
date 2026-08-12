# 디자인 시스템 (KRDS 토큰 · Tailwind v4) · Figma

> CLAUDE.md 에서 분할된 상세 규칙. 토큰 추가 · 스타일 작업 · Figma 대조 시 반드시 먼저 읽는다.

## 디자인 시스템 (krds-design-system 기능)

- KRDS 디자인 토큰: `src/styles/tokens.css` — Primitive → Semantic CSS 변수. **색상/수치 하드코딩 금지.**
- 진입점은 `src/styles/globals.css` (main.tsx 가 import). 로드 순서: 폰트 → `tokens.css` → `tailwind.css`, 이어서 shadcn 호환 토큰명(`--primary`/`--border` 등)을 KRDS Semantic 으로 브리지.
- **Tailwind v4 — CSS-first.** 토큰을 Tailwind 유틸로 노출하는 건 `tailwind.config.ts`(없음, v4 는 `@config` 없으면 JS config 안 읽음)가 아니라 **`src/styles/tailwind.css` 의 `@theme` 블록**이다. 네임스페이스 → 유틸: `--color-*`→`bg-/text-/border-`, `--spacing-*`→`p-/m-/gap-/w-`, `--text-*`→`text-`(폰트크기, `--text-x--line-height` 동봉), `--radius-*`→`rounded-`, `--shadow-*`→`shadow-`, `--animate-*`→`animate-`(+`@keyframes`).
- **새 토큰 추가 절차 (반드시 순서대로):**
  1. `tokens.css` 에 값 정의 (필요시 Primitive + Semantic)
  2. `tailwind.css` `@theme` 에 네임스페이스로 등록 (예: `--color-krds-xxx: var(--krds-xxx);`)
  3. **색/폰트크기 토큰이면 `src/utils/cn.ts` 의 `KRDS_COLOR_NAMES`/`KRDS_FONT_SIZES` 에도 등록.** 누락 시 `text-*` 패턴을 twMerge 가 색 그룹으로 오분류 → 인접 색 클래스가 같이 제거되는 회귀(5/22·5/28 발생). spacing/radius/shadow 는 cn.ts 등록 불필요.
- 컴포넌트 스타일은 Tailwind 유틸 + `cva` 로만. 컴포넌트별 `.css` 파일 금지.
- **클릭 요소 커서(손모양)**: Tailwind v4 preflight 는 버튼 기본 커서를 `default` 로 둔다(v3 과 다름) → `globals.css` 전역 규칙(`button:not(:disabled)`, `[role='button']`, `label[for]` 등에 `cursor:pointer`)으로 복원해 둠. **개별 컴포넌트에 `cursor-pointer` 를 일일이 달지 말 것.** 클릭 가능한 요소는 `<div onClick>` 이 아니라 `<button>`/`<a>`(또는 `role="button"`)로 만들어야 이 전역 규칙과 접근성이 함께 커버된다.

## Figma (디자인 원본)

- Figma Dev Mode MCP 사용. **현행 file key: `GUnQ6XMmbindVZQ9MLEDcQ`** (`개인용-260723`, 2026-07-27 확인 — CM-05 안내 화면들 이 파일 기준으로 구현). 구 파일 `r4EjbQsz172SB5tQdX2bqV`(mobile)은 이전 구현 참조용 — 노드 번호 체계(10020-XXXXX)는 두 파일이 동일.
  - 이행(EX) 계열 신규 디자인은 `5M6FlyQBdHgeNrgIG2XhIN`(`개인용-2607427`)에도 있음(예: EX-02-P79 계약번호조회) — 사용자가 준 링크의 file key 를 따라가면 됨.
- 디자인 읽기 도구: `mcp__figma-dev-mode__get_design_context` / `get_metadata` / `get_screenshot` / `get_variable_defs`.
- Figma 디자인 데이터는 웹페이지 fetch 로 못 읽는다 — 반드시 MCP 사용. Figma 데스크톱 앱 실행 + Dev Mode MCP Server 활성화 필요.
- **D2B 색상**: 별도 색상 팔레트 프레임이 없어, 컴포넌트 디자인에서 추출한 실측값을
  `tokens.css` 의 `--krds-d2b-*` Primitive 블록에 확정함. Semantic 토큰이 이를 참조.
  새 색이 필요하면 이 블록에 추가하고 Semantic 에서 참조할 것 (컴포넌트에 hex 직접 금지).
- radius 8px = `--krds-radius-d2b` / `rounded-krds-8` 클래스.
- Figma 실측 대조(2패스 마감)·px→토큰 매핑은 `docs/rules/new-page.md` step 6 참고.
