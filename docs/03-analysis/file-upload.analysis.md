---
template: analysis
feature: file-upload
date: 2026-07-15
author: jygong
project: d2b-mobile-front
phase: check
matchRate: 100
---

# file-upload Gap Analysis (Check)

> Design(`docs/02-design/features/file-upload.design.md`) 대비 구현 정합성. gap-detector 정적 분석(백엔드 미연동 목업 — L1 API 런타임 N/A).

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 첨부 UI만 있고 업로드 동작 없음(스텁). |
| **WHO** | 프론트 팀 / 최종 = 모바일 웹앱(기업 입찰자). |
| **RISK** | 백엔드 업로드 스펙 미확정 → 필드/URL 변경 가능. |
| **SUCCESS** | 목업 플로우 동작 + 서비스 한 파일 교체로 실연동. lint/build 통과. |
| **SCOPE** | types/file·services/file + 레퍼런스 1화면(BidPrtcpAperWrtPage_Stp6). |

## Match Rate

| Category | Weight | Score |
|----------|:------:|:-----:|
| Structural | 0.2 | 100% |
| Functional (§5.4 8/8) | 0.4 | 100% |
| Contract (§3 데이터모델) | 0.4 | 100% |
| **Overall** | 1.0 | **100%** |

- Critical/Important: 0건.
- §5.4 Page UI Checklist 8항목 전부 실구현(스텁/플레이스홀더 0).
- 데이터모델(guid/orgnlFileNm/fileSz) 정확 일치. §4 API는 잠정(백엔드 미확정, 의도된 유예).
- 규칙 준수: 타입 위치(횡단→types/file.ts)·목업 경계 주석·multipart Content-Type 주석·명명(잠정)·목록 key(guid).

## Minor 관찰 및 해소 (Check 후 반영)

| # | 관찰 | 처리 |
|---|------|------|
| M-1 | 제출 payload `fileGuids` 미배선(files 상태 탭 소유) | ✅ **해소** — `files` 를 호스트(BidPrtcpAperWrtPage)로 lift, Stp6 controlled 化. 제출(전자서명 navigate) state 에 `fileGuids` + `// 추후 API` 주석 |
| M-2 | 초기 목업 guid 비-UUID 형식 | ✅ **해소** — 호스트 `INITIAL_ATTACHED_FILES` UUID형 목업값 |
| M-3 | `fileService.remove` floating promise | ✅ **해소** — `void fileService.remove(guid)` |

## Runtime (실연동 시점 유예)

백엔드 미연동으로 L1(실엔드포인트)·L3 E2E 는 스펙 확정 후. 목업 L2 수동 시나리오(선택/10MB/삭제/다중)만 유효. 실연동 전환 = `services/file.ts` upload/remove 블록 1개소 교체.

## 결론

Match Rate 100%, Minor 3건 전부 해소. 설계 정합 + Plan FR-08(제출 fileGuids)까지 배선 완료. Report 진행 가능.
