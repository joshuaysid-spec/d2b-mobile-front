# 폐쇄망 폰트 self-host & 아이콘 시스템

> d2b-mobile-front 는 **폐쇄망(air-gapped)** 환경에 배포된다. 런타임에 인터넷/CDN 접근이 불가능하므로
> 모든 폰트는 빌드 산출물(`dist`)에 물리적으로 포함(self-host)되어야 한다.
> 이 문서는 그 구조와 "왜 이렇게 했는지", 유지보수 방법을 한 곳에 정리한다. (작성: 2026-06-02)

---

## 0. TL;DR

- 폰트(Pretendard 본문 · Material Symbols 아이콘)는 **`vite-plugin-static-copy`** 가 빌드 시
  `node_modules` → `dist/assets/` 로 복사한다. (`vite.config.ts`)
- 아이콘은 **Material Symbols Outlined 폰트** 기반. `Icon` 컴포넌트가 `name`(PascalCase) → ligature 로 렌더.
  (구 `@mui/icons-material` 에서 전환 완료. `@mui/*`·`@emotion/*` 제거됨.)
- **CDN `@import url(...)` 금지.** 폐쇄망에서 폰트 404 → 본문은 시스템 폰트 폴백, 아이콘은 글자로 깨짐.
- 빌드 도구·폰트 패키지는 **사내 Nexus** 로 설치(빌드 시점). **런타임엔 네트워크 무관** — dist 정적 파일만 서빙.

---

## 1. 배경: 왜 폰트가 안 들어갔나 (해결한 문제)

`src/styles/globals.css` 가 npm 폰트 패키지의 CSS 를 `@import` 한다:

```css
@import 'pretendard-gov/dist/web/variable/pretendardvariable-gov-dynamic-subset.css';
@import 'material-symbols/outlined.css';
```

이 패키지 CSS 안의 `@font-face` 는 woff2 를 **상대경로**로 가리킨다 (`src: url(./woff2-dynamic-subset/...woff2)`).
그런데 **Vite 는 `@import` 해온 node_modules CSS 의 `url()` 폰트를 `dist` 로 자동 복사하지 못한다.**
빌드 시 이런 경고가 난다:

```
./woff2-dynamic-subset/...woff2 referenced ... didn't resolve at build time,
it will remain unchanged to be resolved at runtime
```

= "이 폰트는 빌드 때 못 챙기니 경로만 그대로 두고 런타임에 찾아라" → 그런데 `dist` 에 그 파일이 없음 → **런타임 404.**

### 증상 (개발 vs 배포)

| | 폰트 로드 |
|---|---|
| `npm run dev` | ✅ 정상 (Vite dev 서버가 node_modules 를 직접 서빙) |
| 프로덕션 빌드(dist) / **폐쇄망 배포** | ❌ 404 → Pretendard 는 시스템 폰트 폴백, 아이콘 폰트는 "home" 같은 텍스트로 깨짐 |

→ **개발 중엔 멀쩡하다가 배포해야 터지는** 종류라 놓치기 쉽다.

---

## 2. 해결: vite-plugin-static-copy

`vite.config.ts` 에서 빌드 시 폰트 woff2 를, **빌드된 CSS 의 상대 url 이 기대하는 `dist/assets/` 경로**로 직접 복사한다.

```ts
import { viteStaticCopy } from 'vite-plugin-static-copy'

viteStaticCopy({
  targets: [
    {
      src: 'node_modules/pretendard-gov/dist/web/variable/woff2-dynamic-subset/*',
      dest: 'assets/woff2-dynamic-subset',
      rename: { stripBase: true }, // ★ 필수
    },
    {
      src: 'node_modules/material-symbols/material-symbols-outlined.woff2',
      dest: 'assets',
      rename: { stripBase: true }, // ★ 필수
    },
  ],
})
```

- 빌드된 CSS(`dist/assets/index-[hash].css`)의 url 은 `./woff2-dynamic-subset/*` 와 `./material-symbols-outlined.woff2`.
  CSS 가 `/assets/` 에 있으니 이 상대경로는 `/assets/woff2-dynamic-subset/*`, `/assets/material-symbols-outlined.woff2` 로 해석 → 위 복사 경로와 일치.
- **`rename: { stripBase: true }` 가 핵심.** 이 플러그인은 src 디렉토리 구조를 **항상 보존**하므로,
  안 붙이면 `dist/assets/node_modules/pretendard-gov/.../*.woff2` 처럼 **원본 경로째** 복사된다(404 그대로).
  `stripBase: true` = 앞쪽 디렉토리 전부 제거 → 평탄 복사.
- 빌드 로그에 `[vite-plugin-static-copy] Copied 121 items` (Pretendard 120 + Material Symbols 1) 가 떠야 정상.

---

## 3. 아이콘 시스템 (Material Symbols 폰트)

### 왜 폰트인가
디자인 원본(Figma)이 Google **Material Symbols**(신) 기준인데, 기존 `@mui/icons-material` 은 Material **Icons**(구)라
모양이 1:1 로 안 맞았다. Material Symbols 는 가변폰트로만 제공되므로 **아이콘 폰트(self-host)** 로 전환했다.

