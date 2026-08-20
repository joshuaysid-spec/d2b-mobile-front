// 입찰공고 상세 - '입찰진행현황' 탭 (MUI-BD-01-T06(구 M12 — v1.83 재편), 설계서 02.입찰 v1.83 slide50~51).
// '입찰진행현황' 섹션 아래 차수별 진행 테이블 + '입찰결과 바로가기' 버튼 반복(항목이 여러 개면 하단으로 테이블 추가 노출).
// 탭 노출 조건(컨테이너 BidPbancDtlPage 제어 — slide50 특이사항):
//  - 현재일자가 개찰일시 이후일 경우에만 탭 표시.
//  - 물품/용역 공고: 무효처리된 공고·계약방법 '협상에의한계약(서류)' 이면 탭 숨김.
//  - 공사 공고: 무효처리된 공고이면 탭 숨김.
//  - 자료구분값이 신자료('Y')면 탭 미노출 — 일반정보 탭 첨부서류의 조회 클릭 시 입찰결과상세로 이동(첨부파일 대체).
// 데이터영역 dlt_BidPrgrsPrst(slide51) — 목업(추후 bdService.selectBidPrgrsPrstList).
import { useNavigate } from 'react-router-dom'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Button } from '@/ui/common/base/Button'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// slide51 1.1. 입찰진행현황 데이터 영역 (dlt_BidPrgrsPrst)
interface BidPrgrsPrstItem {
  id: string // 목록 key + 입찰결과상세 이동 시 state 로 넘기는 식별자(설계서 외)
  pbancNo: string // 공고번호 (7)
  rebidCycl: string // 재입찰차수 — slide50 목업 라벨은 '재입찰자수·50 명'(불일치), 영문 항목명은 slide51 기준 rebidCycl
  clsfNo: string // 항목번호 (3)
  tndrSbmsnDdlnDt: string // 입찰서제출마감일시 (yyyy-mm-dd hh:mm)
  bdopnDt: string // 개찰일시 (yyyy-mm-dd hh:mm)
  bidStatNm: string // 진행상태 — 개찰전/개찰완료/재입찰/유찰 등 (As-Is Alias)
}

// 목업 — slide50 예시값 그대로. 추후 API.
const BID_PRGRS_PRST_LIST: BidPrgrsPrstItem[] = [
  {
    id: '1',
    pbancNo: '1234',
    rebidCycl: '50 명', // ⚠️ 잠정 값 — slide50 목업 표기('50 명') 그대로. 차수(rebidCycl)와 단위 불일치, 확정 시 정리
    clsfNo: '000 000 0000',
    tndrSbmsnDdlnDt: '2025-12-25 10:30',
    bdopnDt: '2025-12-25 10:30',
    bidStatNm: '개찰완료',
  },
  {
    id: '2',
    pbancNo: '5678',
    rebidCycl: '100 명', // ⚠️ 잠정 값 — 상동
    clsfNo: '000 000 0000',
    tndrSbmsnDdlnDt: '2025-12-25 10:30',
    bdopnDt: '2025-12-25 10:30',
    bidStatNm: '유찰',
  },
]

// 항목 순서 = slide50 화면 구성(공고번호 → 재입찰자수 → 항목번호 → 입찰서제출마감일시 → 개찰일시 → 진행상태).
function bidPrgrsPrstRows(p: BidPrgrsPrstItem): TableRow[] {
  return [
    { label: '공고번호', value: p.pbancNo },
    // 라벨은 slide50 화면 구성 표기('재입찰자수') — slide51 항목설명 한글명은 '재입찰차수'(rebidCycl)로 상이, 확정 필요
    { label: '재입찰자수', value: p.rebidCycl },
    { label: '항목번호', value: p.clsfNo },
    { label: '입찰서제출마감일시', value: p.tndrSbmsnDdlnDt },
    { label: '개찰일시', value: p.bdopnDt },
    { label: '진행상태', value: p.bidStatNm },
  ]
}

// slide50/51 이벤트 — 바로가기 버튼은 진행상태 '개찰완료'·'유찰' 일 때만 활성화, 나머지 상태 비활성화.
const RSLT_LINK_ENABLED_STATUSES = ['개찰완료', '유찰']

export function BidPbancDtl_Tacpg07() {
  const navigate = useNavigate()

  return (
    <Accordion type="multiple" defaultValue={['bidPrgrsPrst']} className="w-full">
      <AccordionSection value="bidPrgrsPrst" title="입찰진행현황" borderTop={false}>
        <div className="flex flex-col gap-krds-7">
          {BID_PRGRS_PRST_LIST.map((p) => (
            <div key={p.id} className="flex flex-col gap-krds-5">
              <Table rows={bidPrgrsPrstRows(p)} />
              {/* Scwin.btn_BidPrgrsPrstRslt_onclick — 입찰결과상세(MUI-BD-09-M01) 일반정보 탭으로 이동 */}
              <Button
                variant="secondary"
                className="w-full"
                disabled={!RSLT_LINK_ENABLED_STATUSES.includes(p.bidStatNm)}
                onClick={() => navigate('/bd/bidRsltDtl', { state: { id: p.id } })}
              >
                입찰결과 바로가기
              </Button>
            </div>
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}
BidPbancDtl_Tacpg07.displayName = 'BidPbancDtl_Tacpg07'
