// 인증서 삭제 — MUI-CM-04-P15. Figma 10020-82081.
// BottomSheet 콘텐츠 전용 컴포넌트(컨테이너/footer 는 부모 CrtfMngPage 가 소유 — CLAUDE.md 바텀시트 패턴).
// 안내문 + 선택된 인증서 카드 + 인증서 비밀번호 입력. (가상 보안 키패드는 스마트PKI 솔루션 제공 — 추후)
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import type { CertItem } from '@/types/cm'

export interface CrtfDelPageProps {
  /** 삭제 대상(선택된 인증서). */
  cert: CertItem
  /** 인증서 비밀번호(부모가 소유 — 삭제 실행 시 검증). */
  password: string
  onPasswordChange: (value: string) => void
}

export function CrtfDelPage({ cert, password, onPasswordChange }: CrtfDelPageProps) {
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

      {/* 인증서 비밀번호 */}
      <div className="flex flex-col gap-krds-5">
        <InputLabel htmlFor="crtf-password">인증서 비밀번호</InputLabel>
        <InputBox
          id="crtf-password"
          type="password"
          value={password}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => onPasswordChange(e.target.value)}
          onClear={() => onPasswordChange('')}
          aria-label="인증서 비밀번호"
        />
      </div>
    </div>
  )
}
CrtfDelPage.displayName = 'CrtfDelPage'
