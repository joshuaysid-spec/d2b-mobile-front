# API 연동 컨벤션 · 타입 정의

> CLAUDE.md 에서 분할된 상세 규칙. API 배선 · 목업 작성 · 타입 추가 시 반드시 먼저 읽는다.

## API 연동 컨벤션 (2026-07-20 서비스 레이어 구축 — 구 "페이지 인라인 목업 + service 스텁 금지" 정책 폐기)

> **서비스 레이어가 전 도메인에 존재한다**: `src/services/bds/{도메인}.ts` (~280 메서드).
> 각 메서드 = `if (USE_MOCK) 목업(mocks/) : apiClient 실호출(URL 인라인)` 분기. 폐쇄망 반입 후 연동 절차는
> `docs/closed-network-checklist.md` §4 (`.env` 2줄 + URL 대조 + 잔여 페이지 배선).

**폴더 구조 · 3자 대칭 명명 (2026-08-19 재구성 — 구 `services/{도메인}.ts`·`queries/{도메인}.ts` 평면 구조 폐기):**

```
src/services/bds/{도메인}.ts          {도메인}Service = { selectXxx, saveXxx, … }   ← URL 함수 인라인
src/queries/bds/{도메인}/{도메인}Keys.ts     {도메인}Keys    = { selectXxx: … }       ← ['{도메인}', 함수명, 파라미터] 3단
src/queries/bds/{도메인}/{도메인}Queries.ts  {도메인}Queries = { useSelectXxx, … }    ← use + 서비스 함수명
```

- **함수명 = 백엔드 메서드명**(실규격 확정 전엔 select~ 스타일 임시 명명) — 서비스·쿼리키·훅이 같은 이름을 공유해 어느 층에서든 grep 1:1 추적. 조회는 `select~`, 뮤테이션은 동사 그대로(save/submit/reg …). 훅명은 `use` + 함수명(첫 글자 대문자).
- 쿼리키는 **`['{도메인}', 함수명, 파라미터]` 3단 유지** — 도메인 전체 무효화(`['op']`)와 함수 prefix 무효화가 모두 가능해야 함.
- Keys 파일을 훅과 분리하는 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조. (file 처럼 쿼리키가 0개인 도메인은 Keys 파일 생략)
- 파일명 = export 객체명 동일(`cmQueries.ts` 안에 `cmQueries`) — 에디터 탭/검색에서 도메인 구분(2026-08-19, 구 `queries.ts`/`keys.ts` 공통 파일명 폐기).
- 페이지 사용 형태: `import { opQueries } from '@/queries/bds/op/opQueries'` → `opQueries.useSelectPlanList(req)`.

**핵심 규칙:**
1. **페이지는 서비스를 직접 import 하지 않는다 — 모든 API 호출은 `{도메인}Queries` 훅으로만** (2026-07-30 확정. 구 "제출은 서비스 직접 await" 정책 폐기 — 전 페이지 전환 완료).
   - 조회 = useQuery 훅(소비가 생길 때 추가, `{도메인}Keys` queryKey 중앙관리) · 저장/제출/이벤트성 조회 = **useMutation 훅**. 핸들러에서 `await xxx.mutateAsync(...)` + try/catch(`ApiError.message` → `AlertModal`/`InputMessage`) — mutateAsync 도 실패 시 throw 라 catch 패턴 동일. fire-and-forget 은 `mutate()`(unhandled rejection 방지).
   - **제출 성공 시 영향받는 조회 캐시 무효화는 mutation 훅 `onSuccess` 에서 중앙 처리** — 전역 `staleTime: 60s` 라 수동 재조회가 안 되기 때문(목업 모드에선 안 드러나는 잠복 버그). prefix 무효화 키(예: `bdKeys.progressListAll`)는 `{도메인}Keys` 에 정의. 적용 예: `useSignElsgn`/`useSaveTndr` → 입찰진행목록 무효화.
     - 무효화를 mutation `onSuccess` 에 두는 건 라이브러리 제약이 아니라 **팀 규율** — 데이터가 낡는 원인은 대부분 "방금 한 변경"이므로 변경 지점에 중앙화한다(화면 곳곳에서 invalidate 하면 추적 불가). 기본은 `invalidateQueries`(캐시를 지우지 않고 stale 딱지 → 옛 데이터 보여주며 백그라운드 교체) — `removeQueries` 는 로그아웃 등 "더 보이면 안 되는" 캐시 폐기 전용(일반 갱신에 쓰면 빈 로딩 UX).
   - **staleTime 은 데이터 성격별로 개별 useQuery 에서 오버라이드**: 전역 기본 60초. 사실상 불변(공통코드·부서목록)은 `staleTime: Infinity`(+`gcTime: Infinity` — 세션 내 1회 호출 확정. 요청 파람이 같으면 queryKey 가 같아 캐시 즉시 반환), 실시간성(개찰 진행 등)은 짧게.
   - 순수 유틸(예: `validateFile`)은 서비스 파일에서 직접 import 해도 된다(API 호출이 아님).
