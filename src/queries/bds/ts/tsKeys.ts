// 업무지원(TS) 도메인 쿼리키 — 키명 = 서비스 함수명(services/bds/ts.ts)과 통일.
// 구조: ['ts', 함수명, 파라미터] 3단 — 도메인 전체 무효화(['ts'])·함수 prefix 무효화 모두 가능.
// 훅 파일(queries.ts)과 분리 이유: mutation 무효화가 파일 경계를 넘어도 순환 import 없이 키만 참조.
import type {
  BfhdLoiListRequest,
  TxivCtrtListRequest,
  TxivPrgrsPrstRequest,
} from '@/types/ts'

export const tsKeys = {
  selectBfhdLoiList: (req: BfhdLoiListRequest) => ['ts', 'selectBfhdLoiList', req] as const,
  /** 목록 prefix — 의견 저장/제출 후 무효화용. */
  selectBfhdLoiListAll: ['ts', 'selectBfhdLoiList'] as const,
  selectBfhdLoiDtl: (id: string) => ['ts', 'selectBfhdLoiDtl', id] as const,
  selectBfhdLoiSpcfctList: (id: string) => ['ts', 'selectBfhdLoiSpcfctList', id] as const,
  selectCtrtList: (req: TxivCtrtListRequest) => ['ts', 'selectCtrtList', req] as const,
  selectTxivList: (ctrtNo: string) => ['ts', 'selectTxivList', ctrtNo] as const,
  selectTxivDtl: (id: string) => ['ts', 'selectTxivDtl', id] as const,
  selectTxivPrgrsPrstList: (req: TxivPrgrsPrstRequest) =>
    ['ts', 'selectTxivPrgrsPrstList', req] as const,
}
