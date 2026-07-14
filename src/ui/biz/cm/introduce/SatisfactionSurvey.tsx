// 만족도 평가 설문 — 국방전자조달 소개/이용안내 페이지 하단 공통. Figma 10020-85349(만족도평가).
// "열람하신 정보에 대해 만족하십니까?" + 라디오(5) + 내용(선택) + 의견제출. 자체 상태·토스트 소유(재사용).
//   - 라디오 미선택 + 의견제출 → 토스트 "페이지 만족도를 선택해주세요."
//   - 내용은 필수 아님.
//   - 라디오 선택 + 의견제출 → 토스트 "평가 참여 감사합니다."
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { TextArea } from '@/ui/common/base/TextArea'
import { RadioButtonGroup } from '@/ui/common/composites/RadioButtonGroup'
import { Toast } from '@/ui/common/composites/Toast'

const SATISFACTION_OPTIONS = [
  { value: 'veryGood', label: '매우만족' },
  { value: 'good', label: '만족' },
  { value: 'normal', label: '보통' },
  { value: 'bad', label: '불만족' },
  { value: 'veryBad', label: '매우 불만족' },
]
const MAX_LEN = 1000

export function SatisfactionSurvey() {
  const [satisfaction, setSatisfaction] = useState('')
  const [content, setContent] = useState('') // 내용(선택 입력)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const handleSubmit = () => {
    // 만족도 미선택 → 토스트 안내(내용은 필수 아님).
    if (!satisfaction) {
      setToast({ open: true, message: '페이지 만족도를 선택해주세요.' })
      return
    }
    console.log('[SatisfactionSurvey] 의견 제출', { satisfaction, content })
    // 추후 API: cmService.submitSatisfaction({ satisfaction, content })
    setToast({ open: true, message: '평가 참여 감사합니다.' })
    setSatisfaction('')
    setContent('')
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-krds-bg-blue-pastel px-4 py-4">
      <div className="flex flex-col gap-krds-7">
        {/* 타이틀 */}
        <div className="flex items-center gap-krds-5">
          <Icon
            name="Recommend"
            size={24}
            fill={1}
            className="shrink-0 text-krds-text-primary-active"
            aria-hidden
          />
          <span className="text-[17px] font-bold leading-normal text-krds-text-primary-active">
            열람하신 정보에 대해 만족하십니까?
          </span>
        </div>

        {/* 만족도 라디오(5) — 한 줄에 2개씩(2열). 마지막 항목은 반쪽 폭으로 단독 배치. */}
        <RadioButtonGroup
          direction="horizontal"
          showIndicator
          value={satisfaction}
          onValueChange={setSatisfaction}
          items={SATISFACTION_OPTIONS}
          itemClassName="flex-none grow-0 basis-[calc(50%_-_4px)] justify-start"
        />

        {/* 내용(선택) + 글자수 카운터 */}
        <div className="flex flex-col gap-krds-5">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LEN}
            placeholder="내용을 입력하세요."
            aria-label="만족도 의견 내용"
          />
          <span className="self-end text-[13px] font-medium leading-normal">
            <span className="text-krds-text-primary-active">{content.length}</span>
            <span className="text-krds-text-muted">/{MAX_LEN.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* 의견제출 */}
      <Button variant="secondary" className="w-full" onClick={handleSubmit}>
        의견제출
      </Button>

      <Toast
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        duration={2000}
      >
        {toast.message}
      </Toast>
    </div>
  )
}
SatisfactionSurvey.displayName = 'SatisfactionSurvey'
