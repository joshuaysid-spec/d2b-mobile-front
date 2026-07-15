---
template: plan
version: 1.3
feature: file-upload
date: 2026-07-15
author: jygong
project: d2b-mobile-front
version_project: 0.1.0
status: Draft
---

# file-upload Planning Document

> **Summary**: 첨부 UI(`FileDownloadList` 업로드 변형)는 이미 있으나 실제 업로드 배선이 없다 — 파일 선택기 + 서비스 계층 + GUID 상태 배선을 붙여, `services/file.ts` 한 파일만 교체하면 RaonK 백엔드(B안)와 실연동되도록 한다.
>
> **Project**: d2b-mobile-front
> **Version**: 0.1.0
> **Author**: jygong
> **Date**: 2026-07-15
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 첨부 UI(`FileDownloadList` 업로드 변형)와 방식선택 시트(P13)는 있으나 **실제 배선이 없다** — `onAddFile`/`onRemove` 가 `console.log` 스텁이고, 파일 선택기(`<input type=file>`)가 없어 파일을 실제로 못 올린다. |
| **Solution** | 횡단 타입 `types/file.ts`(`UploadedFile`) + 서비스 `services/file.ts`(`fileService.upload/remove` — multipart·Content-Type 비움·목업+API 경계 스텁) 신설, 방식선택 '직접 업로드'에 파일 선택기 배선, 업로드 결과 GUID 를 상태 보관하고 폼 제출 시 GUID 목록 전송. 컴포넌트는 **신규 없음**(기존 재사용). |
| **Function/UX Effect** | 파일첨부 → '직접 업로드' → 파일 선택(다중) → 10MB 초과 거부 → 목록에 파일명·용량 표시 → X로 삭제. 폼 제출 시 GUID 배열 전송. 국내 입찰참가신청 첨부(`BidPrtcpAperWrtPage_Stp6`)를 레퍼런스로. |
| **Core Value** | 백엔드 스펙 미확정 상태에서도 **서비스 한 파일만 교체하면 실연동**되는 경계 구조. 폐쇄망/하이브리드 웹앱에서 RaonK 위젯 없이 표준 multipart 로 붙는다. |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 첨부 UI만 있고 업로드 동작이 없음(스텁). 여러 첨부 화면이 실제로 파일을 못 올림. |
| **WHO** | 프론트 팀(기존 첨부 화면 다수). 최종 사용자 = 모바일 웹앱(기업 입찰자). |
| **RISK** | 백엔드 업로드 엔드포인트/응답 스펙 미확정 → 필드명·URL 이 바뀔 수 있음. multipart Content-Type 미처리 시 전송 깨짐. |
| **SUCCESS** | 목업으로 선택→업로드→목록→삭제→제출(GUID) 플로우가 돌고, 실연동은 `services/file.ts` 한 파일 교체로 완료 가능. lint/build 통과. |
| **SCOPE** | `types/file.ts` + `services/file.ts` + 레퍼런스 1화면(`BidPrtcpAperWrtPage_Stp6`) '직접 업로드' 배선. 캐비닛·타 화면·서버 핸들러 제외. |

---

## 1. Overview

### 1.1 Purpose

기존 첨부 UI(`FileDownloadList`) 뒤에 **파일 선택 → 업로드 서비스 → GUID 상태 보관 → 폼 제출 시 전송** 배선을 붙인다. 백엔드(RaonK, B안) 스펙이 확정되면 서비스 한 파일만 교체해 실연동한다.

### 1.2 Background

- 첨부 UI는 이미 있음: `src/ui/common/composites/FileDownloadList.tsx` 의 **업로드 변형**(`files` + `onAddFile` + 항목별 `onRemove`). 다수 화면이 사용 중(`AtchDocReg`·`TndrWrt_Stp5`·`BidPrtcpAperWrtPage_Stp6`).
- 그러나 핸들러가 전부 `console.log` 스텁이고, 파일 선택기(`<input type=file>`)가 없어 **실제 업로드 불가**.
- 백엔드 = eGovFrame(자바). 파일저장은 **RaonK Upload** 를 백엔드가 REST 로 감싸 제공(**B안**) — 프론트는 표준 multipart 만 던지고 RaonK JS 위젯/핸들러는 쓰지 않음.
- RaonK 응답의 파일 식별자 = **GUID**(UUID 형식 문자열). 프론트는 이를 불투명 문자열로 보관해 저장/삭제/다운로드에 참조.
- 배포 = **폐쇄망**. 외부 CDN/런타임 페치 금지(RaonK JS 위젯을 안 쓰는 이유 중 하나).
- API 공통 봉투(`{ metadata: { status }, data }`)는 이미 정합 완료(`apiClient` 인터셉터 — 별도 커밋). 업로드 응답도 이 봉투로 옴.

