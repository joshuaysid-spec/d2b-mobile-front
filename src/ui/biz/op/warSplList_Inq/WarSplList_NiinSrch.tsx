// 목록정보조회(군수품 목록) 3탭 공통 NIIN 검색 바 — 설계서 01.조달계획 v0.82 slide77~80.
// 설계서 화면 ID 가 없는 하위 조립물이라 상위 화면 ID(WarSplList)에서 파생한 이름을 쓴다.
//
// 설계서 규칙(slide78 주석):
//   - 페이지 접근 시 NIIN 이 있으면 자동 채우기 · 다른 탭에서 NIIN 설정 시 탭에 모두 유지
//     → NIIN 상태는 시트 콘텐츠(WarSplList_Inq)가 소유하고 3탭이 같은 값을 받는다.
//   - 내용이 있으면 삭제(X) 버튼, 없으면 숨김 → onClear 를 값이 있을 때만 넘겨 버튼 자체를 렌더하지 않는다.
// 좌우 패딩 없음 — 바텀시트 본문이 px-16 거터를 제공한다(2중 패딩 금지, BottomSheet.tsx 주석).
// 기존 공통 조립: InputLabel · InputBox · Button · Icon (신규 컴포넌트 없음).
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'

export interface WarSplList_NiinSrchProps {
  /** 입력 중 NIIN(시트 콘텐츠 소유 — 탭 전환해도 유지). */
  value: string
  onChange: (next: string) => void
  /** 검색 실행 — WarSplList_Inq 가 확정값(appliedNiin)으로 옮겨 조회 훅에 넘긴다. */
  onSearch: () => void
  /** 탭마다 input id 가 겹치지 않도록 구분(라벨 htmlFor 연결). */
  id: string
}

export function WarSplList_NiinSrch({ value, onChange, onSearch, id }: WarSplList_NiinSrchProps) {
  return (
    <div className="flex flex-col gap-krds-5">
      <InputLabel htmlFor={id}>NIIN</InputLabel>
      <InputBox
        id={id}
        value={value}
        placeholder="NIIN을 입력하세요."
        onChange={(e) => onChange(e.target.value)}
        // 값이 있을 때만 삭제(X) 버튼 노출 — 설계서 "내용이 없는 경우 삭제 버튼 숨김".
        onClear={value ? () => onChange('') : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch()
        }}
      />
      <Button variant="primary" className="w-full" onClick={onSearch}>
        <Icon name="Search" size={20} />
        검색
      </Button>
    </div>
  )
}
WarSplList_NiinSrch.displayName = 'WarSplList_NiinSrch'
