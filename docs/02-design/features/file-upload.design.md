---
template: design
version: 1.3
feature: file-upload
date: 2026-07-15
author: jygong
project: d2b-mobile-front
version_project: 0.1.0
status: Draft
---

# file-upload Design Document

> **Summary**: 기존 `FileDownloadList` 업로드 변형 뒤에 파일 선택기 + `fileService`(업로드/삭제/검증경계) + GUID 상태 배선을 붙인다. Option C(실용) — 서비스가 업로드·검증상수·실연동 경계를 소유하고, 선택 상태는 화면이 소유.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: jygong
> **Date**: 2026-07-15
> **Status**: Draft
> **Planning Doc**: [file-upload.plan.md](../../01-plan/features/file-upload.plan.md)

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 첨부 UI만 있고 업로드 동작이 없음(스텁). 여러 첨부 화면이 실제로 파일을 못 올림. |
| **WHO** | 프론트 팀(기존 첨부 화면 다수). 최종 사용자 = 모바일 웹앱(기업 입찰자). |
| **RISK** | 백엔드 업로드 엔드포인트/응답 스펙 미확정 → 필드명·URL 변경 가능. multipart Content-Type 미처리 시 전송 깨짐. |
| **SUCCESS** | 목업으로 선택→업로드→목록→삭제→제출(GUID) 플로우가 돌고, 실연동은 `services/file.ts` 한 파일 교체로 완료. lint/build 통과. |
| **SCOPE** | `types/file.ts` + `services/file.ts` + 레퍼런스 1화면(`BidPrtcpAperWrtPage_Stp6`) '직접 업로드' 배선. 캐비닛·타 화면·서버 핸들러 제외. |

---

## 1. Overview

### 1.1 Design Goals

- 기존 `FileDownloadList`(업로드 변형)·`CabinetLink`(P13) 재사용 — 신규 컴포넌트 0.
- 업로드/삭제/검증경계를 `services/file.ts` 한 곳에 격리 → 실연동 시 이 파일만 교체.
- 선택 상태(`files`)는 화면 소유(현 컨벤션), 훅 미추출(YAGNI, 후속 복제 시 재검토).

### 1.2 Design Principles

- **경계 격리**: 목업↔실연동 차이를 서비스 한 파일에 가둔다(`// 추후 API` 주석 지점 명확화).
- **컴포넌트 재사용 우선**: UI는 `FileDownloadList`, 방식선택은 `CabinetLink` 그대로.
- **상태는 화면 소유**: 파일 목록·진행상태는 페이지 `useState`. 과잉 추상(훅/래퍼) 금지.
- **명명 규칙 준수**: 필드명은 RaonK 응답 기준 잠정(`guid`/`orgnlFileNm`/`fileSz`) + 잠정 주석(임의 작명 아님).

---

## 2. Architecture Options

### 2.0 Architecture Comparison

| Criteria | Option A: Minimal | Option B: Clean | Option C: Pragmatic |
|----------|:-:|:-:|:-:|
| **Approach** | 전부 페이지 인라인 | 훅+검증유틸+트리거 분리 | 서비스가 업로드/검증/경계 소유, 선택상태는 페이지 |
| **New Files** | 2 | 4 | 2 |
| **Modified Files** | 2 | 2 | 2 |
| **Complexity** | Low | High | Medium |
| **Maintainability** | Medium | High | High |
| **Effort** | Low | High | Medium |
| **Risk** | Low(복제 시 중복) | Low(훅 조기도입) | Low(균형) |
| **Recommendation** | 빠른 처리 | 장기 대규모 | **기본 선택** |

**Selected**: Option C — **Rationale**: 상태는 화면 소유(현 컨벤션)·서비스 분리·훅 미추출로 앞선 "단일화면=훅 불필요" 결정과 일치. 검증상수/업로드/실연동 경계를 서비스에 모아 타 첨부화면 복제가 쉽다. B는 훅 조기도입(반려됨), A는 검증이 페이지에 흩어짐.

### 2.1 Component Diagram

```
[BidPrtcpAperWrtPage_Stp6]  (화면 — files 상태 소유)
   │  onAddFile → BottomSheet(P13)
   ▼
[CabinetLink]  'direct' 선택 ──▶ 부모 콜백: 숨은 <input type=file multiple> 클릭
   │                                        │ change
   ▼                                        ▼
[FileDownloadList]  files 렌더/삭제   [fileService.upload/validate]  (services/file.ts)
                                             │  목업 GUID (실연동 시 이 파일만 교체)
                                             ▼
                                       [apiClient]  multipart, Content-Type undefined
```

### 2.2 Data Flow