### 1.3 Related Documents

- 참고 SW: `C:\gongjiyeon\03.sw연동\raonkupload` (readme.txt — 클라이언트/서버 모듈 구성)
- 코드 규칙: `CLAUDE.md` — 타입 정의(도메인당 1파일/횡단 관심사), 목업+API 경계 스텁, 명명 규칙
- 대상 화면: `src/ui/biz/bd/bidPrtcpAperWrt/BidPrtcpAperWrtPage_Stp6.tsx`(MUI-BD-04-M12), 방식선택 `CabinetLink.tsx`(P13)

---

## 2. Scope

### 2.1 In Scope

- [ ] `src/types/file.ts` — `UploadedFile`(횡단 관심사, RaonK 응답 기준 잠정 필드명 `guid`/`orgnlFileNm`/`fileSz`)
- [ ] `src/services/file.ts` — `fileService.upload(file)`/`remove(guid)` (multipart, `Content-Type: undefined`, 목업 + `// 추후 API` 경계 주석)
- [ ] 파일 선택기(`<input type=file multiple>`) 트리거 — 방식선택 '직접 업로드'(`CabinetLink` `direct`)에 배선
- [ ] 클라이언트 검증 — 건당 10MB 초과 거부 + 안내 메시지(설계서 slide107 유의사항)
- [ ] 업로드 결과 GUID 를 `files` 상태에 보관 → `FileDownloadList` 표시, X 삭제 시 `fileService.remove`
- [ ] 폼 제출 시 GUID 목록 전송 자리 표시(`// 추후 API: 제출 payload 에 fileGuids`)
- [ ] 레퍼런스 화면 1개(`BidPrtcpAperWrtPage_Stp6`)에만 배선

### 2.2 Out of Scope

- 캐비닛 선택(cabinet — 보관함/자료실 파일 연결): 보관함 조회 API 미확정 → 기존 `console.log` 스텁 유지
- 나머지 첨부 화면(`AtchDocReg`·`TndrWrt_Stp5` 등) 배선: 동일 패턴으로 후속 적용
- 서버측 RaonK 핸들러·저장경로 콜백·확장자 검증: 백엔드 몫
- RaonK JS 위젯/에이전트(cab/exe), 대용량 분할·이어올리기: B안이라 미사용
- 실제 백엔드 연동/다운로드 엔드포인트: 스펙 확정 후 서비스 교체 시점

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `UploadedFile` 타입 정의 (`guid`/`orgnlFileNm`/`fileSz` 잠정, 잠정 주석) | High | Pending |
| FR-02 | `fileService.upload(file)` — multipart(Content-Type 비움), 목업 GUID 반환 | High | Pending |
| FR-03 | `fileService.remove(guid)` — 목업 스텁 | High | Pending |
| FR-04 | '직접 업로드' 선택 시 `<input type=file multiple>` 열림 | High | Pending |
| FR-05 | 선택 파일 건당 10MB 초과 거부 + 안내 메시지 | Medium | Pending |
| FR-06 | 업로드 성공 파일을 `files` 목록에 추가(파일명·용량·guid) | High | Pending |
| FR-07 | 목록 X 클릭 시 `fileService.remove` + 상태 제거 | High | Pending |
| FR-08 | 폼 제출 payload 에 `fileGuids` 전송 자리 표시(경계 주석) | Medium | Pending |
| FR-09 | 업로드 진행 중 UX(중복 클릭 방지/비활성) 최소 처리 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 교체 용이성 | 실연동 시 `services/file.ts` **한 파일만** 수정 | 코드 리뷰(경계 격리 확인) |
| 폐쇄망 | 외부 런타임/CDN 의존 0 (RaonK 위젯 미사용) | import 검사 |
| 규칙 준수 | 명명(화면ID/항목명)·목업 경계 주석·타입 위치(횡단→file.ts) | CLAUDE.md 대조 |
| 빌드/린트 | `npm run lint && npm run build` 통과, chunk 영향 없음 | CI/로컬 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-01~08 구현 (FR-09 best-effort)
- [ ] 목업으로 선택→업로드→목록→삭제→제출(GUID console) 플로우 동작
- [ ] `services/file.ts` 에 실연동 자리(URL·필드·응답 매핑) 주석으로 명시
- [ ] lint/build 통과

### 4.2 Quality Criteria

