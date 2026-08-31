// 동가낙찰결과 — MUI-BD-09-P03 SmprcScsbdRslt. 설계서 02.입찰 v1.88 slide249~250 (2026-08-13 화면 추가).
// 입찰결과 탭(T03)의 '동가낙찰결과' 버튼으로 진입. 동가로 낙찰된 업체 정보 + 당첨여부, 추첨 방식 안내,
// 가위바위보로 결정된 건은 차수별 결과까지 표시(없으면 해당 섹션 미표시).
// 설계서의 '선정 결과'(업체코드/업체명) 표는 가위바위보 표의 앞 두 행과 동일 정보라 모바일에선 합쳐 표시.
import { bdQueries } from '@/queries/bds/bd/bdQueries'
import { Button } from '@/ui/common/base/Button'
import { SectionTitle } from '@/ui/common/base/SectionTitle'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { Notice } from '@/ui/common/composites/Notice'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { MockSmprcScsbdRpsItem, MockSmprcScsbdRsltItem } from '@/types/mock/bd'

export interface SmprcScsbdRsltFullPopupProps {
  /** 개찰 건 식별자 — 입찰결과상세 페이지가 navigate state 에서 받아 탭을 거쳐 전달. */
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 업체정보 1건 → 표 행 (slide250 1.1 순서).
function bzentyRows(it: MockSmprcScsbdRsltItem): TableRow[] {
  return [
    { label: '번호', value: it.no, type: 'number' },
    { label: '사업자등록번호', value: it.brno },
    { label: '상호명', value: it.bzentyNm },
    { label: '입찰서제출일시', value: it.regDt },
    { label: '당첨여부', value: it.smprcScsbdBzentyYn },
  ]
}

// 가위바위보 1건 → 표 행 (slide250 1.2 순서). 진행되지 않은 차수는 빈 값이라 값 있는 차수만 표시.
function rpsRows(it: MockSmprcScsbdRpsItem): TableRow[] {
  const rounds = [
    it.smprcScsbdRslt1,
    it.smprcScsbdRslt2,
    it.smprcScsbdRslt3,
    it.smprcScsbdRslt4,
    it.smprcScsbdRslt5,
  ]
  return [
    { label: '업체코드', value: it.bzentyCd },
    { label: '업체명', value: it.bzentyNm },
    ...rounds
      .map((v, i) => ({ label: `${i + 1}차`, value: v }))
      .filter((r) => Boolean(r.value)),
  ]
}

export function SmprcScsbdRsltFullPopup({ id, open, onOpenChange }: SmprcScsbdRsltFullPopupProps) {
  const { data } = bdQueries.useSelectSmprcScsbdRsltInfo(id, open)
  const bzentyList = data?.smprcScsbdRslt ?? []
  const rpsList = data?.rps ?? []

  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="동가낙찰결과"
      footer={
        <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        <section className="flex flex-col gap-krds-7">
          <SectionTitle as="h3" info={`총 ${bzentyList.length}건`}>
            업체정보
          </SectionTitle>
          <div className="flex flex-col gap-krds-7 px-4">
            {bzentyList.map((it) => (
              <Table key={`${it.brno}-${it.no}`} rows={bzentyRows(it)} />
            ))}
          </div>
        </section>

        {/* 안내사항 — 추첨 방식 설명(slide249 고정 문구) */}
        <div className="px-4">
          <Notice icon="Info">
            사업자번호, 입찰서제출일시를 이용하여 해시값을 추출 정수로 전환 후 업체수로 나눈
            나머지에 해당되는 업체로 선정됩니다. 번호는 입찰서 제출 순서로 부여합니다. 입찰서
            제출일시가 같은 경우 사업자번호순입니다.
          </Notice>
        </div>

        {/* 가위바위보 — 해당 방식으로 결정된 건에만 내려옴 */}
        {rpsList.length > 0 && (
          <section className="flex flex-col gap-krds-7">
            <SectionTitle as="h3">가위바위보 결과</SectionTitle>
            <div className="flex flex-col gap-krds-7 px-4">
              {rpsList.map((it) => (
                <Table key={it.bzentyCd} rows={rpsRows(it)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </FullPopup>
  )
}
SmprcScsbdRsltFullPopup.displayName = 'SmprcScsbdRsltFullPopup'
