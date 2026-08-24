// tssCmService — 지원 시스템(tss) / cm 도메인: 게시판(공지·자료실·FAQ, /tss/cm/board/*).
// 대메뉴 규칙(폴더 = URL 1단/2단)에 따라 services/cbs/cm.ts(cmService)에서 분리(2026-08-24).
// export 명은 cbs 의 cmService 와 충돌하므로 대메뉴 접두 — 같은 도메인명이 다른 대메뉴에
// 또 있으면 {대메뉴}{도메인}Service 로 명명(향후 /tss/bd/* 모의입찰 = tssBdService).
// URL 은 각 함수 안에 인라인(실백엔드 .do 경로 확정 시 해당 함수만 수정).
import { apiClient } from '@/lib/apiClient'
import { USE_MOCK, mockDelay } from '@/lib/env'
import { MOCK_CM } from '@/mocks/cm'
import type {
  BoardListItem,
  BoardListRequest,
  FaqListItem,
  FaqListRequest,
  NoticeDetail,
  RpstrDetail,
} from '@/types/cm'

export const tssCmService = {
  // ── 게시판 / FAQ (/tss/cm/board, no.925~936) ──────────────────────────────
  // 구 `selectBoardList(kind, params)` 은 종류별 URL 이 달라 3개(notice/rpstr/sysImpv)로 분리.

  /** no.935 자주묻는질문목록조회 — MUI-CM-04-M03 (faqList/FaqListPage). */
  async selectFaqList(params: FaqListRequest): Promise<FaqListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList)
    return apiClient.post<FaqListItem[], FaqListItem[]>('/tss/cm/board/selectFaqList.do', params)
  },

  /** no.936 자주묻는질문상세 — MUI-CM-04-M03 아코디언 본문(목록 응답에 포함 시 미사용). 소비처 대기. */
  async selectFaqDtl(contsNo: string): Promise<FaqListItem> {
    if (USE_MOCK) return mockDelay(MOCK_CM.faqList[0])
    return apiClient.post<FaqListItem, FaqListItem>('/tss/cm/board/selectFaqDtl.do', { contsNo })
  },

  /** no.925 공지사항목록조회 — MUI-CM-04-M01 (noticeList/board/BoardListView). 구 `selectBoardList('notice')`. */
  async selectNoticeList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeList)
    return apiClient.post<BoardListItem[], BoardListItem[]>(
      '/tss/cm/board/selectNoticeList.do',
      params,
    )
  },

  /** no.926 공지사항상세조회 — MUI-CM-04-M02. 구 `selectNoticeDetail`. */
  async selectNoticeDtl(contsNo: string): Promise<NoticeDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.noticeDetail)
    return apiClient.post<NoticeDetail, NoticeDetail>('/tss/cm/board/selectNoticeDtl.do', {
      contsNo,
    })
  },

  /** no.930 자료실목록조회 — MUI-CM-04-M25 (rpstrList/board/BoardListView). 구 `selectBoardList('rpstr')`. */
  async selectRpstrList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrList)
    return apiClient.post<BoardListItem[], BoardListItem[]>(
      '/tss/cm/board/selectRpstrList.do',
      params,
    )
  },

  /** no.931 자료실상세조회 — MUI-CM-04-M26. 구 `selectRpstrDetail`. */
  async selectRpstrDtl(contsNo: string): Promise<RpstrDetail> {
    if (USE_MOCK) return mockDelay(MOCK_CM.rpstrDetail)
    return apiClient.post<RpstrDetail, RpstrDetail>('/tss/cm/board/selectRpstrDtl.do', { contsNo })
  },

  /**
   * 시스템개선 목록 — 구 `selectBoardList('sysImpv')`.
   * TODO(백엔드 확정): /tss/cm/board 실 API 는 공지/자료실/FAQ 3종뿐 — 시스템개선 게시판 URL 임시.
   */
  async selectSysImpvList(params: BoardListRequest): Promise<BoardListItem[]> {
    if (USE_MOCK) return mockDelay(MOCK_CM.sysImpvList)
    return apiClient.post<BoardListItem[], BoardListItem[]>('/v1/cms/boards/sysImpv', params)
  },
}