2. **엔드포인트 URL 은 서비스 함수 안에만** 인라인한다(구 `EP` 상수 맵 폐기 — 2026-08-19. 함수당 URL 1회 사용이라 맵은 오버헤드). JSDoc 에 화면 ID+소비 파일 유지. 페이지에 URL 문자열 금지. 반입 후 실경로 확정 시 해당 함수만 수정.
3. **목업 데이터 위치**: 배선된 페이지의 목업은 `src/mocks/{도메인}.ts` (단일 소스, 페이지의 `MOCK_*` 상수를 이동). **미배선 페이지는 인라인 목업 유지** — 그 페이지를 배선할 때 이동한다. 서비스의 미배선 메서드 목업은 최소 대표값(1~3건).
4. **실호출 타이핑 — 전 API POST 통일(2026-07-30 확정)**: 백엔드 규격상 조회/저장/삭제 전부 `apiClient.post<T, T>(url, body?)` 로 호출한다(get/put/delete 금지 — 구 GET 의 `{ params }` 는 POST body 로). 응답 인터셉터가 봉투를 벗기므로 axios 2번째 제네릭에 알맹이 타입 지정. 다운로드는 `post<Blob, Blob>(url, null, { responseType: 'blob' })`. `any` 금지.
5. **인증**: 토큰 저장은 `authStore.setAccessToken`(localStorage 브리지 내장 — 직접 localStorage 만지지 말 것). 로그인 응답 매핑은 `services/bds/auth.ts` 의 `LoginResult` 로 격리.

**목록 → 상세 데이터 전달 — URL 에 식별자 금지, navigate state 로만 (2026-08-12 전환 완료):**

> PC 웹 정합(보안): 상세 이동에 path 변수/쿼리를 쓰지 않는다 — 판단번호 등 식별자가 주소창·히스토리·
> 서버 로그에 남지 않게. 상세 라우트는 **고정 경로**(element 파일명에서 `Page` 뗀 camelCase, 예:
> `/op/prcmPlanDtl`)이며 라우트 70개 전환 완료. 새 상세 화면도 반드시 이 패턴.

```tsx
// 목록 — 클릭 항목(식별자 포함)을 state 로만 전달. URL 은 고정 경로.
navigate('/op/prcmPlanDtl', { state: item })

// 상세 — state 에서 id 를 얻어 조회(placeholder 즉시 렌더 + id 조회로 확정).
//   state 없으면(직접 URL 진입·state 유실) 목록으로 가드. 훅은 가드보다 위에서 무조건 호출(hooks-order).
const stateItem = useLocation().state as OpPlanItem | null
const { data: detail } = useOpPlanDetail(stateItem?.id ?? '', stateItem ?? undefined)
if (!stateItem) return <Navigate to="/op" replace />
if (!detail) return <PageLoading />
```
- 조회 훅은 `enabled: Boolean(id)` — state 없을 때 빈 id 로 요청이 나가지 않는다.
- 데모/화면 변형 스위치는 식별자가 아니므로 쿼리 파라미터 허용(예: `?bidTypeNm=총액제`).
- 푸시 딥링크는 URL 이 아니라 네이티브 브리지로 payload(id)를 받아 같은 방식으로 navigate.
- 적용 예: `PrcmPlanDtlPage`(상세) · `PrcmPlanIntgListPage`(목록 useQuery + 클라 필터/페이징 유지) · `IdPswdLoginPage`(제출 await + 실패 AlertModal).
- 페이지 fallback `MOCK_*` 상수는 두지 않는다 — 직접 진입 가드가 목록으로 돌려보낸다(일부 미배선 화면은 의도적 목업 fallback 유지).

