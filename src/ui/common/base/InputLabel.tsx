// Figma m_input_label(9300-27867) 1:1.
// Input 위에 붙는 17px Bold 라벨. required=true 면 좌측 빨강 `*` 표시 (Figma 디폴트 ON).
//
// 기존 Label(15px Medium) 과 의도가 다르다 — Label 은 라디오/체크박스 옆 짧은 칩 라벨,
// InputLabel 은 InputBox/SelectBox/TextArea/DateInput 위에 올리는 폼 필드 라벨.
//
// 사용 예:
//   <InputLabel htmlFor="email" required>이메일</InputLabel>
//   <InputBox id="email" />
import * as React from 'react'

import { Label as RawLabel } from '@/ui/raw/label'
import { cn } from '@/utils/cn'

export interface InputLabelProps
  extends React.ComponentPropsWithoutRef<typeof RawLabel> {
  /** 필수 입력 표시 (`*`). Figma 디폴트 true. */
  required?: boolean
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, required = true, children, ...props }, ref) => (
    <RawLabel
      ref={ref}
      className={cn(
        'flex items-start gap-0.5 text-[17px] font-bold leading-[1.5] text-krds-text-ink',
        className,
      )}
      {...props}
    >
      {required && (
        <span
          aria-hidden="true"
          className="shrink-0 text-center text-krds-action-danger"
        >
          *
        </span>
      )}
      <span className="min-w-px flex-1 break-words">{children}</span>
    </RawLabel>
  ),
)
InputLabel.displayName = 'InputLabel'

export { InputLabel }
