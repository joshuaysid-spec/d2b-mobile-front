// 공개수의협상 견적서 작성 - 스탭2 업체정보 (MUI-BD-12-T75(구 M75 — v1.83 재편), 설계서 slide421).
// 신청업체/입찰업체 = Accordion. 신청업체 업체코드=조회, 입찰업체 업체코드=SelectBox(w-full).
// 입찰업체 사업자번호(줄내림)DUNS NUM. 데이터는 목업(추후 API).
import { useState } from 'react'

import { SelectBox } from '@/ui/common/base/SelectBox'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { OvsRlsVltrnsEtdcBzenty } from '@/types/bd'

// 업체정보 목업 — 설계서 slide421 값 그대로. 항목명 = 설계서 데이터영역 영문(dm_aplyBzenty/dm_bidBzenty).
const MOCK_BZENTY: OvsRlsVltrnsEtdcBzenty = {
  aply: {
    sbtBzentyCd: '7001F',
    sbtBzentyNm: 'A 무역대리점',
    sbtRprsvNm: '홍길동',
    sbtTlno: '02-1234-5678',
    sbtFxno: '02-2345-6789',
    sbtBzmnNo: '123-45-67890',
    sbtAddr: '서울특별시 종로구',
  },
  bid: {
    splyBzentyCd: '7004F',
    splyBzentyNm: 'B 해외업체',
    splyRprsvNm: '홍길동',
    splyEmlAddr: 'abcde@company.com',
    splyTlno: '02-1234-5678',
    splyFxno: '02-9876-5432',
    splyBzmnNo: '123-45-67890',
    splyAddr: '서울특별시 종로구',
  },
}

// 입찰업체 업체코드 dropdown 옵션 목업 — 로그인 업체의 해외업체 목록.
const BID_CODE_OPTIONS = [
  { value: '7004F', label: '7004F' },
  { value: '7005F', label: '7005F' },
]

export function OvsRlsVltrnsNgtnEtdcSbmsn2() {
  const b = MOCK_BZENTY
  const [bidCd, setBidCd] = useState(b.bid.splyBzentyCd)

  // 신청업체 — 업체코드는 조회(고정).
  const aplyRows: TableRow[] = [
    { label: '업체코드', value: b.aply.sbtBzentyCd },
    { label: '업체명', value: b.aply.sbtBzentyNm },
    { label: '대표자', value: b.aply.sbtRprsvNm },
    { label: '전화번호', value: b.aply.sbtTlno },
    { label: '팩스', value: b.aply.sbtFxno },
    { label: '사업자등록번호', value: b.aply.sbtBzmnNo },
    { label: '주소', value: b.aply.sbtAddr },
  ]

  // 입찰업체 — 업체코드는 SelectBox(w-full). 사업자번호+DUNS NUM 줄내림.
  const bidRows: TableRow[] = [
    {
      label: '업체코드',
      type: 'combination',
      // Table combination 셀의 [&_button]:w-fit(보기 버튼용)이 SelectBox 트리거(button)를 줄이므로 !w-full 로 덮어 100%.
      value: (
        <div className="w-full [&_button]:!w-full">
          <SelectBox items={BID_CODE_OPTIONS} value={bidCd} onValueChange={setBidCd} aria-label="입찰업체 업체코드" />
        </div>
      ),
    },
    { label: '업체명', value: b.bid.splyBzentyNm },
    { label: '대표자', value: b.bid.splyRprsvNm },
    { label: '이메일', value: b.bid.splyEmlAddr },
    { label: '전화번호', value: b.bid.splyTlno },
    { label: '팩스', value: b.bid.splyFxno },
    {
      // 라벨(th)만 사업자번호 + DUNS NUM 줄내림, 값(td)은 사업자번호만.
      label: (
        <div className="flex flex-col gap-0.5">
          <span>사업자번호</span>
          <span>DUNS NUM</span>
        </div>
      ),
      value: b.bid.splyBzmnNo,
    },
    { label: '주소', value: b.bid.splyAddr },
  ]

  return (
    <div className="py-4">
      <Accordion type="multiple" defaultValue={['aply', 'bid']} className="w-full">
        <AccordionSection value="aply" title="신청업체" borderTop={false}>
          <Table rows={aplyRows} />
        </AccordionSection>
        <AccordionSection value="bid" title="입찰업체">
          <Table rows={bidRows} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
OvsRlsVltrnsNgtnEtdcSbmsn2.displayName = 'OvsRlsVltrnsNgtnEtdcSbmsn2'
