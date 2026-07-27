// 개인 인증서 확인 — MUI-CM-02-P11 인증서확인(CrtfIdnty). 개인신원확인(M06)의 인증서 비밀번호 확인 단계(설계서 00.공통 v0.84 slide201).
// BottomSheet 콘텐츠 전용 컴포넌트(컨테이너/footer/open 은 부모 IndvIdntIdntyPage 가 소유 — CLAUDE.md 바텀시트 패턴).
// 안내문 + 선택된 인증서 카드 + 인증서 비밀번호 입력(+ 인증 실패 메시지).
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import type { CertItem } from '@/types/cm'

export interface IndvIdntIdnty_CrtfCnfrmProps {
  /** 선택된 개인 인증서. */
  cert: CertItem
  /** 인증서 비밀번호(부모가 소유 — 인증하기 실행 시 검증). */
  password: string
  onPasswordChange: (value: string) => void
  /** 인증 실패 메시지(있으면 입력창 에러 표시). */
  errorMessage?: string | null
}

export function IndvIdntIdnty_CrtfCnfrm({
  cert,
  password,
  onPasswordChange,
  errorMessage,
}: IndvIdntIdnty_CrtfCnfrmProps) {
  return (
    <div className="flex flex-col gap-krds-8">
      <p className="text-[17px] leading-normal text-krds-text-ink">
        선택한 인증서로 개인 인증을 하시겠습니까?
      </p>

      {/* 선택된 인증서 */}
      <div className="flex flex-col gap-krds-5">
        <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
          선택된 인증서
        </span>
        <CertCard cert={cert} />
      </div>

      {/* 인증서 비밀번호 */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="indv-idnt-password">인증서 비밀번호</InputLabel>
        <InputBox
          id="indv-idnt-password"
          type="password"
          value={password}
          error={!!errorMessage}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => onPasswordChange(e.target.value)}
          onClear={() => onPasswordChange('')}
          aria-label="인증서 비밀번호"
        />
        {errorMessage && <InputMessage type="error">{errorMessage}</InputMessage>}
      </div>
    </div>
  )
}
IndvIdntIdnty_CrtfCnfrm.displayName = 'IndvIdntIdnty_CrtfCnfrm'
