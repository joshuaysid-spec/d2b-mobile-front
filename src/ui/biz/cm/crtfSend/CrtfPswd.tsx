// 인증서 비밀번호 확인 — MUI-CM-04-P18. 설계서 00.공통 v0.84 slide354(p353).
// 인증서 내보내기(CrtfSend)·가져오기(CrtfReceive) 시 인증서 비밀번호 확인 팝업의
// BottomSheet 콘텐츠 전용 컴포넌트 — 컨테이너/footer([취소][완료])/open 은 부모 페이지가 소유(CLAUDE.md 바텀시트 패턴).
// 설계서의 "보안 키패드 영역"(인증서 가상 키패드)은 스마트PKI 솔루션 경계 — 데모는 기본 키보드 입력.
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'

export interface CrtfPswdProps {
  /** 인증서 비밀번호(부모가 소유 — 완료 실행 시 검증). */
  password: string
  onPasswordChange: (value: string) => void
  /** 검증 실패 메시지(있으면 입력창 에러 표시). 예: "인증번호가 틀렸습니다." */
  errorMessage?: string | null
}

export function CrtfPswd({ password, onPasswordChange, errorMessage }: CrtfPswdProps) {
  return (
    <div className="flex flex-col gap-krds-8">
      {/* 안내문 — 설계서 slide354 문구 그대로 */}
      <p className="text-[17px] leading-normal text-krds-text-ink">
        인증서 가져오기, 내보내기에 사용되는 인증서의 비밀번호를 확인합니다.
      </p>

      {/* 인증서 비밀번호 */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="crtf-pswd">인증서 비밀번호</InputLabel>
        <InputBox
          id="crtf-pswd"
          type="password"
          value={password}
          error={!!errorMessage}
          placeholder="인증서의 비밀번호를 입력해주세요."
          onChange={(e) => onPasswordChange(e.target.value)}
          onClear={() => onPasswordChange('')}
          aria-label="인증서 비밀번호"
        />
        {errorMessage && <InputMessage type="error">{errorMessage}</InputMessage>}
      </div>
    </div>
  )
}
CrtfPswd.displayName = 'CrtfPswd'
