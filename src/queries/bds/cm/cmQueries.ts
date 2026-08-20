// 공통관리(CM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: cmService(services/bds/cm.ts) · cmQueries(이 파일) · cmKeys(cmKeys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = cmKeys(함수명 동일).
// 조회 = useQuery 훅 · 저장/제출 = useMutation 훅(2026-07-30 확정 — 페이지의 서비스 직접 import 금지).
import { useMutation, useQuery } from '@tanstack/react-query'
import { cmService } from '@/services/bds/cm'
import { cmKeys } from '@/queries/bds/cm/cmKeys'

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
}
