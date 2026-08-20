// 이행(EX) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/ex.ts)과 통일.
// 구조: ['ex', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['ex'])·함수 prefix 무효화 모두 가능.
// (식별자가 2개인 조회 — selectInspDlvdocList(계약번호·통지번호)·기성및준공검사(계약번호·기성차수) — 만 4단.)
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type {
  InspDlvdocPrstRequest,
  InspIntgListRequest,
  OvsEstmtRqdcListRequest,
  OvsOrderRqdcListRequest,
} from '@/types/ex'

export const exKeys = {
  selectInspIntgList: (req: InspIntgListRequest) => ['ex', 'selectInspIntgList', req] as const,
  selectInspRqstDocList: (ctrtNo: string) => ['ex', 'selectInspRqstDocList', ctrtNo] as const,
  selectInspDlvdocList: (ctrtNo: string, avtsmtNo: string) =>
    ['ex', 'selectInspDlvdocList', ctrtNo, avtsmtNo] as const,
  selectInspDlvdocBscInfo: (recrdPblcnNo: string) =>
    ['ex', 'selectInspDlvdocBscInfo', recrdPblcnNo] as const,
  selectInspDlvdocDlvgdsList: (recrdPblcnNo: string) =>
    ['ex', 'selectInspDlvdocDlvgdsList', recrdPblcnNo] as const,
  selectInspDlvdocSbsdDtl: (recrdPblcnNo: string) =>
    ['ex', 'selectInspDlvdocSbsdDtl', recrdPblcnNo] as const,
  selectInspDlvdocSbsdCmdtys: (recrdPblcnNo: string) =>
    ['ex', 'selectInspDlvdocSbsdCmdtys', recrdPblcnNo] as const,
  selectPxcndCmcnInspBscInfo: (ctrtNo: string, pxcndCycl: string) =>
    ['ex', 'selectPxcndCmcnInspBscInfo', ctrtNo, pxcndCycl] as const,
  selectInspDlvdocPrstList: (req: InspDlvdocPrstRequest) =>
    ['ex', 'selectInspDlvdocPrstList', req] as const,
  selectDlvdocRsltDtl: (recrdPblcnNo: string) => ['ex', 'selectDlvdocRsltDtl', recrdPblcnNo] as const,
  selectDlvdocRsltCmdtys: (recrdPblcnNo: string) =>
    ['ex', 'selectDlvdocRsltCmdtys', recrdPblcnNo] as const,
  selectEstmtRqdcList: (req: OvsEstmtRqdcListRequest) => ['ex', 'selectEstmtRqdcList', req] as const,
  selectOvsEstmtRqdcDtl: (clmSeq: string) => ['ex', 'selectOvsEstmtRqdcDtl', clmSeq] as const,
  selectEstmtRqdcDtlList: (clmSeq: string) => ['ex', 'selectEstmtRqdcDtlList', clmSeq] as const,
  selectEstmtNtdcList: (ctrtNo?: string) => ['ex', 'selectEstmtNtdcList', ctrtNo ?? ''] as const,
  selectOvsEstmtNtdcDtl: (clmSeq: string) => ['ex', 'selectOvsEstmtNtdcDtl', clmSeq] as const,
  selectEstmtNtdcDtlList: (clmSeq: string) => ['ex', 'selectEstmtNtdcDtlList', clmSeq] as const,
  selectOrderRqdcList: (req: OvsOrderRqdcListRequest) => ['ex', 'selectOrderRqdcList', req] as const,
  selectOvsOrderRqdcDtl: (orderSeq: string) => ['ex', 'selectOvsOrderRqdcDtl', orderSeq] as const,
  selectOrderRqdcDtlList: (orderSeq: string) => ['ex', 'selectOrderRqdcDtlList', orderSeq] as const,
  selectOrderNtdcList: (ctrtNo?: string) => ['ex', 'selectOrderNtdcList', ctrtNo ?? ''] as const,
  selectOvsOrderNtdcDtl: (orderSeq: string) => ['ex', 'selectOvsOrderNtdcDtl', orderSeq] as const,
  selectOrderNtdcDtlList: (orderSeq: string) => ['ex', 'selectOrderNtdcDtlList', orderSeq] as const,
}
