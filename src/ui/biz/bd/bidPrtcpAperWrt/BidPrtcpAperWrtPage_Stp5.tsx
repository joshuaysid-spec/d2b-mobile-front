// 입찰참가신청서작성 - 공동수급업체 (MUI-BD-04-M10, 설계서 slide108 · 데이터영역 dlt_jsdBzentyList slide121).
// 단독입찰이면 숨김 탭(여기선 목업 표시). 최대 협정업체 수 3(대표업체 1 + 구성업체 N).
// 레이아웃: SectionTitle('공동수급업체 - 최대 협정업체 수 : N (대표업체+구성업체수)')
//   → 업체 카드 반복(대표1+구성N, 각 Table) → "+ 추가하기" Button → 안내사항 Infobox(탭 최하단).
// 요약/스텝/탭/하단액션바는 호스트 페이지(BidPrtcpAperWrtPage) 소유 — 여기서 만들지 않는다.
// 처리조건(설계서 slide108 설명 및 특이사항 · slide121 비고):
//   - 편집(E) 항목은 공동수급업체(bzentyNm)·출자비율(invstRt) 둘뿐 — 나머지는 조회결과 표시(R).
//   - 동의여부(argeYn)는 속성 R — '동의'/'미동의' 표시만 하고 동의 처리 액션은 없다(2026-08-10 요청).
//     단일 업체면 이 행도 숨김. 업체 삭제 행은 제공하지 않는다(2026-08-10 요청으로 제거).
//   - 공동분담업종·시공능력평가액은 공사 전용 — 물품이면 숨김.
//   - 업체명 옆 검색버튼 → 이 탭이 소유한 업체검색 바텀시트(P11).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { RegBzentySrch } from '@/ui/biz/bd/bidPrtcpAperWrt/RegBzentySrch'
import type { BidPrgrsItem, JsdBzentyAply } from '@/types/mock/bd'

// 최대 협정업체 수(대표 + 구성).
const MAX_BZENTY = 3

// 공동수급업체 목록 목업(dlt_jsdBzentyList) — 값은 설계서 형식 그대로. 편집 항목 외에는 조회결과 표시.
const MOCK_JSD_BZENTY: JsdBzentyAply[] = [
  {
    id: 'jsd1',
    jsdBzentyNm: '대표',
    bzentyNm: '㈜업체명 표시 영역',
    jsdShNm: '공동이행',
    cnstpNm: '제조',
    invstRt: '60',
    bidGrnteAmt: '619,520,000 원',
    depsPayMthdCd: '현금',
    cnstAbltEvlAmt: '1,200,000,000 원',
    argeYn: 'Y',
  },
  {
    id: 'jsd2',
    jsdBzentyNm: '구성',
    bzentyNm: '',
    jsdShNm: '공동이행',
    cnstpNm: '제조',
    invstRt: '40',
    bidGrnteAmt: '413,013,000 원',
    depsPayMthdCd: '전자보증서',
    cnstAbltEvlAmt: '800,000,000 원',
    argeYn: 'N',
  },
]

interface Props {
  detail: BidPrgrsItem
}

export function BidPrtcpAperWrtPage_Stp5({ detail }: Props) {
  const [companies, setCompanies] = useState<JsdBzentyAply[]>(MOCK_JSD_BZENTY)
  const [searchOpen, setSearchOpen] = useState(false) // 업체검색 바텀시트(P11)
  const [activeId, setActiveId] = useState<string | null>(null) // 검색 결과를 주입할 업체 행

  // 공동분담업종·시공능력평가액은 공사 전용(설계서 slide121 비고) — 물품이면 숨김.
  const isCnstwk = detail.taskSeNm === '공사'
  // 단일 업체면 동의여부 행 숨김(설계서 slide108 설명 1).
  const isSingle = companies.length === 1

  const openSearch = (id: string) => {
    setActiveId(id)
    setSearchOpen(true)
  }

  const handleSelect = (row: { bizNm: string }) => {
    // 추후 API: bdService.selectRegBzentyDetail — 선택 업체로 공동수급업체 행 채움
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
    setCompanies((prev) => [
      ...prev,
      {
        id: `jsd${seq}`,
        jsdBzentyNm: '구성',
        bzentyNm: '',
        jsdShNm: prev[0]?.jsdShNm ?? '',
        cnstpNm: prev[0]?.cnstpNm ?? '',
        invstRt: '',
        bidGrnteAmt: '',
        depsPayMthdCd: '',
        cnstAbltEvlAmt: '',
      },
    ])
  }

  const setField = (id: string, patch: Partial<JsdBzentyAply>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  // 업체 카드 1건 = Table. 편집 가능한 셀은 공동수급업체·출자비율뿐.
  const companyRows = (c: JsdBzentyAply): TableRow[] => {
    const rows: TableRow[] = [
      { label: '구분', value: c.jsdBzentyNm },
      {
        label: '공동수급업체',
        type: 'combination',
        value: (
          <div className="flex w-full items-center gap-krds-3">
            <InputBox
              className="flex-1"
              placeholder="선택해주세요."
              maxLength={100}
              value={c.bzentyNm}
              onChange={(e) => setField(c.id, { bzentyNm: e.target.value })}
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
      { label: '이행방식', value: c.jsdShNm },
      // 공동분담업종 — 공사 전용
      ...(isCnstwk ? ([{ label: '공동분담업종', value: c.cnstpNm }] as TableRow[]) : []),
      {
        label: '출자비율',
        type: 'combination',
        value: (
          <div className="flex w-full items-center gap-krds-3">
            <InputBox
              className="flex-1"
              inputType="numeric"
              placeholder="0"
              value={c.invstRt}
              onChange={(e) => setField(c.id, { invstRt: e.target.value })}
            />
            <span className="shrink-0 text-[17px] leading-normal text-krds-text-ink">%</span>
          </div>
        ),
      },
      { label: '입찰보증금', value: c.bidGrnteAmt, type: 'number' },
      { label: '납부방법', value: c.depsPayMthdCd },
      // 시공능력평가액 — 공사 전용
      ...(isCnstwk
        ? ([{ label: '시공능력평가액', value: c.cnstAbltEvlAmt, type: 'number' }] as TableRow[])
        : []),
    ]

    // 단일 업체면 동의여부 숨김.
    if (isSingle) return rows

    // 동의여부(argeYn) — 속성 R. 표시 전용(동의 처리 버튼 없음).
    rows.push({ label: '동의여부', value: c.argeYn === 'Y' ? '동의' : '미동의' })
    return rows
  }

  return (
    <>
      <SectionTitle as="h3" topDivider>
        공동수급업체 - 최대 협정업체 수 :{' '}
        <span className="text-krds-text-danger">{MAX_BZENTY}</span> (대표업체+구성업체수)
      </SectionTitle>

      <div className="flex flex-col gap-krds-6 px-4 py-4">
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

      {/* 안내사항 — 탭 최하단 고정(전 탭 공통). 두번째 항목은 설계서상 강조(빨강). */}
      <Infobox
        title="안내사항"
        defaultOpen
        items={[
          '공동수급인 경우 공동수급업체란에 입찰참가신청업체(대표업체 및 구성업체)도 [추가] 시켜야 합니다.',
          <span key="attach" className="text-krds-text-danger">
            구성업체 제출서류는 대표업체가 참가신청서 제출시 첨부해야 합니다.
          </span>,
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