```
파일 선택(다중) → validateFile(건당 10MB) → fileService.upload(multipart)
  → UploadedFile(guid) → files 상태 push → FileDownloadList 표시
삭제(X) → fileService.remove(guid) → files 상태 제거
폼 제출 → payload.fileGuids = files.map(guid)  (// 추후 API)
```

**[공통] 파일 추가 시트(`biz/cm/fileAdd/FileAdd`, v0.87) — 2026-09-15 업로드 내장(사용자 확정 구조)**

```
FileAdd 파일 선택 → validateFile → fbQueries.useUploadFile (파일당 1요청 순차 큐, 실패 건별 재시도)
  → UploadedFile 응답 통째를 FileAddFile.uploaded 에 보관, id = 응답 guid
  → [완료] = 전부 업로드된 파일만 onComplete({ docNm, files })  (업로드 중/실패 건 있으면 차단)
사용처 → files[].uploaded 에서 guid 등 필요한 값을 꺼내 등록 API 에 다른 정보(파일명·서류명)와 함께 전송 → 성공 응답
시트 내 X 삭제 → useRemoveFile(guid) 서버 제거
```
- 응답 필드가 늘어나면 `types/file.ts` `UploadedFile` 만 확장(FileAdd·사용처 무수정 — "통으로 넘기고 사용처에서 추출").
- 사용처 12곳 중 목록형(`{ id, name, size }`)은 `id` 가 곧 guid. 파일명 항목만 보관하는 화면(국외 입찰보증금 납부서·입찰내역 품목대체 첨부·공수협 품목대체)은 설계서 항목이 파일명이라 그대로 두고, 등록 API 항목에 GUID 가 확정되면 `uploaded.guid` 를 추가 전송.
- 캐비닛 업로드는 캐비닛 파일 선택 팝업 연동 전 임시 응답으로 done 처리.

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `BidPrtcpAperWrtPage_Stp6` | `fileService`, `FileDownloadList`, `CabinetLink`, `UploadedFile` | 화면 조립·상태 |
| `fileService` | `apiClient`, `UploadedFile` | 업로드/삭제/검증경계 |
| `CabinetLink` | (부모 콜백) | 'direct' 선택 시 파일선택기 트리거 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// src/types/file.ts — 횡단 관심사(op·bd·ct 공통). 도메인 파일에 두지 않음(역참조 방지).
// ⚠️ 필드명은 RaonK 응답 기준 잠정 — 백엔드 업로드 응답 스펙 확정 시 교체.
export interface UploadedFile {
  /** 파일 식별자(RaonK GUID, UUID형 문자열). 불투명 취급 — 저장/삭제/다운로드 참조 키. */
  guid: string
  /** 원본 파일명(orgnlFileNm) — 목록 표시. */
  orgnlFileNm: string
  /** 파일 크기 바이트(fileSz) — 표시 시 'KB/MB' 포맷. */
  fileSz: number
}
```

### 3.2 Entity Relationships

```
UploadedFile (서비스 반환)
   │  화면에서 매핑
   ▼
FileDownloadItem { id: guid, name: orgnlFileNm, size: '512KB', onRemove }
   (FileDownloadList 표시용 — 기존 타입, 변경 없음)
```

- `UploadedFile`(서비스/도메인) → `FileDownloadItem`(표시용) 매핑은 화면에서 수행. `size`는 `fileSz`(bytes)를 `formatFileSize`로 문자열화.

### 3.3 Storage

- 프론트 미저장(폐쇄망·B안). 파일 실체는 백엔드(RaonK) 저장, 프론트는 GUID만 상태 보관.

---

## 4. API Specification

> ⚠️ **미확정** — 백엔드(eGovFrame + RaonK B안)와 협의 필요. 아래는 잠정 계약. `services/file.ts` 의 교체 지점.

### 4.1 Endpoint List

| Method | Path(잠정) | Description | Auth |
|--------|------|-------------|------|
| POST | `/v1/bds/files` (잠정) | 파일 업로드(multipart) | Required |
| DELETE | `/v1/bds/files/{guid}` (잠정) | 업로드 파일 삭제 | Required |

### 4.2 Detailed Specification

#### `POST /v1/bds/files` (multipart/form-data)

**Request (FormData):**
```
file: <binary>            # 파일 바이너리
bizDivCd: "BD" (잠정)      # 업무구분 등 백엔드 요구 파라미터
```
> Content-Type 은 지정하지 않는다(브라우저가 boundary 자동 생성). `fileService.upload` 에서 `headers: { 'Content-Type': undefined }`.

**Response (공통 봉투 — 성공):**
```json
{
  "metadata": { "requestId": "...", "timestamp": "...", "status": { "success": true, "code": null, "message": null, "details": [] } },
  "data": { "guid": "76261fc0-...", "orgnlFileNm": "청렴서약서.hwp", "fileSz": 524288 }
}
```
> 인터셉터가 `data` 언래핑 → `fileService.upload` 는 `UploadedFile` 반환.

**에러:**
- `success:false` (봉투) → 인터셉터가 `ApiError`(code/message/details)로 reject → 화면 catch에서 안내.
- 네트워크/HTTP 4xx·5xx → axios error.

---

## 5. UI/UX Design

### 5.1 Screen Layout (대상: BidPrtcpAperWrtPage_Stp6 '파일첨부' 탭)

```
┌────────────────────────────────────┐
│ PageTitle: 파일첨부                 │
│ Infobox(안내사항 — 10MB 등)         │
│ SectionTitle: 입찰서 첨부파일 총 N건│
│ ┌ FileDownloadList (업로드 변형) ─┐ │
│ │ [파일명.hwp] [512KB]      [X]  │ │
│ │ [파일명.pdf] [1.2MB]      [X]  │ │
│ │ ── 구분선 ──                   │ │
│ │ [       파일 추가        ]     │ │  → onAddFile
│ └────────────────────────────────┘ │
│ (숨은 <input type=file multiple>)   │
└────────────────────────────────────┘
   ↓ 파일 추가
