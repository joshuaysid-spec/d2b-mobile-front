// 계약(CT) 도메인 쿼리키 — 키명 = 서비스 함수명(services/cts/ct.ts)과 통일.
// 구조: ['ct', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['ct'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type { MockCncltnRmvListRequest, MockCtCtrdocType, MockCtrtIntgListRequest } from '@/types/mock/ct'

export const ctKeys = {
  selectCtrtIntgList: (req: MockCtrtIntgListRequest) => ['ct', 'selectCtrtIntgList', req] as const,
  selectCtrtPrgrsDtl: (id: string) => ['ct', 'selectCtrtPrgrsDtl', id] as const,
  selectCtrtBzentys: (id: string) => ['ct', 'selectCtrtBzentys', id] as const,
  selectCtrtRjctRsns: (id: string) => ['ct', 'selectCtrtRjctRsns', id] as const,
  selectCtrtAdocs: (id: string) => ['ct', 'selectCtrtAdocs', id] as const,
  selectCtrtGrntes: (id: string) => ['ct', 'selectCtrtGrntes', id] as const,
  selectCtrtStmtx: (id: string) => ['ct', 'selectCtrtStmtx', id] as const,
  selectCtrtDtstInq: (id: string) => ['ct', 'selectCtrtDtstInq', id] as const,
  selectCstrnCtrtPrgrsDtl: (id: string) => ['ct', 'selectCstrnCtrtPrgrsDtl', id] as const,
  selectCtrtFlws: (id: string) => ['ct', 'selectCtrtFlws', id] as const,
  selectCtrdocDtlInq: (id: string) => ['ct', 'selectCtrdocDtlInq', id] as const,
  selectCmdtyMdfcnCtrdocDtl: (id: string) => ['ct', 'selectCmdtyMdfcnCtrdocDtl', id] as const,
  selectCmdtyMdfcnCtrdocDtst: (id: string) => ['ct', 'selectCmdtyMdfcnCtrdocDtst', id] as const,
  selectCtrtLastDtst: (id: string) => ['ct', 'selectCtrtLastDtst', id] as const,
  selectCtrtSpclCnd: (id: string) => ['ct', 'selectCtrtSpclCnd', id] as const,
  selectCmdtyCtrdocDtl: (id: string, type: MockCtCtrdocType) =>
    ['ct', 'selectCmdtyCtrdocDtl', { id, type }] as const,
  selectCmdtyCtrdocDtst: (id: string, type: MockCtCtrdocType) =>
    ['ct', 'selectCmdtyCtrdocDtst', { id, type }] as const,
  selectCstrnCtrdocDtl: (id: string) => ['ct', 'selectCstrnCtrdocDtl', id] as const,
  selectCtrtJntGrntes: (id: string) => ['ct', 'selectCtrtJntGrntes', id] as const,
  selectPymtDfryInfoListInq: ['ct', 'selectPymtDfryInfoListInq'] as const,
  selectPymtDfryInfoInq: (ctrtNo: string) => ['ct', 'selectPymtDfryInfoInq', ctrtNo] as const,
  selectCtrtPrgrsSttsCdInq: (id: string) => ['ct', 'selectCtrtPrgrsSttsCdInq', id] as const,
  selectCtrdocDtl: (id: string) => ['ct', 'selectCtrdocDtl', id] as const,
  selectBacntInfo: (id: string) => ['ct', 'selectBacntInfo', id] as const,
  selectWtgr: (id: string) => ['ct', 'selectWtgr', id] as const,
  selectStmtxPayList: (id: string) => ['ct', 'selectStmtxPayList', id] as const,
  selectCtrtDtstList: (id: string) => ['ct', 'selectCtrtDtstList', id] as const,
  selectCtrtDcmntList: (id: string) => ['ct', 'selectCtrtDcmntList', id] as const,
  selectCmbzCtrdocDtlInfo: (id: string) => ['ct', 'selectCmbzCtrdocDtlInfo', id] as const,
  selectCmbzCtrtDtstInfo: (id: string) => ['ct', 'selectCmbzCtrtDtstInfo', id] as const,
  selectOvsCmbzTrgt: (id: string) => ['ct', 'selectOvsCmbzTrgt', id] as const,
  selectOvsCmbzCtrtDtst: (id: string) => ['ct', 'selectOvsCmbzCtrtDtst', id] as const,
  selectCtrtCncltnRmvListInq: (req: MockCncltnRmvListRequest) =>
    ['ct', 'selectCtrtCncltnRmvListInq', req] as const,
  selectCtrtCncltnRmvDtlInfoInq: (id: string) =>
    ['ct', 'selectCtrtCncltnRmvDtlInfoInq', id] as const,
  selectCmdtyCncltnRmvBzentys: (id: string) => ['ct', 'selectCmdtyCncltnRmvBzentys', id] as const,
  selectCmdtyCncltnRmvNoti: (id: string) => ['ct', 'selectCmdtyCncltnRmvNoti', id] as const,
  selectCncltnRmvGnrlCtrtDtl: (id: string, type: MockCtCtrdocType) =>
    ['ct', 'selectCncltnRmvGnrlCtrtDtl', { id, type }] as const,
  selectCncltnRmvGnrlCtrtDtst: (id: string, type: MockCtCtrdocType) =>
    ['ct', 'selectCncltnRmvGnrlCtrtDtst', { id, type }] as const,
  selectCncltnRmvSpcl: (id: string) => ['ct', 'selectCncltnRmvSpcl', id] as const,
  selectCncltnRmvMdfcnCtrtDtl: (id: string) => ['ct', 'selectCncltnRmvMdfcnCtrtDtl', id] as const,
  selectCncltnRmvMdfcnCtrtDtst: (id: string) => ['ct', 'selectCncltnRmvMdfcnCtrtDtst', id] as const,
  selectCstrnCncltnRmvDtl: (id: string) => ['ct', 'selectCstrnCncltnRmvDtl', id] as const,
  selectCstrnCncltnRmvAdocs: (id: string) => ['ct', 'selectCstrnCncltnRmvAdocs', id] as const,
}