### 작동 방식
- `src/ui/common/base/Icon.tsx` 의 `REGISTRY` 가 `name`(PascalCase) → **ligature**(snake_case) 로 매핑.
- 렌더: `<span className="material-symbols-outlined">home</span>` → 폰트의 `liga` 기능이 `home` → 🏠 글리프로 합자.
- `.material-symbols-outlined` 클래스·`@font-face` 는 `material-symbols/outlined.css`(패키지)가 제공 → globals.css 가 `@import`.
- 가변 축: `fill`(0 아웃라인/1 채움) · `weight`(100~700) 를 `Icon` props 로 제어 (인라인 `font-variation-settings`).

```tsx
import { Icon } from '@/ui/common/base/Icon'

<Icon name="Search" size={20} />
<Icon name="Close" size={20} className="text-krds-..." />  // 색은 currentColor(text-*)
<Icon name="Star" fill={1} weight={700} />
<Icon><MyCustomSvg /></Icon>                               // REGISTRY 미등록은 children(SVG)
```

### 새 아이콘 추가 (import/번들 작업 불필요 — 폰트에 모든 글리프 포함)
1. https://fonts.google.com/icons 에서 **Material Symbols** 아이콘 찾기 → 코드명(snake_case) 확인 (예: `location_on`).
2. `src/ui/common/base/Icon.tsx` 의 `REGISTRY` 에 한 줄 추가 (알파벳 순서): `LocationOn: 'location_on',`
3. 사용처에서 `<Icon name="LocationOn" />`.

> Material Symbols 는 채움/아웃라인을 별도 이름이 아닌 **FILL 축**으로 구분한다.
> `Favorite`/`Star`(채움)·`FavoriteBorder`/`StarBorder`(아웃라인)는 같은 ligature 에 `Icon.tsx` 의
> `FILLED_BY_DEFAULT` 로 기본 FILL 만 다르게 매핑돼 있다.

---

## 4. 빌드 vs 런타임 & Nexus

```
[빌드 시점] 폐쇄망 내부 빌드서버
  npm ci  ──(사내 Nexus)──▶  node_modules
     · vite-plugin-static-copy (빌드 도구, devDep)
     · pretendard-gov / material-symbols (폰트 패키지)
  npm run build
     └ 플러그인이 node_modules woff2 → dist/assets/ 로 복사 (로컬 복사, 네트워크 X)

[런타임 — 배포된 웹뷰]
  dist 정적 파일만 서빙 ──▶ npm/Nexus/인터넷 전혀 관여 안 함 ✅ 완전 오프라인
```

- **Nexus 는 빌드(설치) 때 한 번만** 관여 — 세 패키지(`vite-plugin-static-copy`, `pretendard-gov`, `material-symbols`)가
  Nexus 에서 설치 가능해야 함(프록시면 자동, 화이트리스트면 1회 승인/캐싱).
- **플러그인은 런타임에 아무것도 받아오지 않는다.** 빌드 때 복사만 함.

---

## 5. 검증 방법 (배포 전 체크)

```bash
npm run build
# 로그에 "[vite-plugin-static-copy] Copied 121 items" 확인

# dist 에 폰트 실제 포함됐는지
ls dist/assets/woff2-dynamic-subset/*.woff2 | wc -l   # → 120
ls dist/assets/material-symbols-outlined.woff2        # → 존재

# 잘못된 경로(원본 구조째 복사) 잔재 없는지
find dist -path "*node_modules*"                       # → 비어 있어야 함
```

추가로 **실제 화면 확인**(헤드리스로는 불가): 빌드 결과를 띄워 한글 본문이 Pretendard 로,
아이콘이 글자가 아닌 심볼로 보이는지 눈으로 확인.

---

## 6. 주의사항 / 하지 말 것

- ❌ **CDN `@import url(구글폰트)`** — 폐쇄망 404. 반드시 self-host.
- ❌ **`public/fonts/` 수동 복사 방식** — 과거 Material Symbols 임시 처치였으나 플러그인으로 통일·제거됨. 되살리지 말 것.
- ❌ **`rename: { stripBase: true }` 누락** — `dist/assets/node_modules/...` 로 잘못 복사되어 404 그대로.
- ❌ **`@mui/icons-material` / lucide import** (신규 코드) — 아이콘은 `Icon` 컴포넌트로만. (lucide 는 `src/ui/raw/*` 4개 정본만 예외)
- ⚠️ **폰트 서브셋(용량 축소) 미적용** — Material Symbols 전체 가변폰트 ~3.8MB 그대로.
  사용자 요청으로 서브셋 안 함. 참고: 나이브한 ligature 텍스트 서브셋은 HarfBuzz `liga` 클로저 때문에 거의 안 줄어듦
  (3.77MB→3.4MB). 제대로 줄이려면 코드포인트 기반 등 다른 접근 필요 — 함부로 시도 말 것.

---

## 7. 폰트 패키지 업데이트 시

`pretendard-gov` 또는 `material-symbols` 를 `npm update` 하면 `node_modules` 가 갱신되고,
다음 빌드에서 플러그인이 자동으로 최신 woff2 를 복사한다 — **수동 작업 불필요.**
단, Pretendard subset 파일 개수가 바뀌면 빌드 로그의 "Copied N items" 숫자로 확인.

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `vite.config.ts` | `viteStaticCopy` 폰트 복사 설정 |
| `src/styles/globals.css` | 두 폰트 패키지 CSS `@import` + 로드 순서 |
| `src/ui/common/base/Icon.tsx` | 아이콘 `name`→ligature `REGISTRY`, FILL/weight 축 제어 |
| `CLAUDE.md` → "아이콘 정책" | 아이콘 추가 규칙 (이 문서와 동기화 유지) |
