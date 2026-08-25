// 참고자료 (MUI-OP-01-T75, WarSplList_Ref) — 설계서 01.조달계획 v0.82 slide80 / 항목설명 slide84(1.7).
// 목록정보 조회 바텀시트(WarSplList_Inq) '참고자료' 탭 콘텐츠.
// 구성: NIIN 검색 + 참고자료(dl_refList) **건별 테이블 반복**(설계서 목업 3건).
// 표시 규칙(사용자 확정 2026-08-11): 목록은 해당 연간조달계획의 **디폴트 값**이고,
//   NIIN 검색 시 디폴트 목록 아래로 검색 결과가 이어붙는다(교체 아님).
//   ⚠️ '교정' 항목은 화면 목업 표기가 RNIC, 항목설명 1.7 은 RNJC(rnjc) — 항목설명을 권위로 rnjc 사용.
//   ⚠️ '설계(SADC)' 는 항목설명 1.7 에만 있고 화면 목업 컬럼에는 없다 — 데이터영역 기준으로 표시.
// 시트 본문(px-16) 안이라 AccordionSection 은 flush(콘텐츠 좌우 패딩 제거 — 2중 패딩 방지).
import { opQueries } from '@/queries/bds/op/opQueries'
import type { WarSplRef } from '@/types/mock/op'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { WarSplList_NiinSrch } from '@/ui/biz/op/warSplList_Inq/WarSplList_NiinSrch'

// 라벨(한글 + 부호명) ↔ 항목명(영문) — 설계서 "항목 설명 1.7 참고자료 데이터 영역" 순서 그대로.
const REF_FIELDS: { label: string; key: keyof WarSplRef }[] = [
  { label: '참고번호 R/N', key: 'refNo' },
  { label: '생산자 NSCM', key: 'nscm' },
  { label: '형태 RNFC', key: 'rnfc' },
  { label: '범주 RNCC', key: 'rncc' },
  { label: '분류 RNVC', key: 'rnvc' },
  { label: '가용성 DAC', key: 'dac' },
  { label: '조치 RNAA', key: 'rnaa' },
  { label: '상태 RNSC', key: 'rnsc' },
  { label: '교정 RNJC', key: 'rnjc' },
  { label: '설계 SADC', key: 'sadc' },
]

export interface WarSplList_RefProps {
  /** 연간조달계획 식별자 — 디폴트 값 조회 기준. */
  planId: string
  /** 입력 중 NIIN(시트 콘텐츠 소유 — 탭 전환 시에도 유지). */
  niin: string
  onNiinChange: (next: string) => void
  /** 검색 실행(확정값 반영). */
  onSearch: () => void
  /** 검색 확정 NIIN — 비면 검색 미실행(디폴트만 표시). */
  appliedNiin: string
}

export function WarSplList_Ref({
  planId,
  niin,
  onNiinChange,
  onSearch,
  appliedNiin,
}: WarSplList_RefProps) {
  const { data: base } = opQueries.useSelectRefInfo({ planId })
  const { data: found } = opQueries.useSelectRefInfo(
    { planId, niin: appliedNiin },
    Boolean(appliedNiin),
  )

  // 디폴트 목록 뒤에 검색 결과를 이어붙인다.
  const list = [...(base ?? []), ...(found ?? [])]

  return (
    // pt-krds-8: 탭(TabList)과 NIIN 검색 섹션 사이 여백(2026-08-11 요청과 동일 간격 유지).
    <div className="flex flex-col gap-krds-7 pt-krds-8 pb-6">
      <WarSplList_NiinSrch
        id="war-spl-ref-niin"
        value={niin}
        onChange={onNiinChange}
        onSearch={onSearch}
      />

      {/* 참고자료 — 아코디언(2026-08-11 요청). 총 건수는 AccordionSection 의 titleInfo 슬롯. */}
      <Accordion type="multiple" defaultValue={['ref']} className="w-full">
        <AccordionSection
          value="ref"
          title="참고자료"
          titleInfo={list.length > 0 ? `총 ${list.length}건` : undefined}
          // borderTop 유지(기본 true) — 위의 NIIN 검색 영역과 콘텐츠를 가르는 선.
          flush
        >
          <div className="flex flex-col gap-krds-7">
            {list.map((ref) => {
              const rows: TableRow[] = REF_FIELDS.map((f) => ({ label: f.label, value: ref[f.key] }))
              return <Table key={ref.id} rows={rows} />
            })}
            {list.length === 0 && (
              <p className="py-krds-8 text-[17px] text-krds-text-muted">조회된 자료가 없습니다.</p>
            )}
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
WarSplList_Ref.displayName = 'WarSplList_Ref'
