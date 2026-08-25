// 공통관리(CM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: cmService(services/cbs/cm.ts) · cmQueries(이 파일) · cmKeys(cmKeys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = cmKeys(함수명 동일).
// 조회 = useQuery 훅 · 저장/제출 = useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
import { useMutation, useQuery } from '@tanstack/react-query'
import { cmService } from '@/services/cbs/cm'
import { cmKeys } from '@/queries/cbs/cm/cmKeys'
import type { MockLoginRequest, MockRegisterIntgAcntRequest } from '@/types/mock/domain'

export const cmQueries = {
  /**
   * no.686 실적증명서제출목록조회 — 제출 협회 목록(dl_sbmsnAsctnList).
   * slide336 On-Load(scwin.onpageload). 제출 시트가 열릴 때만 조회한다(enabled).
   */
  useSelectPrfmncPrdocSbmsnList(prfmncRcptNo: string, enabled = true) {
    return useQuery({
      queryKey: cmKeys.selectPrfmncPrdocSbmsnList(prfmncRcptNo),
      queryFn: () => cmService.selectPrfmncPrdocSbmsnList(prfmncRcptNo),
      enabled: enabled && !!prfmncRcptNo,
    })
  },

  /** 통합검색(전체메뉴 M12) — 이벤트성 조회라 mutation 훅으로 노출. */
  useSelectSearchAll() {
    return useMutation({ mutationFn: (keyword: string) => cmService.selectSearchAll(keyword) })
  },

  /** no.685 실적증명서제출(MUI-CM-04-P20). */
  useProcPrfmncPrdocSbmsn() {
    return useMutation({
      mutationFn: (params: { prfmncRcptNo: string; sbmsnSttsNms: string[] }) =>
        cmService.procPrfmncPrdocSbmsn(params),
    })
  },

  /** 실적증명서 제출취소(MUI-CM-04-P20) — 비고(rmrkCn)에 취소사유를 담아 재전송. */
  useCancelSubmitPrfmncPrdoc() {
    return useMutation({
      mutationFn: (params: {
        prfmncRcptNo: string
        items: { sbmsnSttsNm: string; rmrkCn?: string }[]
      }) => cmService.cancelSubmitPrfmncPrdoc(params),
    })
  },

  // ── 인증(구 authQueries — 2026-08-24 cm 흡수) ──────────────────────────────
  // 인증 흐름은 전부 사용자 액션 시점 실행(이벤트성)이라 useMutation 훅으로만 구성.

  /** no.650 로그인(아이디/비밀번호) — MUI-MS-02 IdPswdLogin. */
  useProcIdPswdLogin() {
    return useMutation({ mutationFn: (req: MockLoginRequest) => cmService.procIdPswdLogin(req) })
  },

  /** 업체 선택 후 로그인 확정(복수 업체 계정). */
  useLoginWith() {
    return useMutation({ mutationFn: (bzentyCd: string) => cmService.loginWith(bzentyCd) })
  },

  /**
   * no.657 인증수단 로그인(간편/공동/금융/모바일신분증) — 생체인증 확정(BioInfoCertRslt).
   * 현재 소비처(생체인증)는 수단을 고르지 않아 인자 없이 호출한다 — 수단 선택 화면이 생기면 certSeCd 를 받는다.
   */
  useProcCertLogin() {
    return useMutation({ mutationFn: () => cmService.procCertLogin() })
  },

  /** 통합계정 전환 대상 조회(NewIdPwReg On-Load) — 이벤트 시점 조회라 mutation 노출. */
  useSelectIntgAcntTarget() {
    return useMutation({ mutationFn: () => cmService.selectIntgAcntTarget() })
  },

  /** 통합계정 ID 중복확인(NewIdPwReg). */
  useCheckIntgAcntId() {
    return useMutation({ mutationFn: (userId: string) => cmService.checkIntgAcntId(userId) })
  },

  /** no.658 통합로그인계정생성(NewIdPwReg 제출). */
  useInsertIntgLoginInfo() {
    return useMutation({
      mutationFn: (req: MockRegisterIntgAcntRequest) => cmService.insertIntgLoginInfo(req),
    })
  },
}
