// 입찰참가신청서작성 - 공동수급업체 (MUI-BD-04-M10, 설계서 slide). 신청서 하위 탭 콘텐츠.
// 단독입찰이면 숨김 탭(여기선 목업 표시). 최대 협정업체 수 3(대표업체 1 + 구성업체 N).
// 레이아웃: 페이지타이틀 → SectionTitle/InputLabel(최대 협정업체 수) → 업체 카드 반복(대표1+구성N, 각 Table combination)
//   → "+ 추가하기" Button → 안내사항 Infobox. 업체명 옆 검색버튼 → 이 탭이 소유한 업체검색 바텀시트(P11).
// 요약/스텝/탭/하단액션바는 호스트 페이지(BidPrtcpAperWrtPage) 소유 — 여기서 만들지 않는다.
// 라벨=설계서 한글, 입력항목=InputBox/SelectBox(combination). 목값은 설계서 형식 그대로. 조회/저장은 추후 API.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { RegBzentySrch } from '@/ui/biz/bd/bidPrtcpAperWrt/RegBzentySrch'
import type { BidPrgrsItem } from '@/types/bd'

// 이행방식 옵션(공동수급) — 공동이행/분담이행.
const IMPL_MTHD = [
  { value: '공동이행', label: '공동이행' },
  { value: '분담이행', label: '분담이행' },
]

// 입찰보증금 납부방법 — 현금/전자보증서/보증금면제.
const PAY_MTHD = [
  { value: '현금', label: '현금' },
  { value: '전자보증서', label: '전자보증서' },
  { value: '보증금면제', label: '보증금면제' },
]

// 최대 협정업체 수(대표 + 구성).
const MAX_BZENTY = 3

interface Props {
  detail: BidPrgrsItem
}

