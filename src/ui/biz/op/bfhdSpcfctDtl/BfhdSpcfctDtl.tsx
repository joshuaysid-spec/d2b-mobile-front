// 사전규격 상세 - '상세내용' 탭 콘텐츠 (MUI-OP-01-M11, bfhdSpcfctDtl).
// 레이아웃은 조달계획상세(M03)와 동일 구조(PageTitle + 아코디언 + 테이블)로 시작 — 실제 사전규격 값/항목은 추후 반영.
// 데이터는 목업 — 추후 API(opService.selectSpecDtl)로 대체.
import { useState } from 'react'

import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { SelectionFieldBox } from '@/ui/common/base/SelectionFieldBox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { AnlBfhdSpcfctDtlSheet } from '@/ui/biz/op/bfhdSpcfctDtl/AnlBfhdSpcfctDtlSheet'

// ── 집행계획 (목업 — 문서 slide22 [물품/용역]) ──────────────────────────────
const EXEC_ROWS: TableRow[] = [
  { label: '요구년도', value: '2026' },
  { label: '판단번호', value: '6000A' },
  { label: '발주기관', value: '화력총괄계약팀' },
  { label: '발주예정월', value: '2026-03' },
  { label: '계약예정월', value: '2026-06' },
  { label: '집행유형', value: '제조' },
  { label: '수량', value: '50', type: 'number' },
  { label: '대표품명', value: "'26년 K5방독면" },
  { label: '국채', value: '225,337,550 원', type: 'number' },
  { label: '기타', value: '0 원', type: 'number' },
  { label: '장기국채-본조', value: '0 원', type: 'number' },
  { label: '장기국채-현금', value: '0 원', type: 'number' },
  { label: '합계', value: '225,337,550 원', type: 'number' },
  { label: '총부기금액', value: '225,337,550 원', type: 'number' },
]

// ── 판단내역 (목업 — 문서 slide22) ─────────────────────────────────────────
const DECISION_ROWS: TableRow[] = [
  { label: '계약방법', value: '수의계약' },
  { label: '입찰방법', value: '전자입찰' },
  { label: '단가제유형', value: '총액제' },
  { label: '계약종류', value: '일반계약확정' },
  { label: '낙찰자결정방법', value: '협상' },
  { label: '적격심사 여부', value: '비대상' },
  { label: '입찰예정일자', value: '-' },
  { label: '품목코드', value: '4240300004 : 방독면' },
  { label: '입찰형태', value: '전자입찰' },
  { label: '계약체결업체수', value: '-' },
  { label: '생산능력 기준서 번호', value: '1234567' },
  { label: '국내한도액 계약여부', value: '비대상' },
  { label: '생산능력확인 소요기간', value: '150일' },
  {
    label: '수의계약사유',
    value: '국계법시행령 제26조 제1항 제5호 가목 2) 추정가격 2천만원 이하 (제조, 구매, 용역)',
  },
  { label: '산업분류번호(1)', value: '27199 : 그 외 기타 의료용 기기 제조업' },
  { label: '산업분류번호(2)', value: '-' },
  { label: '종합판단', value: '부의 공제 대비 단가 10% 수준 금액 차이로 적정' },
]

// ── 문의처 (목업 — 문서 slide24) ───────────────────────────────────────────
const CONTACT_ROWS: TableRow[] = [
  { label: '기관', value: '방위사업청' },
  { label: '담당자', value: '홍길동 주무관' },
  {
    label: '연락처',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
]

export function BfhdSpcfctDtl() {
  // 연관정보 클릭 → 연관조달계획상세(MUI-OP-01-P12) 바텀시트
  const [relatedOpen, setRelatedOpen] = useState(false)

  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={['exec', 'decision', 'related', 'contact']}
        className="w-full"
      >
        <AccordionSection value="exec" title="집행계획" borderTop={false}>
          <Table rows={EXEC_ROWS} />
        </AccordionSection>
        <AccordionSection value="decision" title="판단내역">
          <Table rows={DECISION_ROWS} />
        </AccordionSection>
        <AccordionSection value="related" title="연관정보">
          <SelectionFieldBox
            value="조달계획번호 2026-00590"
            onClick={() => setRelatedOpen(true)}
          />
        </AccordionSection>
        <AccordionSection value="contact" title="문의처">
          <Table rows={CONTACT_ROWS} />
        </AccordionSection>
      </Accordion>

      {/* 연관조달계획상세 바텀시트 (P12) */}
      <AnlBfhdSpcfctDtlSheet open={relatedOpen} onOpenChange={setRelatedOpen} />
    </>
  )
}
BfhdSpcfctDtl.displayName = 'BfhdSpcfctDtl'
