// MUI-CM-06-P07 업무캘린더 일정 상세 정보 — 바텀시트 콘텐츠(컨테이너/footer 는 부모 TaskCldrPage 소유).
// 설계서 00.공통 v0.84 slide86 / Figma 10020:87455. 개인이 등록한 일정 상세 표시.
//
// Figma 실측(px, 1:1):
//   블록 gap 16(krds-8) · 각 블록 label→value gap 8(krds-5).
//   label = m_input_label(17 Bold ink) · value = 17 Regular ink, leading 1.5.
//   내용은 여러 줄 그대로(줄바꿈 보존). 필드: 선택 날짜 / 제목 / 내용.
//   footer(삭제·수정)는 부모가 BottomSheet footer 로 소유.
import dayjs from 'dayjs'

import type { TaskCldrItem } from '@/types/cm'

export interface TaskCldrDtlProps {
  item: TaskCldrItem
}

// 라벨 + 값 블록 — label 17 Bold, value 17 Regular(줄바꿈 보존).
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-krds-5">
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{label}</p>
      <p className="w-full whitespace-pre-line text-[17px] leading-normal text-krds-text-ink">
        {value}
      </p>
    </div>
  )
}

export function TaskCldrDtl({ item }: TaskCldrDtlProps) {
  // 선택 날짜 — 'YYYY년 M월 D일'(설계서/Figma '2026년 8월 12일').
  const dateLabel = item.schdlDt ? dayjs(item.schdlDt).format('YYYY년 M월 D일') : ''

  return (
    <div className="flex w-full flex-col gap-krds-8">
      <Field label="선택 날짜" value={dateLabel} />
      <Field label="제목" value={item.schdlTtl ?? ''} />
      <Field label="내용" value={item.schdlCn ?? ''} />
    </div>
  )
}
TaskCldrDtl.displayName = 'TaskCldrDtl'
