// 자료실(일반/수요부대별/계약관련서식) + 시스템개선안내 목업 — 목록과 상세가 공유한다.
// 상세의 이전글/다음글은 이 목록에서 현재 글의 앞/뒤로 계산. 추후 API(cmService) 로 교체.
import { inflateRpstr } from './rpstrBoard'
import type {
  MockRpstrListItem,
  MockRpstrDetail,
  MockSysImpvListItem,
  MockSysImpvDetail,
} from '@/types/mock/cm'

// ── 일반자료실 (MUI-CM-04-M25/M26) ──────────────────────────────────────────
export const RPSTR_SEEDS: MockRpstrListItem[] = [
  { no: 1, contsNo: '000101', bizFldCd: '서식', rpstrTtl: '전자입찰 참가신청서 서식 (2026년 개정)', fileCnt: 2, rgtrId: '관리자', regDt: '2026-05-11', inqNocs: 1320 },
  { no: 2, contsNo: '000102', bizFldCd: '매뉴얼', rpstrTtl: '모바일 앱 사용자 매뉴얼 (v1.2)', fileCnt: 1, rgtrId: '정보화팀', regDt: '2026-05-09', inqNocs: 845 },
  { no: 3, contsNo: '000103', bizFldCd: '서식', rpstrTtl: '청렴계약 이행서약서 양식', fileCnt: 1, rgtrId: '감사담당관', regDt: '2026-05-07', inqNocs: 512 },
  { no: 4, contsNo: '000104', bizFldCd: '자료', rpstrTtl: '조달 절차 안내 리플릿 (배포용)', fileCnt: 3, rgtrId: '홍보담당관', regDt: '2026-05-05', inqNocs: 297 },
]
export const RPSTR_MOCK: MockRpstrListItem[] = inflateRpstr(RPSTR_SEEDS, 100)

// ── 수요부대별자료실 (MUI-CM-04-M27/M28) ────────────────────────────────────
export const DMDFRC_RPSTR_SEEDS: MockRpstrListItem[] = [
  { no: 1, contsNo: '000101', bizFldCd: '서식', rpstrTtl: '수요부대 조달요구서 표준 양식', fileCnt: 2, rgtrId: '군수참모부', regDt: '2026-05-10', inqNocs: 640 },
  { no: 2, contsNo: '000102', bizFldCd: '자료', rpstrTtl: '부대별 소요 품목 분류 기준표', fileCnt: 1, rgtrId: '군수관리과', regDt: '2026-05-08', inqNocs: 388 },
  { no: 3, contsNo: '000103', bizFldCd: '매뉴얼', rpstrTtl: '수요부대 조달요구 시스템 이용 가이드', fileCnt: 3, rgtrId: '정보화팀', regDt: '2026-05-06', inqNocs: 274 },
]
export const DMDFRC_RPSTR_MOCK: MockRpstrListItem[] = inflateRpstr(DMDFRC_RPSTR_SEEDS, 100)

// ── 계약관련서식자료실 (MUI-CM-04-M29/M30) ──────────────────────────────────
export const CTRT_RPSTR_SEEDS: MockRpstrListItem[] = [
  { no: 1, contsNo: '000101', bizFldCd: '서식', rpstrTtl: '표준 계약서(물품) 서식', fileCnt: 1, rgtrId: '계약제도과', regDt: '2026-05-11', inqNocs: 1580 },
  { no: 2, contsNo: '000102', bizFldCd: '서식', rpstrTtl: '계약변경(변경계약) 신청서 양식', fileCnt: 2, rgtrId: '계약관리과', regDt: '2026-05-09', inqNocs: 903 },
  { no: 3, contsNo: '000103', bizFldCd: '서식', rpstrTtl: '하자보수보증금 납부확인서 양식', fileCnt: 1, rgtrId: '계약관리과', regDt: '2026-05-07', inqNocs: 447 },
  { no: 4, contsNo: '000104', bizFldCd: '자료', rpstrTtl: '계약일반조건·특수조건 해설 자료', fileCnt: 3, rgtrId: '계약제도과', regDt: '2026-05-04', inqNocs: 662 },
]
export const CTRT_RPSTR_MOCK: MockRpstrListItem[] = inflateRpstr(CTRT_RPSTR_SEEDS, 100)

// 자료실 목록 아이템 → 상세(dm_rpstrInfo). 담당부서(deptNm)·내용(contsCn)은 목록에 없어 목업 보완.
// 추후 API: tssCmService.selectRpstrDtl(contsNo).
export function toRpstrDetail(item: MockRpstrListItem, deptNm = '자료실운영팀'): MockRpstrDetail {
  return {
    contsNo: item.contsNo,
    rpstrTtl: item.rpstrTtl,
    wrtrNm: item.rgtrId,
    deptNm,
    bizFldCd: item.bizFldCd,
    contsCn:
      `"${item.rpstrTtl}" 관련 자료입니다.\n\n` +
      '첨부파일을 내려받아 활용하시기 바랍니다.\n' +
      '문의사항은 고객센터(1577-1118)로 연락 주시기 바랍니다.',
    files: Array.from({ length: item.fileCnt }, (_, i) => ({
      fileSn: String(i + 1),
      fileName: `첨부파일_${i + 1}.hwp`,
      fileSize: '786KB',
    })),
  }
}

// ── 시스템개선안내 (MUI-CM-04-M31/M32) ──────────────────────────────────────
export const SYSIMPV_SEEDS: MockSysImpvListItem[] = [
  { no: 1, contsNo: '000101', bizFldCd: '개선', bbsTtl: '입찰공고 목록 검색 속도 개선 적용 안내', fileCnt: 1, wrtrNm: '정보화팀', regDt: '2026-05-11', inqCnt: 512 },
  { no: 2, contsNo: '000102', bizFldCd: '개선', bbsTtl: '모바일 알림 수신 설정 기능 추가', fileCnt: 1, wrtrNm: '정보화팀', regDt: '2026-05-08', inqCnt: 337 },
  { no: 3, contsNo: '000103', bizFldCd: '개선', bbsTtl: '전자서명 인증 오류 개선 사항 반영', fileCnt: 2, wrtrNm: '인증관리팀', regDt: '2026-05-05', inqCnt: 221 },
]
export const SYSIMPV_MOCK: MockSysImpvListItem[] = Array.from({ length: 100 }, (_, i) => {
  const base = SYSIMPV_SEEDS[i % SYSIMPV_SEEDS.length]
  return { ...base, no: i + 1, contsNo: String(101 + i).padStart(6, '0') }
})

// 시스템개선안내 목록 아이템 → 상세(dm_rpstrInfo). 담당부서(tkcgDeptNm)·게시기간·내용은 목업 보완.
export function toSysImpvDetail(item: MockSysImpvListItem): MockSysImpvDetail {
  return {
    contsNo: item.contsNo,
    bbsTtl: item.bbsTtl,
    wrtrNm: item.wrtrNm,
    tkcgDeptNm: '정보화팀',
    bizFldCd: item.bizFldCd,
    pstgBgngYmd: '2026-05-01',
    pstgEndYmd: '2026-05-31',
    bbsCn:
      `"${item.bbsTtl}"\n\n` +
      '시스템 개선 사항을 안내드립니다. 자세한 내용은 첨부파일을 참고하여 주시기 바랍니다.\n' +
      '문의사항은 고객센터(1577-1118)로 연락 주시기 바랍니다.',
    files: Array.from({ length: item.fileCnt }, (_, i) => ({
      fileSn: String(i + 1),
      fileName: `첨부파일_${i + 1}.hwp`,
      fileSize: '786KB',
    })),
  }
}
