// 이행(EX) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/ex.ts)과 통일.
// 구조: ['ex', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['ex'])·함수 prefix 무효화 모두 가능.
// (selectInspDlvdocList 만 계약번호·통지번호 2개 파라미터라 4단.)
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type {
  InspDlvdocPrstRequest,
  InspIntgListRequest,
  OvsEstmtRqdcListRequest,
  OvsOrderRqdcListRequest,
} from '@/types/ex'

export const exKeys = {
  selectInspIntgList: (req: InspIntgListRequest) => ['ex', 'selectInspIntgList', req] as const,
  selectDlvgdsAvtsmtList: (ctrtNo: string) => ['ex', 'selectDlvgdsAvtsmtList', ctrtNo] as const,
  selectInspDlvdocList: (ctrtNo: string, avtsmtNo: string) =>
    ['ex', 'selectInspDlvdocList', ctrtNo, avtsmtNo] as const,
  selectInspDlvdocDtl: (id: string) => ['ex', 'selectInspDlvdocDtl', id] as const,
  selectInspDlvdocCmdtys: (id: string) => ['ex', 'selectInspDlvdocCmdtys', id] as const,
  selectInspDlvdocSbsdDtl: (id: string) => ['ex', 'selectInspDlvdocSbsdDtl', id] as const,
  selectInspDlvdocSbsdCmdtys: (id: string) => ['ex', 'selectInspDlvdocSbsdCmdtys', id] as const,
  selectPxcndCmcnInspDtl: (id: string) => ['ex', 'selectPxcndCmcnInspDtl', id] as const,
  selectInspDlvdocPrstList: (req: InspDlvdocPrstRequest) =>
    ['ex', 'selectInspDlvdocPrstList', req] as const,
  selectDlvdocRsltDtl: (id: string) => ['ex', 'selectDlvdocRsltDtl', id] as const,
  selectDlvdocRsltCmdtys: (id: string) => ['ex', 'selectDlvdocRsltCmdtys', id] as const,
  selectOvsEstmtRqdcList: (req: OvsEstmtRqdcListRequest) =>
    ['ex', 'selectOvsEstmtRqdcList', req] as const,
  selectOvsEstmtRqdcDtl: (id: string) => ['ex', 'selectOvsEstmtRqdcDtl', id] as const,
  selectOvsEstmtRqdcItems: (id: string) => ['ex', 'selectOvsEstmtRqdcItems', id] as const,
  selectOvsEstmtNtdcList: (ctrtNo?: string) =>
    ['ex', 'selectOvsEstmtNtdcList', ctrtNo ?? ''] as const,
  selectOvsEstmtNtdcDtl: (id: string) => ['ex', 'selectOvsEstmtNtdcDtl', id] as const,
  selectOvsEstmtNtdcItems: (id: string) => ['ex', 'selectOvsEstmtNtdcItems', id] as const,
  selectOvsOrderRqdcList: (req: OvsOrderRqdcListRequest) =>
    ['ex', 'selectOvsOrderRqdcList', req] as const,
  selectOvsOrderRqdcDtl: (id: string) => ['ex', 'selectOvsOrderRqdcDtl', id] as const,
  selectOvsOrderRqdcItems: (id: string) => ['ex', 'selectOvsOrderRqdcItems', id] as const,
  selectOvsOrderNtdcList: (ctrtNo?: string) =>
    ['ex', 'selectOvsOrderNtdcList', ctrtNo ?? ''] as const,
  selectOvsOrderNtdcDtl: (id: string) => ['ex', 'selectOvsOrderNtdcDtl', id] as const,
  selectOvsOrderNtdcItems: (id: string) => ['ex', 'selectOvsOrderNtdcItems', id] as const,
}
