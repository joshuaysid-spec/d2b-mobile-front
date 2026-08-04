// 의견작성 — MUI-TS-01-P03 BfhdLoiWrt. 설계서 06.업무지원 v0.82 slide15, 17.
// 품목명세서(T02)에서 [의견작성] 클릭 → 바텀시트 콘텐츠(제조/구매 선택 + 의견 입력).
// 바텀시트 콘텐츠 전용 — BottomSheet 컨테이너/footer([임시저장/제출])와 폼 상태는 부모(T02)가 소유
//   (footer 버튼이 폼 값을 검증·제출해야 하므로 상태를 부모로 올림 — 검증 메시지는 설계서가
//    인라인이 아닌 확인 모달로 정의(slide15)라 RHF 대신 부모의 명시적 체크 + AlertModal 사용).
import { InputLabel } from '@/ui/common/base/InputLabel'
import { SelectBox } from '@/ui/common/base/SelectBox'
import { TextArea } from '@/ui/common/base/TextArea'

// 제조/구매 선택 옵션 (mnftrPrchsSecd, slide17 1.4 — 제조/구매/의견작성 선택 가능)
const MNFTR_PRCHS_OPTIONS = [
  { value: '제조', label: '제조' },
  { value: '구매', label: '구매' },
  { value: '의견작성', label: '의견작성' },
]

export interface BfhdLoiWrtProps {
  /** 제조/구매 선택값 (mnftrPrchsSecd) — 부모(T02) 소유. */
  mnftrPrchsSecd: string
  onMnftrPrchsSecdChange: (value: string) => void
  /** 의견 (etcOpnnCn, 4000) — 부모(T02) 소유. */
  etcOpnnCn: string
  onEtcOpnnCnChange: (value: string) => void
}

export function BfhdLoiWrt({
  mnftrPrchsSecd,
  onMnftrPrchsSecdChange,
  etcOpnnCn,
  onEtcOpnnCnChange,
}: BfhdLoiWrtProps) {
  return (
    <div className="flex flex-col gap-krds-7">
      {/* 제조/구매 선택 (slide15 1]) */}
      <div className="flex flex-col gap-krds-3">
        <InputLabel required>제조/구매</InputLabel>
        <SelectBox
          items={MNFTR_PRCHS_OPTIONS}
          value={mnftrPrchsSecd || undefined}
          onValueChange={onMnftrPrchsSecdChange}
          placeholder="선택해주세요."
          aria-label="제조/구매"
        />
      </div>

      {/* 의견 입력 (slide15 2]) */}
      <div className="flex flex-col gap-krds-3">
        <InputLabel required>의견</InputLabel>
        <TextArea
          value={etcOpnnCn}
          onChange={(e) => onEtcOpnnCnChange(e.target.value)}
          placeholder="의견을 작성하세요."
          maxLength={4000}
        />
      </div>
    </div>
  )
}
BfhdLoiWrt.displayName = 'BfhdLoiWrt'
