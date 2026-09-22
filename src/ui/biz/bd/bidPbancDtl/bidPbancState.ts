// 입찰공고 상세 진입 state 어댑터 — 국내(BidPbancDtlPage) · 국외(OvsBidPbancDtlPage) 공용.
//
// 상세는 navigate state 를 MockBidPbancItem 으로 단정하고 `pbancNo` 로 상세 조회를 켠다
// (api.md "목록 → 상세 데이터 전달 — navigate state 로만", placeholder 즉시 렌더 + id 조회로 확정).
// 진입 화면(통합목록·관심공고·문서함·통합검색·마이페이지·업무캘린더·연관진행)마다 항목 타입이 달라
// **넘기는 쪽**에서 이 어댑터로 변환한다. 상세 페이지는 손대지 않는다.
//
// ⚠️ 여기서 채우지 못한 필드는 빈 문자열 placeholder 다 — 상세 조회(selectPbancGnrlInfo) 응답이
//    도착하면 서버 값으로 덮인다. 따라서 화면에 잠깐 비어 보이는 것은 정상이고,
//    `pbancNo` 만 반드시 채워져야 한다(빈 값이면 `enabled: Boolean(id)` 로 조회 자체가 안 걸린다).
import type { MockBidPbancItem } from '@/types/mock/bd'

/** 전 필드 빈 값 기준틀 — 타입에 필드가 추가되면 여기서 컴파일 에러가 나 누락을 잡는다. */
const EMPTY: MockBidPbancItem = {
  rnum: '',
  prcmNo: '',
  taskSeCd: '',
  taskSeNm: '',
  bizRlmCd: '',
  taskRlmCd: '',
  bidSeCd: '',
  bidSeNm: '',
  g2bPbancNoOd: '',
  pbancSeCd: '',
  pbancSeNm: '',
  drctnYr: '',
  pbancNo: '',
  pbancOd: '',
  pbancYmd: '',
  instBidPbancNo: '',
  bidPbancOd: '',
  intgRfrncNo: '',
  jdgmtNo: '',
  anmtNum: '',
  bizNm: '',
  deptCd: '',
  deptNm: '',
  prchsDmndNo: '',
  ctrtMthdCd: '',
  ctrtMthdNm: '',
  bidMthdCd: '',
  bidMthdNm: '',
  bidRegDdlnDt: '',
  tndrSbmsnDdlnDt: '',
  bdopnDt: '',
  bsicStat: '',
  bidPrtcpQlfcYn: '',
  bsicExpt: '',
  bsicExptMsg: '',
  bidShpSeCd: '',
  bidShpSeNm: '',
  pbancRtrcnYn: '',
  bidSeNmText: '',
  g2bPbancNoOdText: '',
  bidRegDdlnDtText: '',
  ctrtMthdNmText: '',
  pbancYmdText: '',
}

/**
 * 목록 항목에서 뽑아낸 필드만 채워 상세가 기대하는 아이템을 만든다(나머지는 빈 값 placeholder).
 * 호출 예: `navigate('/bd/bidPbancDtl', { state: toBidPbancState({ pbancNo, bizNm }) })`
 */
export function toBidPbancState(partial: Partial<MockBidPbancItem>): MockBidPbancItem {
  return { ...EMPTY, ...partial }
}

/**
 * '공고번호-차수'(예 '2026LGM000604191-01' · 'EFD0007-2')를 상세 조회 키로 분해한다.
 * 상세 조회는 차수 없는 `pbancNo` 만 보내므로(services/bds/bd.ts selectPbancGnrlInfo → `{ pbancNo }`)
 * 마지막 '-' 뒤를 차수로 떼어낸다. '-' 가 없으면 전체를 공고번호로 보고 차수는 빈 값.
 * ⚠️ 차수가 붙지 않는 항목(문서함 pbancNo '2026-0179' 등)에는 쓰지 말 것 — 공고번호가 잘린다.
 */
export function splitPbancNoOd(pbancNoCycl: string | undefined): {
  pbancNo: string
  pbancOd: string
  g2bPbancNoOd: string
} {
  const src = pbancNoCycl ?? ''
  const at = src.lastIndexOf('-')
  if (at <= 0) return { pbancNo: src, pbancOd: '', g2bPbancNoOd: src }
  return { pbancNo: src.slice(0, at), pbancOd: src.slice(at + 1), g2bPbancNoOd: src }
}
