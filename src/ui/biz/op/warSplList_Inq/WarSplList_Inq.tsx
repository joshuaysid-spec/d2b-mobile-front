// 목록정보 조회 (MUI-OP-01-P76, WarSplList_Inq) — 설계서 01.조달계획 v0.82 slide77(p76).
// 조달계획 통합목록의 검색유형 '연간조달계획'(annual) 카드 클릭 시 열리는 바텀시트의 **콘텐츠 전용** 컴포넌트.
// 컨테이너(<BottomSheet title="목록정보 조회" footer={닫기}>)는 부모(PrcmPlanIntgListPage)가 소유한다
// — CLAUDE.md "BottomSheet 는 전용 래퍼(*Sheet)를 만들지 않는다".
//   (사용자 확정 2026-08-18: 구 /op/ovs/:id 상세 페이지 진입 → 목록 위 바텀시트로 변경)
// 구성: 탭 3개 — 형상자료(MUI-OP-01-T73)/식별자료(T74)/참고자료(T75). 탭 콘텐츠는 같은 폴더의 탭별 컴포넌트.
import { useState } from 'react'

import { TabList, type TabItem } from '@/ui/common/composites/TabList'
import { WarSplList_Cnfg } from '@/ui/biz/op/warSplList_Inq/WarSplList_Cnfg'
import { WarSplList_Idntf } from '@/ui/biz/op/warSplList_Inq/WarSplList_Idntf'
import { WarSplList_Ref } from '@/ui/biz/op/warSplList_Inq/WarSplList_Ref'

// ── 탭 (목록정보조회 — 형상자료 T73 / 식별자료 T74 / 참고자료 T75) ────────────
const TABS: TabItem[] = [
  { value: 'cnfg', label: '형상자료' },
  { value: 'idntf', label: '식별자료' },
  { value: 'ref', label: '참고자료' },
]

export interface WarSplList_InqProps {
  /** 연간조달계획 식별자(클릭한 카드의 id) — 3탭의 디폴트 값 조회 기준. */
  planId: string
}

export function WarSplList_Inq({ planId }: WarSplList_InqProps) {
  const [tab, setTab] = useState('cnfg')

  // NIIN — 설계서 slide78 "다른 탭 페이지에서 NIIN 설정 시 탭에 모두 NIIN 유지" 규칙 때문에
  // 시트 콘텐츠(여기)가 소유하고 3탭에 그대로 내려준다. 검색 실행 시에만 appliedNiin 이 확정되고,
  // 각 탭은 디폴트 조회 결과 아래에 이 NIIN 의 검색 결과를 이어붙인다.
  // 시트가 닫히면(Radix Dialog 언마운트) 탭/NIIN 상태는 초기화된다(의도된 동작).
  const [niin, setNiin] = useState('')
  const [appliedNiin, setAppliedNiin] = useState('')
  const handleNiinSearch = () => setAppliedNiin(niin.trim())

  const renderTabContent = (current: string) => {
    // 3탭 공통 — 계획 id + NIIN 입력값/확정값과 핸들러를 동일하게 전달(탭 전환해도 값 유지).
    const tabProps = {
      planId,
      niin,
      onNiinChange: setNiin,
      onSearch: handleNiinSearch,
      appliedNiin,
    }
    switch (current) {
      case 'cnfg':
        return <WarSplList_Cnfg {...tabProps} />
      case 'idntf':
        return <WarSplList_Idntf {...tabProps} />
      case 'ref':
        return <WarSplList_Ref {...tabProps} />
      default:
        return null
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 탭 — 시트 본문이 좌우 px-16 거터를 제공하므로 별도 px 래퍼 없음 */}
      <TabList value={tab} onChange={setTab} items={TABS} />
      {renderTabContent(tab)}
    </div>
  )
}
WarSplList_Inq.displayName = 'WarSplList_Inq'
