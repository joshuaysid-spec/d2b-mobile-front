// 인증서 삭제 — MUI-CM-04-P15. Figma 10020-82081.
// BottomSheet 콘텐츠 전용 컴포넌트(컨테이너/footer 는 부모 CrtfMngPage 가 소유 — CLAUDE.md 바텀시트 패턴).
// 안내문 + 선택된 인증서 카드 + 인증서 비밀번호 입력. (가상 보안 키패드는 스마트PKI 솔루션 제공 — 추후)
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import type { CertItem } from '@/types/cert'

export interface CrtfDelPageProps {
  /** 삭제 대상(선택된 인증서). */
  cert: CertItem
  /** 인증서 비밀번호(부모가 소유 — 삭제 실행 시 검증). */
  password: string
  onPasswordChange: (value: string) => void
  /** 비밀번호 미입력 에러 메시지(부모가 삭제하기 시 설정). 있으면 필드 error 상태 + 메시지 표시. */
  errorMessage?: string
}

export function CrtfDelPage({ cert, password, onPasswordChange, errorMessage }: CrtfDelPageProps) {
  const hasError = Boolean(errorMessage)
  return (
    <div className="flex flex-col gap-krds-8">
      <p className="whitespace-pre-line text-[17px] leading-normal text-krds-text-ink">
        {'선택하신 인증서는 스마트폰에서 삭제되는 것이며, 다른 디바이스에 저장된 인증서는 사용할 수 있습니다.\n선택한 인증서를 삭제하시겠습니까?'}
      </p>

      {/* 선택된 인증서 */}
      <div className="flex flex-col gap-krds-5">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">선택된 인증서</span>
        <CertCard cert={cert} />
      </div>

      {/* 인증서 비밀번호 — Label + Input + Message(error) 결합 폼 필드 */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="crtf-password">인증서 비밀번호</InputLabel>
        <InputBox
          id="crtf-password"
          type="password"
          value={password}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => onPasswordChange(e.target.value)}
          onClear={() => onPasswordChange('')}
          error={hasError}
          aria-label="인증서 비밀번호"
          aria-invalid={hasError}
          aria-describedby={hasError ? 'crtf-password-error' : undefined}
        />
        {hasError && (
          <InputMessage id="crtf-password-error" type="error">
            {errorMessage}
          </InputMessage>
        )}
      </div>
    </div>
  )
}
CrtfDelPage.displayName = 'CrtfDelPage'