[BottomSheet P13: 파일첨부 방식 선택]
  · 직접 업로드  → <input> 클릭
  · 캐비닛 선택  → (이번 제외, 기존 스텁)
```

### 5.2 User Flow

```
파일첨부 탭 → '파일 추가' → 방식선택 시트 → '직접 업로드'
  → 파일 선택(다중) → 10MB 검증(초과분 거부+안내) → 업로드
  → 목록에 추가(파일명·용량) → [X] 삭제 가능
제출 → payload.fileGuids 전송(// 추후 API)
```

### 5.3 Component List

| Component | Location | Responsibility | 변경 |
|-----------|----------|----------------|------|
| `BidPrtcpAperWrtPage_Stp6` | biz/bd/bidPrtcpAperWrt | files 상태·input·핸들러·검증호출 | 수정 |
| `CabinetLink` | biz/bd/bidPrtcpAperWrt | 'direct' 선택 시 부모 콜백 호출 | 경미 수정 |
| `FileDownloadList` | common/composites | 파일 목록·삭제·파일추가 버튼 | 불변(재사용) |
| `fileService` | services/file.ts | upload/remove/검증상수 | 신규 |
| `UploadedFile` | types/file.ts | 업로드 파일 타입 | 신규 |

### 5.4 Page UI Checklist

#### 파일첨부 탭 (BidPrtcpAperWrtPage_Stp6)

- [ ] Infobox: 안내사항(건당 10MB 미만 등 5개 항목)
- [ ] SectionTitle: '입찰서 첨부파일' + `총 N건`(files.length 연동)
- [ ] FileDownloadList: 파일행(파일명 + [용량] + X 삭제 버튼)
- [ ] Button: '파일 추가' → 방식선택 시트 오픈
- [ ] BottomSheet(P13): '직접 업로드' / '캐비닛 선택' 2옵션
- [ ] Hidden input: `<input type=file multiple>` — '직접 업로드'로 트리거
- [ ] 검증: 건당 10MB 초과 파일 거부 + 안내 메시지(alert/토스트)
- [ ] 삭제: X 클릭 시 목록에서 제거(+ fileService.remove 호출)

---

## 6. Error Handling

| 상황 | 처리 |
|------|------|
| 파일 10MB 초과 | 업로드 전 거부, "건당 10MB 미만만 첨부 가능합니다" 안내(초과분만 제외, 나머지는 진행) |
| 업로드 실패(`success:false`) | 인터셉터 `ApiError` → catch → 안내 메시지, 목록 미추가 |
| 업로드 실패(네트워크) | catch → 안내, 목록 미추가 |
| 삭제 실패 | catch → 안내(목록 롤백 여부는 목업 단계 생략, 실연동 시 정의) |
| 0건 제출 | (검증은 폼 검증 규칙 소관 — 이번 스코프 밖, 필요 시 후속) |

> 목업 단계에서는 실패 케이스를 강제 발생시키지 않음. 실연동 시 서비스가 위 경로로 throw.

---

## 7. Security Considerations

- [ ] 확장자 검증은 **백엔드(RaonK 핸들러)** 권위 — 프론트는 UX 사전(크기)만.
- [x] 인증 토큰: `apiClient` 요청 인터셉터가 자동 첨부(업로드 요청도 동일).
- [x] Content-Type override 는 업로드 요청 한정(다른 JSON 요청 무영향) — 요청별 config로 지정.
- [ ] 파일명/GUID 는 불투명 문자열로 취급(경로 조합·파싱 금지).

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L2: UI Action | 파일첨부 탭 선택→목록→삭제 | 수동/Playwright | Do |
| L1: Service | fileService 목업 반환·검증 | 콘솔/단위 | Do |

> 백엔드 미연동(목업)이라 L1 API(실엔드포인트)·L3 E2E는 실연동 시점으로 유예.

### 8.2 L2: UI Action Test Scenarios

| # | Page | Action | Expected Result |
|---|------|--------|----------------|
| 1 | 파일첨부 탭 | '파일 추가'→'직접 업로드'→파일 선택 | 목록에 파일명·용량 추가, 총 N건 증가 |
| 2 | 파일첨부 탭 | 10MB 초과 파일 선택 | 거부 + 안내, 목록 미추가 |
| 3 | 파일첨부 탭 | 파일 X 클릭 | 목록에서 제거, 총 N건 감소 |
| 4 | 파일첨부 탭 | 다중 파일 선택 | 유효 파일 모두 추가 |

### 8.3 Seed Data

| Entity | Count | Fields |
|--------|:-:|---|
| INITIAL_FILES(목업) | 2 | guid·orgnlFileNm·fileSz (설계서 slide107 서류: 청렴서약서·법인등기부등본) |

---

## 9. Clean Architecture

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `BidPrtcpAperWrtPage_Stp6`·`CabinetLink` | Presentation | `src/ui/biz/bd/bidPrtcpAperWrt/` |
| `FileDownloadList` | Presentation | `src/ui/common/composites/` |
| `fileService` | Application | `src/services/file.ts` |
| `UploadedFile` | Domain | `src/types/file.ts` |
| `apiClient` | Infrastructure | `src/lib/apiClient.ts` |

> 의존 방향: Presentation → Application(fileService) → Infrastructure(apiClient). Domain(UploadedFile)은 무의존. `types/file.ts`(횡단)는 도메인 파일이 import 하지 않음.

---

## 10. Coding Convention Reference

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| 서비스 네이밍 | `services/{도메인}.ts` → `fileService`(cmService 패턴) |
| 타입 위치 | 횡단 → `types/file.ts` (CLAUDE.md 타입 규칙) |
| 상태 관리 | 화면 `useState`(files) — 훅 미추출 |
| 목업 경계 | `// 추후 API: fileService.xxx` 주석, 서비스에 실연동 블록 주석 |
| multipart | `Content-Type: undefined`(요청별) |
| 검증 | 서비스에 `MAX_FILE_SIZE` 상수 + `validateFile` 헬퍼 |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── types/file.ts                    (신규 — UploadedFile)
├── services/file.ts                 (신규 — fileService.upload/remove, MAX_FILE_SIZE, validateFile)
├── utils/format.ts                  (formatFileSize 추가 검토 — bytes→'KB/MB')
└── ui/biz/bd/bidPrtcpAperWrt/
    ├── BidPrtcpAperWrtPage_Stp6.tsx (수정 — input·상태·배선·검증)
    └── CabinetLink.tsx              (경미 수정 — direct 콜백)
```

### 11.2 Implementation Order

1. [ ] `types/file.ts` — `UploadedFile`
2. [ ] `services/file.ts` — `fileService.upload/remove` + `MAX_FILE_SIZE` + `validateFile` (목업 + 경계주석)
3. [ ] `utils/format.ts` — `formatFileSize(bytes)` (없으면 추가)
4. [ ] `CabinetLink.tsx` — 'direct' 선택 시 부모 콜백(`onSelect('direct')` 유지, 부모가 input 트리거)
5. [ ] `BidPrtcpAperWrtPage_Stp6.tsx` — 숨은 input·files 상태·업로드/삭제 핸들러·10MB 검증 배선
6. [ ] 목업 플로우 확인 + `npm run lint && npm run build`

### 11.3 Session Guide

#### Module Map

| Module | Scope Key | Description | Turns |
|--------|-----------|-------------|:-:|
| 서비스·타입 | `module-1` | `types/file.ts` + `services/file.ts` + `formatFileSize` | 10-15 |
| 화면 배선 | `module-2` | `CabinetLink` + `BidPrtcpAperWrtPage_Stp6` input/상태/검증 | 15-20 |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---------|-------|-------|:-:|
| 1 | Plan+Design | 전체 | 완료 |
| 2 | Do | 전체(module-1+2, 소규모) | 25-35 |
| 3 | Check+Report | 전체 | 20-30 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-15 | Initial draft (Option C 선택) | jygong |
