// 입찰진행상세 - 입찰참가신청조회 문의 및 동의 (MUI-BD-04-T07, 설계서 영문ID BidPrtcpAperDtl_Tab7 · slide189).
// 호스트 페이지(BidPrtcpAperDtlPage)의 '7. 문의 및 동의' 탭 본문만 담당 — 요약/탭/하단 액션바는 페이지 소유.
// 조회판이라 작성판(M14)의 동의 체크박스/저장이 없고 제출 시 동의한 결과만 표시한다(내용 보기 = 본문 열람).
// 약관 6종의 제목/본문은 작성판 동의서(P15~P20)와 동일 원문이라 AGREEMENTS(AgreementForm)를 재사용.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { AGREEMENTS, type AgreementData } from '@/ui/biz/bd/bidPrtcpAperWrt/AgreementForm'

// 문의처 — 설계서 slide189. 담당자 1건 = 기관/성명·직급 + 전화/이메일.
// 항목명은 데이터영역(slide122) 그대로 — 담당자 ofcctrNm(계약관명) · 연락처 ofcctrTelno(계약관전화번호).
// ⚠️ 기관명(instNm)·이메일(email)은 데이터영역 미정의 — 목업(slide189)에 표시된 값이라 임시 키로 둔다.
const CONTACTS = [
  { id: 'ofcctr1', instNm: '방위사업청', ofcctrNm: '홍길동 주무관', ofcctrTelno: '02-1234-5678', email: 'kukbang@g2b.go.kr' },
  { id: 'ofcctr2', instNm: '방위사업청', ofcctrNm: '홍길순 사무관', ofcctrTelno: '02-5678-4321', email: 'kukbang@g2b.go.kr' },
]

// 사후심사대상 입찰안내 — 설계서 slide189 안내사항 원문(6개 불릿).
const NOTICE_ITEMS = [
  '입찰전 꼭 확인 하시기 바랍니다.',
  '해당입찰 건은 [입찰서제출 마감] 후 [등록심사]를 진행하는 입찰건으로 참가신청서 작성 후 등록심사 없이 입찰서를 제출합니다.',
  '[공동이행방식]의 입찰은 [협정서제출] 시 입찰서를 제출할 수 있습니다.',
  '주의) 입찰서를 제출 후에는 참가신청서, 공동수급협정서, 입찰서를 변경 할 수 없습니다.',
  '입찰서제출이 마감 후에 등록심사에서 탈락 시 개찰대상에서 제외됩니다.',
  '- 문의 :1577-1118(①)(전자입찰서비스 데스크)',
]

// 담당자 1건 → Table rows(담당자/연락처). 각 셀 2줄이라 combination.
const contactRows = (c: (typeof CONTACTS)[number]): TableRow[] => [
  {
    label: '담당자',
    type: 'combination',
    value: (
      <>
        <span>{c.instNm}</span>
        <span>{c.ofcctrNm}</span>
      </>
    ),
  },
  {
    label: '연락처',
    type: 'combination',
    value: (
      <>
        <span>{c.ofcctrTelno}</span>
        <span>{c.email}</span>
      </>
    ),
  },
]

export function BidPrtcpAperDtl_Tab7() {
  const [selected, setSelected] = useState<AgreementData | null>(null) // 열람 중인 약관(바텀시트)

  // 약관 동의 1건 → 번호/약관명(+보기)/동의여부. 제출된 신청서라 모두 '동의'(설계서 slide189 체크 표기).
  const agreementRows = (a: AgreementData, no: number): TableRow[] => [
    { label: '번호', value: String(no) },
    {
      label: '약관명',
      type: 'combination',
      value: (
        <div className="flex flex-col items-start gap-krds-3">
          <span>{a.title}</span>
          <Button size="sm" variant="inner" onClick={() => setSelected(a)}>
            내용 보기
          </Button>
        </div>
      ),
    },
    { label: '동의여부', value: '동의' },
  ]

  return (
    <>
      {/* 문의처 — 담당자 건별 Table 반복 */}
      <SectionTitle as="h3" topDivider>
        문의처
      </SectionTitle>
      <div className="flex flex-col gap-4 px-4 py-4">
        {CONTACTS.map((c) => (
          <Table key={c.id} rows={contactRows(c)} />
        ))}
      </div>

      {/* 약관 동의 — 조회 전용이라 체크리스트가 아닌 동의결과 표. */}
      <SectionTitle as="h3" topDivider>
        약관 동의
      </SectionTitle>
      <div className="flex flex-col gap-krds-7 px-4 py-4">
        {AGREEMENTS.map((a, i) => (
          <Table key={a.id} rows={agreementRows(a, i + 1)} />
        ))}
      </div>

      {/* 사후심사대상 입찰안내 */}
      <Infobox title="사후심사대상 입찰안내" items={NOTICE_ITEMS} />

      {/* 약관 내용(P15~P20) — 조회 전용이라 본문만(동의 선택 라디오 없음). 컨테이너는 이 탭이 소유. */}
      <BottomSheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={selected?.title ?? '약관'}
        footer={
          <ButtonGroup
            layout="single"
            items={[{ label: '닫기', variant: 'primary', onClick: () => setSelected(null) }]}
          />
        }
      >
        {selected && (
          <div className="flex flex-col gap-krds-5 py-2 text-[17px] leading-normal text-krds-text-ink">
            {selected.body.map((p, i) => (
              <p key={`${selected.id}-${i}`} className="wrap-break-word">
                {p}
              </p>
            ))}
          </div>
        )}
      </BottomSheet>
    </>
  )
}
BidPrtcpAperDtl_Tab7.displayName = 'BidPrtcpAperDtl_Tab7'
