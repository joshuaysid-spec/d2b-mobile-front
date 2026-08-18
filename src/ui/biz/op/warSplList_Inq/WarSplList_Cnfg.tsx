// 형상자료 (MUI-OP-01-T73, WarSplList_Cnfg) — 설계서 01.조달계획 v0.82 slide78.
// 목록정보 조회 바텀시트(WarSplList_Inq) '형상자료' 탭 콘텐츠.
// 구성: NIIN 검색 + 식별정보(dm_itemInfo) + 참조번호(dl_refList 건별 테이블 반복).
//       참조번호 건마다 '업체정보' 아코디언(MUI-OP-01-P77 콘텐츠) — 사용자 확정(2026-08-18):
//       구 '업체정보 보기' 버튼 + 바텀시트 폐기, 아코디언으로 표현(펼침 시 생산자부호로 조회).
// 표시 규칙(사용자 확정 2026-08-11): 각 영역의 내용은 **해당 연간조달계획의 디폴트 값**이고,
//   NIIN 검색 시 그 **디폴트 값 아래로 검색 결과가 이어붙는다**(교체 아님).
//   → 조회를 디폴트(niin 없음) / 검색(niin 있음) 두 갈래로 호출하고 영역별로 concat 한다.
//   ⚠️ 재검색 시 이어붙은 블록은 마지막 검색 결과로 교체된다(검색마다 무한 누적하지 않음).
// 시트 본문(px-16) 안이라 AccordionSection 은 flush(콘텐츠 좌우 패딩 제거 — 2중 패딩 방지).
import { useWarSplCnfg } from '@/queries/op'
import type { WarSplItemInfo } from '@/types/op'
import { cn } from '@/utils/cn'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { WarSplList_BzEnty } from '@/ui/biz/op/warSplList_Inq/WarSplList_BzEnty'
import { WarSplList_NiinSrch } from '@/ui/biz/op/warSplList_Inq/WarSplList_NiinSrch'

export interface WarSplList_CnfgProps {
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

// 식별정보(dm_itemInfo) 1건 → 테이블 행 4개.
function toItemRows(info: WarSplItemInfo): TableRow[] {
  return [
    { label: '재고번호', value: info.invtNo },
    { label: '영문품명', value: info.itemNmEng },
    { label: '한글품명', value: info.itemNmKor },
    { label: '군급', value: info.fsc },
  ]
}

export function WarSplList_Cnfg({
  planId,
  niin,
  onNiinChange,
  onSearch,
  appliedNiin,
}: WarSplList_CnfgProps) {
  // 디폴트(연간조달계획 보유값) + 검색 결과 — 검색 결과는 디폴트 아래에 이어붙는다.
  const { data: base } = useWarSplCnfg({ planId })
  const { data: found } = useWarSplCnfg({ planId, niin: appliedNiin }, Boolean(appliedNiin))

  // 영역별로 [디폴트, 검색] 순서 concat. 검색 전이면 디폴트만.
  const itemInfoList: WarSplItemInfo[] = [base?.itemInfo, found?.itemInfo].filter(
    (v): v is WarSplItemInfo => Boolean(v),
  )
  const refList = [...(base?.refList ?? []), ...(found?.refList ?? [])]

  return (
    // pt-krds-8: 탭(TabList)과 NIIN 검색 섹션 사이 여백(2026-08-11 요청과 동일 간격 유지).
    <div className="flex flex-col gap-krds-7 pt-krds-8 pb-6">
      <WarSplList_NiinSrch
        id="war-spl-cnfg-niin"
        value={niin}
        onChange={onNiinChange}
        onSearch={onSearch}
      />

      {/* 식별정보 · 참조번호 — 아코디언(2026-08-11 요청). 기본 모두 펼침. */}
      <Accordion type="multiple" defaultValue={['itemInfo', 'refNo']} className="w-full">
        {/* 식별정보 — 디폴트 + 검색 결과.
            첫 섹션이지만 borderTop 을 켜 둔다 — 위의 NIIN 검색 영역과 콘텐츠를 가르는 선. */}
        <AccordionSection value="itemInfo" title="식별정보" flush>
          <div className="flex flex-col gap-krds-7">
            {itemInfoList.map((info) => (
              <Table key={info.invtNo} rows={toItemRows(info)} />
            ))}
            {itemInfoList.length === 0 && (
              <p className="py-krds-8 text-[17px] text-krds-text-muted">조회된 자료가 없습니다.</p>
            )}
          </div>
        </AccordionSection>

        {/* 참조번호 — 건별 테이블 + 업체정보 아코디언 (디폴트 + 검색 결과) */}
        <AccordionSection value="refNo" title="참조번호" flush>
          <div className="flex flex-col gap-krds-7">
            {refList.map((ref, i) => (
              <div
                key={ref.id}
                // 앞 건과 헷갈리지 않도록 2건째부터 상단 구분선(2026-08-11 요청).
                // pb-krds-5: 업체정보 버튼 아래 공백 — 참조번호+업체정보가 한 건(블록)임을
                // 다음 건과의 간격으로 명확히 표시(2026-08-18 요청).
                className={cn(
                  'flex flex-col gap-krds-5 pb-krds-5',
                  i > 0 && 'border-t border-krds-border-divider pt-krds-7',
                )}
              >
                <Table
                  rows={[
                    { label: '참조번호', value: ref.rfrncNo },
                    { label: '구분', value: ref.type },
                    { label: '생산자부호', value: ref.prdctnCd },
                    { label: '생산자명', value: ref.prdctnNm },
                  ]}
                />
                {/* 업체정보 (MUI-OP-01-P77) — 사용자 확정(2026-08-18): 바텀시트 대신 건별 아코디언.
                    펼칠 때만 콘텐츠(WarSplList_BzEnty)가 마운트 → 생산자부호 조회 실행.
                    트리거는 참조번호 안의 이벤트 요소임이 드러나도록 Button(secondary) 스타일로
                    오버라이드(2026-08-18 요청) — 값은 base/Button secondary + size default 와 동일. */}
                <Accordion type="multiple" className="w-full">
                  <AccordionSection
                    value={`bzenty-${ref.id}`}
                    title="업체정보"
                    flush
                    borderTop={false}
                    triggerClassName={cn(
                      'min-h-12 rounded-krds-8 border border-krds-border-primary bg-white',
                      'px-krds-5 py-krds-3 text-krds-body-md font-bold text-krds-text-primary',
                      'active:bg-krds-action-pressed',
                    )}
                    contentClassName="pt-krds-5"
                  >
                    <WarSplList_BzEnty prdctnCd={ref.prdctnCd} />
                  </AccordionSection>
                </Accordion>
              </div>
            ))}
            {refList.length === 0 && (
              <p className="py-krds-8 text-[17px] text-krds-text-muted">참조번호가 없습니다.</p>
            )}
          </div>
        </AccordionSection>
      </Accordion>
    </div>
  )
}
WarSplList_Cnfg.displayName = 'WarSplList_Cnfg'