- [ ] Zero lint errors (기존 경고 외 신규 0)
- [ ] Build 성공, 신규 청크 경고 없음
- [ ] 목데이터/필드명이 임의 더미 아님(RaonK 기준, 잠정 주석)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 백엔드 업로드 스펙(URL·필드·응답) 미확정 | Medium | High | 서비스 한 파일에 격리 + 잠정 주석. 스펙 확정 시 그 블록만 교체 |
| multipart Content-Type 미처리로 전송 깨짐 | High | Medium | `fileService.upload` 에서 `Content-Type: undefined` 로 브라우저 boundary 자동화. 주석 명시 |
| `UploadedFile` 필드명이 실제와 다름 | Low | Medium | 잠정(guid/orgnlFileNm/fileSz) + 매핑 지점 1곳. 응답→타입 매핑을 서비스에서 수행 |
| 캐비닛 미배선으로 사용자 혼동 | Low | Low | '직접 업로드'만 동작, '캐비닛 선택'은 기존 스텁 유지(후속 명시) |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/types/file.ts` | 신규 타입 | `UploadedFile` 추가(횡단) |
| `src/services/file.ts` | 신규 서비스 | `fileService.upload/remove` 추가 |
| `BidPrtcpAperWrtPage_Stp6.tsx` | 화면 수정 | 파일선택기·검증·서비스 배선(기존 스텁 대체) |
| `CabinetLink.tsx` | 경미 수정 | 'direct' 선택 시 파일선택기 트리거 연결(부모 콜백 경유) |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `FileDownloadList` | 사용 | `AtchDocReg`·`TndrWrt_Stp5`·`BidPrtcpAperWrtPage_Stp6` | None(컴포넌트 API 불변, 배선만 추가) |
| `CabinetLink` | 사용 | `BidPrtcpAperWrtPage_Stp6` only | 대상 화면 내 한정 — 회귀 없음 |
| `apiClient` | 사용 | 전 서비스 | None(업로드는 요청별 Content-Type override) |

### 6.3 Verification

- [ ] `FileDownloadList` props 시그니처 불변 확인(타 화면 무영향)
- [ ] `CabinetLink` 변경이 대상 화면에만 영향
- [ ] 업로드 요청의 Content-Type override 가 다른 JSON 요청에 영향 없음(인스턴스 공유 주의)

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Dynamic (feature-based, services 계층) | ✅ |

### 7.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| 업로드 방식 | 백엔드 REST 래핑(B안) + 표준 multipart | 폐쇄망/하이브리드·React 정합. RaonK JS 위젯 회피 |
| 컴포넌트 | 기존 `FileDownloadList` 재사용 | 이미 업로드 변형 존재 — 신규 생성 금지 |
| 상태 위치 | 화면(페이지) `useState` 인라인 | 첨부 상태는 화면 소유. 훅 미추출(단일 컴포넌트 재사용이 재사용 단위) |
| 타입 위치 | `types/file.ts`(횡단) | 첨부는 op·bd·ct 공통 → 도메인 파일 금지(역참조 방지) |
| API 클라이언트 | 기존 `apiClient`(axios) | 요청별 `Content-Type: undefined` 로 multipart |
| 경계 처리 | 목업 + `// 추후 API` 주석 | 스펙 미확정 → 서비스 한 파일 교체로 실연동 |

### 7.3 Folder Structure Preview

```
src/
  types/file.ts          (신규 — UploadedFile)
  services/file.ts       (신규 — fileService)
  ui/biz/bd/bidPrtcpAperWrt/
    BidPrtcpAperWrtPage_Stp6.tsx  (수정 — 배선)
    CabinetLink.tsx               (경미 수정 — direct 트리거)
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [x] `CLAUDE.md` 코딩 컨벤션(타입 정의·목업 경계·명명 규칙) 존재
- [x] ESLint / TypeScript 설정 존재
- [x] Prettier 설정 존재

### 8.2 Conventions to Verify

| Category | Current State | To Verify |
|----------|---------------|-----------|
| 타입 위치 | 존재(도메인당 1파일 + 횡단) | 첨부는 횡단 → `types/file.ts` 신설이 규칙에 맞음 |
| 목업 경계 | 존재(`// 추후 API:`) | 서비스 스텁에 경계 주석 |
| 명명 | 존재(설계서 항목명) | 필드명 RaonK 잠정 + 잠정 주석(임의 작명 아님을 명시) |

### 8.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `VITE_API_BASE_URL` | API 베이스(기존) | Client | ☐ (기존) |

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`file-upload.design.md`) — 3안 비교(직접 배선 / 서비스+검증 유틸 분리 / 향후 훅 확장 대비)
2. [ ] 팀 검토
3. [ ] 구현 시작(`/pdca do file-upload`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-15 | Initial draft | jygong |