export function BidPrtcpAperWrtPage_Stp5({ detail }: Props) {
  // 공동수급업체 목록 — 대표 1 + 구성 N. 목값은 설계서 형식. (인터페이스는 추론, 영문 항목명 별도 정의 안 함)
  // 대표 업체 구분은 신청업체의 업체구분(detail.bzentySeNm)으로 표기.
  const [companies, setCompanies] = useState([
    { id: 'cmp1', bzentySe: detail.bzentySeNm, bzentyNm: '㈜업체명 표시 영역', cntrbRt: '60' },
    { id: 'cmp2', bzentySe: '구성', bzentyNm: '', cntrbRt: '40' },
  ])
  const [searchOpen, setSearchOpen] = useState(false) // 업체검색 바텀시트(P11)
  const [activeId, setActiveId] = useState<string | null>(null) // 검색 결과를 주입할 업체 행

  const openSearch = (id: string) => {
    setActiveId(id)
    setSearchOpen(true)
  }

  const handleSelect = (row: { bizNm: string }) => {
    // 추후 API: bdService.getRegBzentyDetail — 선택 업체로 공동수급업체 행 채움
    setCompanies((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, bzentyNm: row.bizNm } : c)),
    )
    setSearchOpen(false)
  }

  const handleAdd = () => {
    // 추후 API: 협정업체 추가(최대 MAX_BZENTY)
    if (companies.length >= MAX_BZENTY) {
      console.log('[M10] 최대 협정업체 수 초과', MAX_BZENTY)
      return
    }
    const seq = companies.length + 1
    setCompanies((prev) => [...prev, { id: `cmp${seq}`, bzentySe: '구성', bzentyNm: '', cntrbRt: '' }])
  }

  const handleRemove = (id: string) => {
    // 추후 API: 협정업체 삭제(대표 제외)
    console.log('[M10] 업체삭제', id)
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }

  const setCntrbRt = (id: string, v: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, cntrbRt: v } : c)))
  }

  // 업체 카드 1건 = Table(combination). 대표 row 는 업체삭제 행 없음.
  const companyRows = (c: (typeof companies)[number]): TableRow[] => {
    const rows: TableRow[] = [
      { label: '구분', value: c.bzentySe },
      {
        label: '공동수급업체',
        type: 'combination',
        value: (
          <div className="flex items-center gap-krds-3">
            <InputBox
              className="flex-1"
              placeholder="업체명"
              value={c.bzentyNm}
              onChange={(e) =>
                setCompanies((prev) =>
                  prev.map((x) => (x.id === c.id ? { ...x, bzentyNm: e.target.value } : x)),
                )
              }
            />
            <Button
              size="icon"
              variant="secondary"
              aria-label="업체 검색"
              onClick={() => openSearch(c.id)}
            >
              <Icon name="Search" size={20} />
            </Button>
          </div>
        ),
      },
      {
        label: '이행방식',
        type: 'combination',
        value: <SelectBox items={IMPL_MTHD} defaultValue="공동이행" />,
      },
      {
        label: '공동분담업종',
        type: 'combination',
        value: <InputBox placeholder="공동분담업종" defaultValue="제조" />,
      },
      {
        label: '출자비율',
        type: 'combination',
        value: (
          <div className="flex items-center gap-krds-3">
            <InputBox
              className="flex-1"
              inputType="numeric"
              placeholder="0"
              value={c.cntrbRt}
              onChange={(e) => setCntrbRt(c.id, e.target.value)}
            />
            <span className="shrink-0 text-[17px] leading-normal text-krds-text-ink">%</span>
          </div>
        ),
      },
      { label: '입찰보증금', value: '619,520,000 원', type: 'number' },
      {
        label: '납부방법',
        type: 'combination',
        value: <SelectBox items={PAY_MTHD} defaultValue="현금" />,
      },
      { label: '시공능력평가액', value: '1,200,000,000 원', type: 'number' },
      {
        label: '동의여부',
        type: 'combination',
        value: (
          <Button
            variant="inner"
            size="sm"
            onClick={() => console.log('[M10] 동의하기', c.id)} // 추후 API: bdService.agreeJointBzenty
          >
            동의하기
          </Button>
        ),
      },
    ]
    // 대표는 삭제 불가 — 구성업체에만 업체삭제 행 추가.
    if (c.bzentySe !== '대표') {
      rows.push({
        label: '업체삭제',
        type: 'combination',
        value: (
          <Button variant="secondary" size="sm" onClick={() => handleRemove(c.id)}>
            <Icon name="Delete" size={20} />
            삭제
          </Button>
        ),
      })
    }
    return rows
  }

  return (
    <>
      <PageTitle as="h2" className="px-4 pb-2 pt-4">
        공동수급업체
      </PageTitle>

      <SectionTitle as="h3" topDivider>
        공동수급업체
      </SectionTitle>

      <div className="flex flex-col gap-krds-6 px-4 py-4">
        <InputLabel>
          최대 협정업체 수 : {MAX_BZENTY} (대표업체+구성업체수)
        </InputLabel>

        {/* 업체 카드 반복 — 대표 1 + 구성 N */}
        {companies.map((c) => (
          <Table key={c.id} rows={companyRows(c)} />
        ))}

        {/* 추가하기 — 풀폭 secondary */}
        <Button variant="secondary" className="w-full" onClick={handleAdd}>
          <Icon name="Add" size={20} />
          추가하기
        </Button>
      </div>

      {/* 안내사항 */}
      <Infobox
        title="안내사항"
        items={[
          '공동수급인 경우 공동수급업체란에 입찰참가신청업체(대표업체 및 구성업체)도 [추가] 시켜야 합니다.',
          '구성업체 제출서류는 대표업체가 참가신청서 제출시 첨부해야합니다.',
        ]}
      />

      {/* 등록업체검색(P11) — 이 탭이 컨테이너 소유, 콘텐츠는 RegBzentySrch */}
      <BottomSheet open={searchOpen} onOpenChange={setSearchOpen} title="업체 검색">
        <RegBzentySrch onSelect={handleSelect} />
      </BottomSheet>
    </>
  )
}
BidPrtcpAperWrtPage_Stp5.displayName = 'BidPrtcpAperWrtPage_Stp5'
