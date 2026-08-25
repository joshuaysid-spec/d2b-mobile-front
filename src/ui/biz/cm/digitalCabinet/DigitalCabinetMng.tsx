// MUI-CM-06-P15 폴더 설정 권한 관리 (DigitalCabinetMng). 설계서 00.공통 v0.84 slide109·110.
// 디지털캐비닛 폴더의 폴더명·폴더사이즈(읽기전용) + 사용자별 접근권한(쓰기/읽기/없음) 조정 팝업의 **콘텐츠**.
//   컨테이너(BottomSheet)·footer(취소/저장)·open 상태는 부모(DigitalCabinetPage)가 소유 —
//   이 컴포넌트는 폼 콘텐츠만 렌더한다(CLAUDE 규칙: BottomSheet 전용 래퍼 금지, 콘텐츠만 분리).
//   권한 설정은 업체 대표자만 가능(진입 제어는 부모). 저장 시 토스트("변경 저장 되었습니다.")도 부모.
//
// 데이터영역: 폴더 dl_digitalCabinetFldrList · 권한 dl_digitalCabinetAuthrtList(접근권한 GTSC0009).
// controlled — 편집 중 권한값은 부모가 소유(저장 버튼이 부모 footer 라서). value/onChange 로 연결.
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import type { DigitalCabinetAuthrtSe, DigitalCabinetFldr } from '@/types/mock/cm'

// 접근권한 코드(GTSC0009) — 라벨은 설계서 표기(쓰기/읽기/없음). ⚠️ 실제 코드값은 API 연동 시 확인.
const AUTHRT_ITEMS: { value: DigitalCabinetAuthrtSe; label: string }[] = [
  { value: 'write', label: '쓰기' },
  { value: 'read', label: '읽기' },
  { value: 'none', label: '없음' },
]

interface DigitalCabinetMngProps {
  /** 대상 폴더(폴더명/사이즈/권한 목록). */
  folder: DigitalCabinetFldr
  /** 편집 중 사용자별 권한값(userNm → authrtSe). 부모가 소유(저장이 부모 footer). */
  value: Record<string, DigitalCabinetAuthrtSe>
  /** 사용자 권한 변경 콜백. */
  onChange: (userNm: string, authrtSe: DigitalCabinetAuthrtSe) => void
}

export function DigitalCabinetMng({ folder, value, onChange }: DigitalCabinetMngProps) {
  return (
    <div className="flex flex-col gap-krds-8 py-1">
      {/* 폴더명 (읽기전용) */}
      <div className="flex flex-col gap-krds-3">
        <InputLabel required>폴더명</InputLabel>
        <InputBox value={folder.fldrNm} disabled readOnly />
      </div>

      {/* 폴더 사이즈 (읽기전용) */}
      <div className="flex flex-col gap-krds-3">
        <InputLabel required>폴더 사이즈</InputLabel>
        <InputBox value={folder.fldrSz} disabled readOnly />
      </div>

      {/* 사용자 권한 — 사용자별 라디오(쓰기/읽기/없음) */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel required>사용자 권한</InputLabel>
        <ul className="flex flex-col gap-krds-7">
          {(folder.authrtList ?? []).map((u) => (
            <li
              key={u.userNm}
              className="flex flex-col gap-krds-5 rounded-krds-8 border border-krds-border-field p-krds-7"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
                  {u.userNm}
                </span>
                {u.mdfcnDt && (
                  <span className="text-[15px] leading-normal text-krds-text-muted">
                    수정일시 {u.mdfcnDt}
                  </span>
                )}
              </div>
              <RadioButtonGroup
                aria-label={`${u.userNm} 접근권한`}
                items={AUTHRT_ITEMS}
                value={value[u.userNm]}
                onValueChange={(v) => onChange(u.userNm, v as DigitalCabinetAuthrtSe)}
                direction="horizontal"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
DigitalCabinetMng.displayName = 'DigitalCabinetMng'
