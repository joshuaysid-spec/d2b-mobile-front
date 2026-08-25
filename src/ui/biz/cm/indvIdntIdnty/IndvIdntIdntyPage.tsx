// 개인 신원 확인 — MUI-CM-02-M06. 설계서 00.공통 v0.84 slide199~201.
// 레이아웃은 Figma 87175(생체인증) 템플릿 참고, 내용/흐름은 설계서.
// ⚠️ v0.84 목록표의 인증서관리(MUI-CM-02-M10 CrtfMng)·인증서확인(MUI-CM-02-P11 CrtfIdnty)은 별도 화면이 아니라
//   이 화면 내 시트로 처리(설계서 경로도 IndvIdntIdntyPage 재사용 표기): 인증서 선택 시트=M10 · 비밀번호 확인 시트=P11.
//
// 흐름:
//   랜딩(v0.86 slide204): 아이콘 + 안내문 "개인 신원 확인을 진행합니다." + 본문 안내 문구 + [개인신원확인]
//   (2026-08-25 사용자 확정 — 구 도움말(HelpDisclosure) 박스를 설계서처럼 페이지 본문 문구로 이동, [취소] 버튼 삭제)
//   → [개인신원확인] → 인증서 선택 BottomSheet(slide200, "개인 인증서" — 개인 보유 인증서 목록)
//   → 인증서 행 클릭 → 개인 인증서 확인 BottomSheet(slide201, 비밀번호 입력)
//   → [인증하기] 성공 → 랜딩 복귀 + 토스트 "인증이 완료되었습니다." / 실패 → 시트 유지 + 에러 메시지.
//
// 인증서 목록/카드는 인증서 관리(MUI-CM-04-M14) 화면 자산 재활용(CertCard + MOCK_CERTS).
// 인증서 비밀번호 검증은 스마트PKI 솔루션 제공 — 데모는 고정값 비교(추후 API 로 교체).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import { MOCK_CERTS } from '@/ui/biz/cm/crtfMng/certMock'
import { IndvIdntIdnty_CrtfCnfrm } from '@/ui/biz/cm/indvIdntIdnty/IndvIdntIdnty_CrtfCnfrm'
import type { CertItem } from '@/types/mock/cm'

// 데모용 비밀번호 — 실제 검증은 스마트PKI 솔루션.
const MOCK_PASSWORD = '1234'

export function IndvIdntIdntyPage() {
  const [selectOpen, setSelectOpen] = useState(false) // 인증서 선택 시트(slide200)
  const [confirmCert, setConfirmCert] = useState<CertItem | null>(null) // 선택된 인증서(=확인 시트 열림, slide201)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  // 인증서 선택(slide200) → 확인 시트(slide201) 로 전환.
  const handleSelectCert = (cert: CertItem) => {
    setSelectOpen(false)
    setPassword('')
    setAuthError(null)
    setConfirmCert(cert)
  }

  const closeConfirm = () => {
    setConfirmCert(null)
    setPassword('')
    setAuthError(null)
  }

  // 인증하기(slide201) — 성공 시 랜딩 복귀 + 토스트, 실패 시 시트 유지 + 에러.
  const handleAuthenticate = () => {
    if (!confirmCert) return
    // 추후 API: 스마트PKI 솔루션으로 인증서 비밀번호 검증. 데모는 고정값 비교.
    if (password !== MOCK_PASSWORD) {
      setAuthError('인증서 암호를 정확히 입력해주세요.')
      return
    }
    console.log('[IndvIdntIdnty] 개인 신원 확인 완료', confirmCert.id)
    closeConfirm()
    setToast({ open: true, message: '인증이 완료되었습니다.' })
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* 본문 — 세로 중앙 정렬(Figma 87175 레이아웃) */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-7 px-4 py-8">
        {/* 아이콘 박스 — 80px, rounded-27, border-field, 흰 bg */}
        <div className="flex size-20 items-center justify-center rounded-[27px] border-[1.333px] border-krds-border-field bg-background p-krds-7">
          <Icon name="VerifiedUser" size={40} fill={1} aria-hidden className="text-krds-text-primary" />
        </div>
        {/* 안내문 — 24px Bold 중앙 */}
        <p className="text-center text-[24px] font-bold leading-normal text-krds-text-ink">
          개인 신원 확인을 진행합니다.
        </p>
        {/* 본문 안내 문구 — 설계서 v0.86 slide204 그대로(구 도움말 박스에서 이동, 사용자 확정 2026-08-25) */}
        <p className="text-center text-[17px] leading-normal text-krds-text-muted">
          개인신원확인 버튼을 클릭하여 인증서 창을 띄울 수 있습니다.
          <br />
          인증서 창이 나타나면 [조달테스트4]님의 개인인증서를 선택하십시오.
        </p>
      </div>

      {/* 하단 버튼 — [개인신원확인] 단독(설계서 slide204 — [취소] 삭제, 사용자 확정 2026-08-25) */}
      <div className="p-krds-8">
        <Button variant="primary" className="w-full" onClick={() => setSelectOpen(true)}>
          개인신원확인
        </Button>
      </div>

      {/* 인증서 선택 BottomSheet(slide200) — "개인 인증서" = MUI-CM-02-M10 인증서관리(CrtfMng). 컨테이너/open 은 부모 소유, 콘텐츠(카드 목록)는 인라인. */}
      <BottomSheet open={selectOpen} onOpenChange={setSelectOpen} title="개인 인증서">
        <div className="flex flex-col gap-krds-5">
          {MOCK_CERTS.map((c) => (
            <CertCard key={c.id} cert={c} onClick={() => handleSelectCert(c)} />
          ))}
        </div>
      </BottomSheet>

      {/* 개인 인증서 확인 BottomSheet(slide201) — 비밀번호 입력 = MUI-CM-02-P11 인증서확인(CrtfIdnty). footer 는 부모 소유, 콘텐츠는 IndvIdntIdnty_CrtfCnfrm. */}
      <BottomSheet
        open={confirmCert !== null}
        onOpenChange={(o) => {
          if (!o) closeConfirm()
        }}
        title="개인 인증서 확인"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: closeConfirm },
              { label: '인증하기', variant: 'primary', onClick: handleAuthenticate },
            ]}
          />
        }
      >
        {confirmCert && (
          <IndvIdntIdnty_CrtfCnfrm
            cert={confirmCert}
            password={password}
            onPasswordChange={(v) => {
              setPassword(v)
              if (authError) setAuthError(null)
            }}
            errorMessage={authError}
          />
        )}
      </BottomSheet>

      {/* 인증 완료 토스트 — 랜딩 복귀 후 표시. */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))} duration={2000}>
        {toast.message}
      </Toast>
    </div>
  )
}
IndvIdntIdntyPage.displayName = 'IndvIdntIdntyPage'
