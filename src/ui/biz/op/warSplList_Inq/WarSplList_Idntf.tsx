// 식별자료 (MUI-OP-01-T74, WarSplList_Idntf) — 설계서 01.조달계획 v0.82 slide79 / 항목설명 slide83(1.6).
// 목록정보 조회 바텀시트(WarSplList_Inq) '식별자료' 탭 콘텐츠.
// 구성: NIIN 검색 + 식별자료(dm_idntfInfo) **단일 테이블 23행**(항목설명 1.6 순서 그대로).
// 표시 규칙(사용자 확정 2026-08-11): 내용은 해당 연간조달계획의 **디폴트 값**이고,
//   NIIN 검색 시 디폴트 값 아래로 검색 결과 테이블이 이어붙는다(교체 아님).
// 시트 본문(px-16) 안이라 AccordionSection 은 flush(콘텐츠 좌우 패딩 제거 — 2중 패딩 방지).
import { opQueries } from '@/queries/bds/op/opQueries'
import type { MockWarSplIdntf } from '@/types/mock/op'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table } from '@/ui/common/composites/Table'
import { WarSplList_NiinSrch } from '@/ui/biz/op/warSplList_Inq/WarSplList_NiinSrch'

// 라벨(한글) ↔ 항목명(영문) 매핑 — 설계서 "항목 설명 1.6 식별자료 데이터 영역" 순서/표기 그대로.
const IDNTF_FIELDS: { label: string; key: keyof MockWarSplIdntf }[] = [
  { label: '군급분류', key: 'fsc' },
  { label: '영문품명', key: 'itemNmEng' },
  { label: '한글품명', key: 'itemNmKor' },
  { label: 'FIIG 긴요도부호(FCC)', key: 'fcc' },
  { label: '취소이유 부호(DRC)', key: 'drc' },
  { label: '품목식별 지침서번호(FIIG 순번)', key: 'fiigNo' },
  { label: '품명부호(INC)', key: 'inc' },
  { label: '자동자료처리 장비부호(ADPEC)', key: 'adpec' },
  { label: '귀금속 지시부호(PMIC)', key: 'pmic' },
  { label: '참조/부분 서술형 원인부호(RPDMRC)', key: 'rpdmrc' },
  { label: '대체재고 번호', key: 'sbstInvtNo' },
  { label: '품목식별 형태부호(TIIC)', key: 'tiic' },
  { label: '품종 구분번호(CS)', key: 'cs' },
  { label: '제조국부호(NTL)', key: 'ntl' },
  { label: '재고번호 식별부호(IS)', key: 'ls' },
  { label: '비군사화 부호(DEMIL)', key: 'demil' },
  { label: '정전기 방전부호(ESDC)', key: 'esdc' },
  { label: '품목식별번호 상태부호(NSC)', key: 'nsc' },
  { label: '위험물자부호(HMIC)', key: 'hmic' },
  { label: '위험특성부호(HCC)', key: 'hcc' },
  { label: '목록화담당자', key: 'picNm' },
  { label: '국가품목 식별번호(NIIN) 부여일자', key: 'niinYmd' },
  { label: '자료변경일자', key: 'chgYmd' },
]

export interface WarSplList_IdntfProps {
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

export function WarSplList_Idntf({
  planId,
  niin,
  onNiinChange,
  onSearch,
  appliedNiin,
}: WarSplList_IdntfProps) {
  const { data: base } = opQueries.useSelectIdntfInfo({ planId })
  const { data: found } = opQueries.useSelectIdntfInfo(
    { planId, niin: appliedNiin },
    Boolean(appliedNiin),
  )

  // [디폴트, 검색] 순서. 검색 전이면 디폴트만.
  const list: MockWarSplIdntf[] = [base, found].filter((v): v is MockWarSplIdntf => Boolean(v))

  return (
    // pt-krds-8: 탭(TabList)과 NIIN 검색 섹션 사이 여백(2026-08-11 요청과 동일 간격 유지).
    <div className="flex flex-col gap-krds-7 pt-krds-8 pb-6">
      <WarSplList_NiinSrch
        id="war-spl-idntf-niin"
        value={niin}
        onChange={onNiinChange}
        onSearch={onSearch}
      />

      {/* 식별자료 — 아코디언. 형상자료·참고자료 탭과 동일 구성으로 통일(2026-08-11 요청).
          borderTop 기본값(true) 유지 = 위의 NIIN 검색 영역과 콘텐츠를 가르는 선. */}
      <Accordion type="multiple" defaultValue={['idntf']} className="w-full">
        <AccordionSection value="idntf" title="식별자료" flush>
          <div className="flex flex-col gap-krds-7">
            {list.map((item) => (
              <Table
                // 품명부호(INC)+대체재고번호 조합이 품목 단위 고유값 — 디폴트/검색 블록 구분 key.
                key={`${item.inc}-${item.sbstInvtNo}`}
                rows={IDNTF_FIELDS.map((f) => ({ label: f.label, value: item[f.key] }))}
              />
            ))}
            {list.length === 0 && (
              <p className="py-krds-8 text-[17px] text-krds-text-muted">조회된 자료가 없습니다.</p>
            )}
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
WarSplList_Idntf.displayName = 'WarSplList_Idntf'