**타입은 설계서 데이터영역 기준(유지).** 아이템/상세 타입은 `src/types/{도메인}.ts` 에 설계서 항목명·형식 그대로. 요청/응답 미확정분은 각 도메인 타입 파일의 `TODO(백엔드 확정)` 섹션에.

## 타입 정의 (`src/types/`)

여러 파일에서 공유하는 TypeScript 타입은 반드시 `src/types/` 에 정의하고 `@/types/xxx` 로 import 한다.

**🔑 대원칙 — "타입 파일 = 도메인당 1개" (화면당 X).** `src/types/` 는 **biz 도메인 폴더 코드(op/bd/ct/ex/wm/ts/st/cm/fb) 와 1:1** 로 맞춘다. 화면이 100개 늘어도 그 타입은 **해당 도메인 파일 한 개에 줄만 추가**된다(파일 신설 X). 이래야 파일 개수가 화면 수가 아니라 **도메인 수(≈9개)로 상한**이 잡혀 폭증하지 않는다. "이 타입 어디 있지?"의 답은 항상 "그 화면의 **도메인**" 이어야 한다.

| 파일 | 무엇을 넣나 |
|------|-----------|
| `types/api.ts` | 백엔드 응답/요청 원형 타입 (`ApiResponse`, `ApiError` 등) |
| `types/domain.ts` | 프론트 범용 도메인 모델 (`Account` 등) |
| `types/search-filter.ts` | 범용 검색필터 config/value (도메인 무관 횡단) |
| `types/{도메인}.ts` | 도메인별 화면 타입 — **op·bd·cm …** (도메인당 1파일, 그 안에 화면별 섹션 주석으로 구분) |

**어디에 둘지 판단 기준:**

| 상황 | 위치 |
|------|------|
| 2개 이상 파일에서 import | `src/types/` |
| 컴포넌트 props 타입 (`interface XxxProps`) | 컴포넌트 파일 내 |
| 파일 내부에서만 쓰이는 로컬 타입 | 해당 파일 내 inline |

**⚠️ 타입 파일을 `src/ui/biz/` 폴더구조 따라 흩뿌리지 말 것.** 화면(폴더)마다 `types.ts` 를 만들면 폴더 수만큼 타입파일이 생겨 관리 불가 — 공유 데이터 타입은 화면 위치와 무관하게 **`src/types/` 에 도메인/관심사 단위로 모은다.** `biz` 폴더에 남는 타입은 **컴포넌트 props(inline)뿐**이다.

**⚠️ 한 도메인을 화면별 파일로 쪼개지 말 것.** 같은 도메인의 화면들은 서로 무관해 보여도 **한 도메인 파일에 섹션 주석으로 구분**해 넣는다. 예: cm(공통관리)의 인증서·FAQ·공지사항·자료실·마이페이지 → 전부 **`types/cm.ts` 하나**(과거 `cert.ts`/`faq.ts`/`notice.ts`/`mypage.ts` 로 쪼갰던 것을 통합함 — 이 선례를 반복하지 말 것). 파일이 너무 길어지면 그때 분리를 논의하되, **기본은 도메인당 1파일**이다.

**새 `types/*.ts` 파일은 언제 만드나 (파일 남발 금지):**

| 타입 성격 | 위치 | 예 |
|-----------|------|----|
| 특정 업무 도메인 전용 | 기존 `types/{도메인}.ts` 에 **추가** (새 파일 X) | 입찰공고 아이템 → `types/bd.ts` · 인증서 → `types/cm.ts` |
| 여러 도메인이 공통으로 쓰는 **횡단 관심사** | `types/{관심사}.ts` **신설** | 파일첨부(op·bd·ct 공통) → `types/file.ts` |
| 완전히 새로운 업무 도메인 | `types/{도메인}.ts` 신설 | — |

> **판단 규칙:** "이 타입이 한 도메인에만 속하나?" → 그 도메인 파일에 추가. "여러 도메인이 다 쓰나(첨부·페이징 등)?" → 관심사 파일 신설. 특정 도메인 파일(`types/bd.ts`)에 횡단 타입(`UploadedFile`)을 넣으면 다른 도메인이 입찰 타입을 import 하는 역참조가 생기니 금지.

**import 방법:** `import type { Account } from '@/types/domain'`
