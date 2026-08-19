// 대금청구/사후(WM) 도메인 Query 훅 — frontend-architecture.md §7.2 (services 1:1).
// 3자 대칭: wmService(services/bds/wm.ts) · wmQueries(이 파일) · wmKeys(keys.ts).
// 훅명 = use + 서비스 함수명 · 쿼리키 = keys.ts(함수명 동일).
import { useQuery } from '@tanstack/react-query'
import { wmService } from '@/services/bds/wm'
import { wmKeys } from '@/queries/bds/wm/wmKeys'
import type {
  PymtClmIntgListRequest,
  PymtClmPrgrsPrstRequest,
  RtnPymtDfryInfoRequest,
} from '@/types/wm'

export const wmQueries = {
  /** 대금청구통합목록(M01) — 키워드 세부 필터/더보기 페이징은 페이지 클라이언트 로직 유지(서버 전환 시 req 로 이행). */
  useSelectPymtClmIntgList(req: PymtClmIntgListRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmIntgList(req),
      queryFn: () => wmService.selectPymtClmIntgList(req),
    })
  },

  /** 대금청구신청목록(P13) — 바텀시트 열릴 때만 조회. */
  useSelectPymtClmAplyList(ctrtNo: string, enabled: boolean) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmAplyList(ctrtNo),
      queryFn: () => wmService.selectPymtClmAplyList(ctrtNo),
      enabled: Boolean(ctrtNo) && enabled,
    })
  },

  /** 선금신청서상세(M02) — 목록 state 는 placeholder 로 쓰지 않음(필드 구성 상이). */
  useSelectPrpayApfrDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPrpayApfrDtl(id),
      queryFn: () => wmService.selectPrpayApfrDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 선금 세부신청내역(T02). */
  useSelectPrpayAplyDsctns(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPrpayAplyDsctns(id),
      queryFn: () => wmService.selectPrpayAplyDsctns(id),
      enabled: Boolean(id),
    })
  },

  /** 착·중도금신청서상세(M03). */
  useSelectDpsmnItrpyApfrDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectDpsmnItrpyApfrDtl(id),
      queryFn: () => wmService.selectDpsmnItrpyApfrDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 착·중도금 세부신청내역(T04). */
  useSelectDpsmnItrpyAplyDsctns(id: string) {
    return useQuery({
      queryKey: wmKeys.selectDpsmnItrpyAplyDsctns(id),
      queryFn: () => wmService.selectDpsmnItrpyAplyDsctns(id),
      enabled: Boolean(id),
    })
  },

  /** 지급상태(T23, 상세 공용 탭). */
  useSelectGiveSttsList(id: string) {
    return useQuery({
      queryKey: wmKeys.selectGiveSttsList(id),
      queryFn: () => wmService.selectGiveSttsList(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구 상세(중앙조달, M05). */
  useSelectCenterPrcmPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectCenterPrcmPymtClmDtl(id),
      queryFn: () => wmService.selectCenterPrcmPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(부대조달, M06). */
  useSelectSbsdPrcmPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectSbsdPrcmPymtClmDtl(id),
      queryFn: () => wmService.selectSbsdPrcmPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(공사, M07). */
  useSelectCstrnPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectCstrnPymtClmDtl(id),
      queryFn: () => wmService.selectCstrnPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구상세(기성대가, M08). */
  useSelectPxcndCstPymtClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectPxcndCstPymtClmDtl(id),
      queryFn: () => wmService.selectPxcndCstPymtClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 사후정산청구상세(M13). */
  useSelectEpfcClclnClmDtl(id: string) {
    return useQuery({
      queryKey: wmKeys.selectEpfcClclnClmDtl(id),
      queryFn: () => wmService.selectEpfcClclnClmDtl(id),
      enabled: Boolean(id),
    })
  },

  /** 대금청구진행현황(M11). */
  useSelectPymtClmPrgrsPrstList(req: PymtClmPrgrsPrstRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectPymtClmPrgrsPrstList(req),
      queryFn: () => wmService.selectPymtClmPrgrsPrstList(req),
    })
  },

  /** 대금지불정보(반납)(M10). */
  useSelectRtnPymtDfryInfoList(req: RtnPymtDfryInfoRequest = {}) {
    return useQuery({
      queryKey: wmKeys.selectRtnPymtDfryInfoList(req),
      queryFn: () => wmService.selectRtnPymtDfryInfoList(req),
    })
  },
}
