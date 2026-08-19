// 계약(CT) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/ct.ts)과 통일.
// 구조: ['ct', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['ct'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type { CncltnRmvListRequest, CtCtrdocType, CtrtIntgListRequest } from '@/types/ct'

export const ctKeys = {
  selectCtrtIntgList: (req: CtrtIntgListRequest) => ['ct', 'selectCtrtIntgList', req] as const,
  selectCtrtPrgrsDtl: (id: string) => ['ct', 'selectCtrtPrgrsDtl', id] as const,
  selectCtrtBzentys: (id: string) => ['ct', 'selectCtrtBzentys', id] as const,
  selectCtrtRjctRsns: (id: string) => ['ct', 'selectCtrtRjctRsns', id] as const,
  selectCtrtAdocs: (id: string) => ['ct', 'selectCtrtAdocs', id] as const,
  selectCtrtGrntes: (id: string) => ['ct', 'selectCtrtGrntes', id] as const,
  selectCtrtStmtx: (id: string) => ['ct', 'selectCtrtStmtx', id] as const,
  selectCmdtyCtrtDtst: (id: string) => ['ct', 'selectCmdtyCtrtDtst', id] as const,
  selectCstrnCtrtPrgrsDtl: (id: string) => ['ct', 'selectCstrnCtrtPrgrsDtl', id] as const,
  selectCtrtFlws: (id: string) => ['ct', 'selectCtrtFlws', id] as const,
  selectCmdtyGnrlCtrdocDtl: (id: string) => ['ct', 'selectCmdtyGnrlCtrdocDtl', id] as const,
  selectCmdtyMdfcnCtrdocDtl: (id: string) => ['ct', 'selectCmdtyMdfcnCtrdocDtl', id] as const,
  selectCmdtyMdfcnCtrdocDtst: (id: string) => ['ct', 'selectCmdtyMdfcnCtrdocDtst', id] as const,
  selectCtrtLastDtst: (id: string) => ['ct', 'selectCtrtLastDtst', id] as const,
  selectCtrtSpclCnd: (id: string) => ['ct', 'selectCtrtSpclCnd', id] as const,
  selectCmdtyCtrdocDtl: (id: string, type: CtCtrdocType) =>
    ['ct', 'selectCmdtyCtrdocDtl', { id, type }] as const,
  selectCmdtyCtrdocDtst: (id: string, type: CtCtrdocType) =>
    ['ct', 'selectCmdtyCtrdocDtst', { id, type }] as const,
  selectCstrnCtrdocDtl: (id: string) => ['ct', 'selectCstrnCtrdocDtl', id] as const,
  selectCtrtJntGrntes: (id: string) => ['ct', 'selectCtrtJntGrntes', id] as const,
  selectPymtDfryInfoList: ['ct', 'selectPymtDfryInfoList'] as const,
  selectPymtDfryInfoInq: (ctrtNo: string) => ['ct', 'selectPymtDfryInfoInq', ctrtNo] as const,
  selectCtrtPrgrsStts: (id: string) => ['ct', 'selectCtrtPrgrsStts', id] as const,
  selectOvsCtrtDtl: (id: string) => ['ct', 'selectOvsCtrtDtl', id] as const,
  selectOvsBacntInfo: (id: string) => ['ct', 'selectOvsBacntInfo', id] as const,
  selectOvsCtrtDtst: (id: string) => ['ct', 'selectOvsCtrtDtst', id] as const,
  selectOvsCtrtAdocs: (id: string) => ['ct', 'selectOvsCtrtAdocs', id] as const,
  selectOvsCmbzCtrdocDtl: (id: string) => ['ct', 'selectOvsCmbzCtrdocDtl', id] as const,
  selectOvsCmbzDtst: (id: string) => ['ct', 'selectOvsCmbzDtst', id] as const,
  selectOvsCmbzTrgt: (id: string) => ['ct', 'selectOvsCmbzTrgt', id] as const,
  selectOvsCmbzCtrtDtst: (id: string) => ['ct', 'selectOvsCmbzCtrtDtst', id] as const,
  selectCncltnRmvList: (req: CncltnRmvListRequest) => ['ct', 'selectCncltnRmvList', req] as const,
  selectCmdtyCncltnRmvDtl: (id: string) => ['ct', 'selectCmdtyCncltnRmvDtl', id] as const,
  selectCmdtyCncltnRmvBzentys: (id: string) => ['ct', 'selectCmdtyCncltnRmvBzentys', id] as const,
  selectCmdtyCncltnRmvNoti: (id: string) => ['ct', 'selectCmdtyCncltnRmvNoti', id] as const,
  selectCncltnRmvGnrlCtrtDtl: (id: string, type: CtCtrdocType) =>
    ['ct', 'selectCncltnRmvGnrlCtrtDtl', { id, type }] as const,
  selectCncltnRmvGnrlCtrtDtst: (id: string, type: CtCtrdocType) =>
    ['ct', 'selectCncltnRmvGnrlCtrtDtst', { id, type }] as const,
  selectCncltnRmvSpcl: (id: string) => ['ct', 'selectCncltnRmvSpcl', id] as const,
  selectCncltnRmvMdfcnCtrtDtl: (id: string) => ['ct', 'selectCncltnRmvMdfcnCtrtDtl', id] as const,
  selectCncltnRmvMdfcnCtrtDtst: (id: string) => ['ct', 'selectCncltnRmvMdfcnCtrtDtst', id] as const,
  selectCstrnCncltnRmvDtl: (id: string) => ['ct', 'selectCstrnCncltnRmvDtl', id] as const,
  selectCstrnCncltnRmvAdocs: (id: string) => ['ct', 'selectCstrnCncltnRmvAdocs', id] as const,
}
