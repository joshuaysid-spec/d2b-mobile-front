// 보증서정보조회 (MUI-BD-04-P76 ovsBidWtgrDtl · 설계서 slide344~345 · 데이터 slide346~347 · 이벤트 slide348).
// 입찰보증서선택(P75, OvsBidWtgrInqFullPopup) 의 '보증서 정보 보기' → 바텀시트로 조회(풀팝업→바텀시트 전환,
//   사용자 지시 2026-08-26).
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(P75)가 소유, 여기엔 본문만.
//    footer [보증서 적용/닫기]도 부모 구성(설계서 slide344).
// 구성: 보증서 정보(dl_wtgrInfo) → 보증 계약자·채권자 → 발행자(dl_IsrInfo) → 대리인 → 담당자
//   → 보증계약-주계약(dl_ctrtInfo) 섹션별 Table.
// On-Load 보증서 정보 상세 조회(scwin.onpageload)는 목업 — 선택 보증서(item) 값을 목업 위에 병합.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockOvsBidWtgrInfo, MockOvsBidWtgrItem } from '@/types/mock/bd'

// 보증서정보 상세 목업(dl_wtgrInfo + dl_IsrInfo + dl_ctrtInfo) — 설계서 slide344~345 예시값 그대로.
const MOCK_WTGR_INFO: MockOvsBidWtgrInfo = {
  wtgrNo: '0010011053320031100675611100',
  grnteAmt: '2,700,000 원',
  grnteBgngPrd: '2003-09-08 부터 2003-10-09 까지',
  grfe: '15,000 원',
  grnteAmtDepstRt: '0 %',
  ctrtBzentyNm: '(주) 선일이이앤써사',
  ctrtRprsvNm: '홍길동',
  crdtrBzentyNm: '제6950부대',
  crdtrRprsvNm: '홍길동',
  spcltMttr: '※ 해당사항없음',
  grntePhrsCn:
    '위 보증금을 전기공사공제조합법 제46조 및 제47조와 첨부된 약관에 의하여 우리 조합이 보증합니다.',
  pblcnYmd: '2024-12-09',
  // ── 발행자 데이터 영역 (dl_IsrInfo) ──────────────────────────────────────
  isrBzentyNm: '서울보증보험주식회사',
  isrRprsvNm: '홍길동',
  isrAddr: '서울특별시 종로구',
  agtNm: '김길동',
  agtDeptNm: '과천지점',
  picNm: '박길동',
  picTlno: '02-1234-5678',
  picFxno: '02-2345-6789',
  // ── 보증계약 데이터 영역 (dl_ctrtInfo, 주계약) ───────────────────────────
  bidNm: '00지역 내무생활관 전기공사',
  bdngTccrAmt: '2,700,000 원',
  bidNo: '0010011053320031100675611100',
  bdngDdlnDt: '2003-09-08',
}

// 섹션(SectionTitle + Table) 데이터 — 설계서 slide344~345 데이터영역별 그룹.
const buildSections = (info: MockOvsBidWtgrInfo): { title: string; rows: TableRow[] }[] => [
  {
    title: '보증서 정보', // dl_wtgrInfo
    rows: [
      { label: '증권번호', value: info.wtgrNo },
      { label: '보증금액', value: info.grnteAmt, type: 'number' },
      { label: '보증기간', value: info.grnteBgngPrd },
      { label: '보증료', value: info.grfe, type: 'number' },
      { label: '보증금율', value: info.grnteAmtDepstRt, type: 'number' },
      // v0.87 검토92 — 특기사항/보증문/발행일자 행을 보증계약자 영역에서 이동
      { label: '특기사항', value: info.spcltMttr },
      { label: '보증문', value: info.grntePhrsCn },
      { label: '발행일자', value: info.pblcnYmd },
    ],
  },
  {
    title: '보증 계약자(피보증인) 및 보증 채권자(피보험자)',
    rows: [
      { label: '보증 계약자 상호', value: info.ctrtBzentyNm },
      { label: '보증 계약자 대표자', value: info.ctrtRprsvNm },
      { label: '보증 채권자 상호', value: info.crdtrBzentyNm },
      { label: '보증 채권자 대표자', value: info.crdtrRprsvNm },
      // 특기사항/발행일자/보증문 행은 '보증서 정보' 영역으로 이동 — v0.87 검토92
    ],
  },
  {
    title: '발행자 정보', // dl_IsrInfo
    rows: [
      { label: '상호', value: info.isrBzentyNm },
      { label: '대표자', value: info.isrRprsvNm },
      { label: '주소', value: info.isrAddr },
    ],
  },
  {
    title: '대리인 정보',
    rows: [
      { label: '성명', value: info.agtNm },
      { label: '부서', value: info.agtDeptNm },
    ],
  },
  {
    title: '담당자 정보',
    rows: [
      { label: '성명', value: info.picNm },
      { label: '전화', value: info.picTlno },
      { label: 'FAX', value: info.picFxno },
    ],
  },
  {
    title: '보증계약 - 주계약', // dl_ctrtInfo
    rows: [
      { label: '입찰건명', value: info.bidNm },
      { label: '입찰금액', value: info.bdngTccrAmt, type: 'number' },
      { label: '입찰번호', value: info.bidNo },
      { label: '입찰서제출마감일자', value: info.bdngDdlnDt },
    ],
  },
]

export interface OvsBidWtgrDtlProps {
  /** 조회 대상 보증서(P75 목록에서 선택). null 이면 렌더 생략. */
  item: MockOvsBidWtgrItem | null
}

export function OvsBidWtgrDtl({ item }: OvsBidWtgrDtlProps) {
  // On-Load 보증서 정보 상세 조회 — 선택 보증서 값 병합(목업).
  // 추후 API: bdService.selectOvsBidWtgrInfo(item.wtgrNo)
  const info: MockOvsBidWtgrInfo = {
    ...MOCK_WTGR_INFO,
    ...(item && {
      wtgrNo: item.wtgrNo,
      grnteAmt: item.grnteAmt,
      crdtrRprsvNm: item.crdtrRprsvNm,
      isrRprsvNm: item.isrRprsvNm,
      bidNm: item.bidNm,
    }),
  }

  return (
    <div className="flex flex-col">
      {/* 섹션별 Table — 보증서 정보(dl_wtgrInfo) → 계약자·채권자 → 발행자(dl_IsrInfo) → 대리인
          → 담당자 → 보증계약-주계약(dl_ctrtInfo). 데이터 배열 구동(설계서 slide344~345 순서 그대로).
          px-0: BottomSheet 본문에 좌우 패딩이 이미 있어 SectionTitle 자체 px-4 를 해제(이중 패딩 방지). */}
      {buildSections(info).map((section, i) => (
        <div key={section.title}>
          <SectionTitle as="h3" topDivider={i > 0} className="px-0">
            {section.title}
          </SectionTitle>
          <div className="py-4">
            <Table rows={section.rows} />
          </div>
        </div>
      ))}
    </div>
  )
}
OvsBidWtgrDtl.displayName = 'OvsBidWtgrDtl'
