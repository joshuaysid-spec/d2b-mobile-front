// 입찰진행상세 - 입찰참가신청조회 공동수급업체 (MUI-BD-04-T05, 설계서 영문ID BidPrtcpAperDtl_Tab5 · slide187).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '5. 공동수급업체' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M10)의 업체명 검색/출자비율 입력·[추가하기]가 모두 제출된 값 표시로 바뀐다.
// 구성: 업체 카드 반복(대표1 + 구성N) → 합계(입찰보증금액/투찰금액) → 안내사항.
//   - 단일 업체면 동의여부 행 숨김(설계서 slide187).
//   - 공동분담업종·시공능력평가액은 공사 전용 — 물품이면 숨김(설계서 slide121 비고).
// 항목명은 데이터영역 dlt_jsdBzentyList(slide121) 그대로.
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { BidPrgrsItem, JsdBzentyAply } from '@/types/mock/bd'

// 최대 협정업체 수(대표 + 구성) — 설계서 slide187.
const MAX_BZENTY = 3

// 제출된 공동수급업체 목록 목업(dlt_jsdBzentyList) — 값은 설계서 slide187 형식 그대로.
const MOCK_JSD_BZENTY: JsdBzentyAply[] = [
  {
    id: 'jsd1',
    jsdBzentyNm: '대표',
    bzentyNm: '플레이콩',
    jsdShNm: '공동이행',
    cnstpNm: '제조',
    invstRt: '60',
    bidGrnteAmt: '619,520,000 원',
    depsPayMthdCd: '계좌이체',
    cnstAbltEvlAmt: '1,200,000,000 원',
  },
  {
    id: 'jsd2',
    jsdBzentyNm: '구성1',
    bzentyNm: '구성업체콩콩',
    jsdShNm: '공동이행',
    cnstpNm: '제조',
    invstRt: '20',
    bidGrnteAmt: '300,000 원',
    depsPayMthdCd: '전자보증서',
    cnstAbltEvlAmt: '5,000,000 원',
    argeYn: 'Y',
  },
  {
    id: 'jsd3',
    jsdBzentyNm: '구성2',
    bzentyNm: '사피엔스콩',
    jsdShNm: '공동이행',
    cnstpNm: '제조',
    invstRt: '20',
    bidGrnteAmt: '10,000,000 원',
    depsPayMthdCd: '전자보증서',
    cnstAbltEvlAmt: '5,000,000 원',
    argeYn: 'N',
  },
]

// 합계(설계서 slide187 하단) — 신청서 전체의 입찰보증금액/투찰금액.
const MOCK_TOTAL = { bidGrnteAmt: '629,820,000 원', bdngAmt: '12,596,400,000 원' }

export function BidPrtcpAperDtl_Tab5({ detail }: { detail: BidPrgrsItem }) {
  const companies = MOCK_JSD_BZENTY
  // 공동분담업종·시공능력평가액은 공사 전용(설계서 slide121 비고) — 물품이면 숨김.
  const isCnstwk = detail.taskSeNm === '공사'
  // 단일 업체면 동의여부 행 숨김(설계서 slide187).
  const isSingle = companies.length === 1

  const companyRows = (c: JsdBzentyAply): TableRow[] => {
    const rows: TableRow[] = [
      { label: '구분', value: c.jsdBzentyNm },
      { label: '공동수급업체', value: c.bzentyNm },
      { label: '이행방식', value: c.jsdShNm },
      ...(isCnstwk ? ([{ label: '공동분담업종', value: c.cnstpNm }] as TableRow[]) : []),
      { label: '출자비율', value: `${c.invstRt} %`, type: 'number' },
      { label: '입찰보증금', value: c.bidGrnteAmt, type: 'number' },
      { label: '납부방법', value: c.depsPayMthdCd },
      ...(isCnstwk
        ? ([{ label: '시공능력평가액', value: c.cnstAbltEvlAmt, type: 'number' }] as TableRow[])
        : []),
    ]
    if (isSingle) return rows
    // 동의여부(argeYn) — 표시 전용. 대표업체는 값이 없으므로 행을 두지 않는다.
    if (c.argeYn) rows.push({ label: '동의여부', value: c.argeYn === 'Y' ? '동의' : '미동의' })
    return rows
  }

  const totalRows: TableRow[] = [
    { label: '입찰보증금액', value: MOCK_TOTAL.bidGrnteAmt, type: 'number' },
    { label: '투찰금액', value: MOCK_TOTAL.bdngAmt, type: 'number' },
  ]

  return (
    <>
      <SectionTitle as="h3" topDivider>
        공동수급업체 - 최대 협정업체 수 :{' '}
        <span className="text-krds-text-danger">{MAX_BZENTY}</span> (대표업체+구성업체수)
      </SectionTitle>

      <div className="flex flex-col gap-krds-6 px-4 py-4">
        {companies.map((c) => (
          <Table key={c.id} rows={companyRows(c)} />
        ))}
        <Table rows={totalRows} />
      </div>

      {/* 안내사항 — 탭 최하단 고정(전 탭 공통). 두번째 항목은 설계서상 강조(빨강). */}
      <Infobox
        title="안내사항"
        items={[
          '공동수급인 경우 공동수급업체란에 입찰참가신청업체(대표업체 및 구성업체)도 [추가] 시켜야 합니다.',
          <span key="attach" className="text-krds-text-danger">
            구성업체 제출서류는 대표업체가 참가신청서 제출시 첨부해야 합니다.
          </span>,
        ]}
      />
    </>
  )
}
BidPrtcpAperDtl_Tab5.displayName = 'BidPrtcpAperDtl_Tab5'
