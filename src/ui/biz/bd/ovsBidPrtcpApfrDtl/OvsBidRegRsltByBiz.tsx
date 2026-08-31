// MUI-BD-04-P83 사업별입찰등록결과조회 — 바텀시트 콘텐츠 전용(컨테이너/footer=닫기 는 부모 페이지 소유).
// 설계서 slide360~364. 레퍼런스: 국내 기술평가결과조회 TechEvlRsltInq(읽기전용 조회 콘텐츠) — 디자인 통일.
// 구성: 공고 일반정보(dm_bscPbancInfo) + 신청업체(dm_sbtInfo) + 입찰업체(dm_splyInfo)
//   + 사업별등록결과(dl_resultList — 사업별 Table) + 더보기.
// 사업별등록결과 목록은 조회 전용 목업(설계서 slide361 예시값 형식) — 추후 API: bdService.selectBidRegRsltListByBiz.
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type {
  MockOvsBidPrtcpApfrDetail,
  MockOvsSbtInfo,
  MockOvsSplyInfo,
} from '@/types/mock/bd'

/** 사업별등록결과 (dl_resultList, slide363) */
export interface OvsBidRegRsltItem {
  no: number // 순번
  prchsDmndNo: string // 구매요청번호
  bizNm: string // 사업명
  cfmtnRslt: string // 등록결과 (등록심사중/등록확정/등록불가)
  rsn?: string // 등록불가사유 (N)
  cfmtnYmd?: string // 등록확정일자 (N)
}

// 사업별등록결과 목업(dl_resultList) — 설계서 slide361 예시값 형식 그대로.
const MOCK_OVS_REG_RSLT_LIST: OvsBidRegRsltItem[] = [
  { no: 1, prchsDmndNo: 'BDC23453-001', bizNm: 'T-ATeTMEP 수리부속', cfmtnRslt: '등록심사중' },
  {
    no: 2,
    prchsDmndNo: 'BDC23453-002',
    bizNm: 'T-ATeTMEP 수리부속2',
    cfmtnRslt: '등록불가',
    rsn: '서류미비',
    cfmtnYmd: '2026-02-19',
  },
  {
    no: 3,
    prchsDmndNo: 'BDC23453-003',
    bizNm: 'MD부품 수리부속(엔진계통)',
    cfmtnRslt: '등록확정',
    cfmtnYmd: '2026-02-20',
  },
]

// 한 번에 보여줄 결과 건수(더보기 단위) — 설계서 '더보기(10/100)' 패턴, 목업이라 소단위.
const PAGE_SIZE = 2

interface OvsBidRegRsltByBizProps {
  /** 공고 일반정보 — 페이지 detail 로 공고 식별값을 그린다 */
  detail: MockOvsBidPrtcpApfrDetail
  /** 신청업체(dm_sbtInfo) */
  sbtInfo: MockOvsSbtInfo
  /** 입찰업체(dm_splyInfo) */
  splyInfo: MockOvsSplyInfo
}

export function OvsBidRegRsltByBiz({ detail, sbtInfo, splyInfo }: OvsBidRegRsltByBizProps) {
  const [page, setPage] = useState(1) // 더보기 페이징
  const total = MOCK_OVS_REG_RSLT_LIST.length
  const loaded = Math.min(page * PAGE_SIZE, total)

  // 공고 일반정보(dm_bscPbancInfo, slide362)
  const pbancRows: TableRow[] = [
    { label: '공고번호', value: `${detail.pbancNo}-${detail.pbancOd}` },
    { label: '개찰일자', value: detail.bdopnYmd },
  ]
  // 신청업체(dm_sbtInfo, slide362)
  const sbtRows: TableRow[] = [
    { label: '업체코드', value: sbtInfo.sbtBzentyCd },
    { label: '업체명', value: sbtInfo.sbtBzentyNm },
    { label: '대표자', value: sbtInfo.sbtRprsvNm },
    { label: '전화번호', value: sbtInfo.sbtTlno },
    { label: '팩스', value: sbtInfo.sbtFxno },
    { label: '사업자등록번호', value: sbtInfo.sbtBzmnNo },
    { label: '주소', value: sbtInfo.sbtAddr },
  ]
  // 입찰업체(dm_splyInfo, slide362)
  const splyRows: TableRow[] = [
    { label: '업체코드', value: splyInfo.splyBzentyCd },
    { label: '업체명', value: splyInfo.splyBzentyNm },
    { label: '대표자', value: splyInfo.splyRprsvNm },
    { label: '이메일', value: splyInfo.splyEmlAddr },
    { label: '전화번호', value: splyInfo.splyTlno },
    { label: '팩스', value: splyInfo.splyFxno },
    { label: '사업자번호', value: splyInfo.splyBzmnNo },
    { label: '주소', value: splyInfo.splyAddr },
  ]

  return (
    <div className="flex flex-col">
      {/* flush(콘텐츠) + triggerClassName px-0(타이틀 바): 시트 본문(px-16) 안이라 아코디언 좌우 패딩
          전부 제거(2중 패딩 방지 — 타이틀 왼쪽 여백 제거는 사용자 지시 2026-08-26, P82 와 동일 처리) */}
      <Accordion type="multiple" defaultValue={['pbanc', 'result-0']}>
        <AccordionSection value="pbanc" title="공고 일반정보" borderTop={false} flush triggerClassName="px-0">
          <Table rows={pbancRows} />
        </AccordionSection>
        <AccordionSection value="sbt" title="신청업체" flush triggerClassName="px-0">
          <Table rows={sbtRows} />
        </AccordionSection>
        <AccordionSection value="sply" title="입찰업체" flush triggerClassName="px-0">
          <Table rows={splyRows} />
        </AccordionSection>

        {/* 사업별등록결과(dl_resultList) — 사업별 Table. 등록불가만 사유 표시(slide361). */}
        {MOCK_OVS_REG_RSLT_LIST.slice(0, loaded).map((item, i) => (
          <AccordionSection
            key={item.prchsDmndNo}
            value={`result-${i}`}
            title={`사업별등록결과 (순번 ${item.no})`}
            titleInfo={item.cfmtnRslt}
            flush
            triggerClassName="px-0"
          >
            <Table
              rows={[
                { label: '순번', value: String(item.no), type: 'number' },
                { label: '구매요청번호', value: item.prchsDmndNo },
                { label: '사업명', value: item.bizNm },
                { label: '등록결과', value: item.cfmtnRslt },
                { label: '등록불가사유', value: item.rsn ?? '-' },
                { label: '등록확정일자', value: item.cfmtnYmd ?? '-' },
              ]}
            />
          </AccordionSection>
        ))}
      </Accordion>

      {/* 더보기 — 모두 노출됐으면 숨김 (설계서 '더보기(10/100)') */}
      {loaded < total && (
        <div className="py-4">
          <Button variant="secondary" className="w-full" onClick={() => setPage((p) => p + 1)}>
            더보기 ({loaded}/{total}건)
          </Button>
        </div>
      )}
    </div>
  )
}
OvsBidRegRsltByBiz.displayName = 'OvsBidRegRsltByBiz'
