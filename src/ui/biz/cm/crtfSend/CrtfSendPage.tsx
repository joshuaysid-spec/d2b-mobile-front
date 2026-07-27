// 인증서 내보내기 — MUI-CM-04-M17. Figma 10020-87296(목록)·87316(선택됨) / 설계서 00.공통 v0.83 slide340.
// 스마트폰 → PC 인증서 복사. ① 내보낼 인증서 선택(목록) → 인증서 비밀번호 확인(P18, CrtfPswd 시트)
// → ② 선택된 인증서 + 인증번호(복사용) 표시. 인증 결과 안내는 토스트(MUI-CM-04-P19, slide355).
// 비밀번호 실검증은 스마트PKI 솔루션 — 데모는 고정값 비교(추후 교체).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import { CertInfoBox } from '@/ui/biz/cm/crtfMng/CertInfoBox'
import { MOCK_CERTS } from '@/ui/biz/cm/crtfMng/certMock'
import { CrtfPswd } from '@/ui/biz/cm/crtfSend/CrtfPswd'
import type { CertItem } from '@/types/cm'

// 데모용 인증서 비밀번호 — 실제 검증은 스마트PKI 솔루션(IndvIdntIdnty 와 동일 데모값).
const MOCK_PASSWORD = '1234'

// 복사용 인증번호(12자리, 4×3) — PC 가 입력할 값. 스마트PKI 발급값, 데모 고정.
const AUTH_BLOCKS = ['1234', '5678', '9012']
const GUIDE = [
  'PC 화면의 인증서 가져오기, 내보내기 화면에 표시되는 인증번호 12자리를 입력하여 인증서 내보내기를 하실 수 있습니다.',
  '스마트폰 → PC 로 인증서를 내보냅니다.',
]

export function CrtfSendPage() {
  const [selected, setSelected] = useState<CertItem | null>(null)
  const [pendingCert, setPendingCert] = useState<CertItem | null>(null) // P18 열림 = 비밀번호 확인 대기 인증서
  const [password, setPassword] = useState('')
  const [pswdError, setPswdError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  // ① 인증서 클릭 → 비밀번호 확인 시트(P18) 열기.
  const openPswd = (cert: CertItem) => {
    setPassword('')
    setPswdError(null)
    setPendingCert(cert)
  }
  const closePswd = () => {
    setPendingCert(null)
    setPassword('')
    setPswdError(null)
  }

  // P18 완료 — 성공 시 ② 표시 + 토스트(P19), 실패 시 시트 유지 + 에러(설계서 slide354 문구).
  const handlePswdConfirm = () => {
    if (!pendingCert) return
    if (password.trim() === '') {
      setPswdError('인증서의 비밀번호를 입력해주세요.')
      return
    }
    // 추후 API: 스마트PKI 솔루션으로 인증서 비밀번호 검증. 데모는 고정값 비교.
    if (password !== MOCK_PASSWORD) {
      setPswdError('인증번호가 틀렸습니다.')
      return
    }
    console.log('[CrtfSend] 인증서 비밀번호 확인 완료', pendingCert.id)
    setSelected(pendingCert)
    closePswd()
    setToast({ open: true, message: '인증 되었습니다.' }) // P19 토스트
  }

  // 인증번호(12자리) 클립보드 복사 + 토스트.
  const handleCopy = async () => {
    const code = AUTH_BLOCKS.join('')
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // 클립보드 API 미지원/거부 시에도 안내는 노출(WebView 환경 대응).
    }
    setToast({ open: true, message: '인증번호가 복사되었습니다.' })
    console.log('[CrtfSend] 인증번호 복사', code)
  }

  return (
    <div className="flex w-full flex-col">
      {!selected ? (
        // ① 인증서 선택(목록)
        <div className="flex w-full flex-col gap-4 px-4 py-5">
          <p className="whitespace-pre-line text-[17px] leading-normal text-krds-text-ink">
            {'스마트폰 → PC 로 내보내기 하려는\n인증서를 선택해주세요.'}
          </p>
          {MOCK_CERTS.map((c) => (
            <CertCard key={c.id} cert={c} onClick={() => openPswd(c)} />
          ))}
        </div>
      ) : (
        // ② 선택된 인증서 + 인증번호(복사용)
        <>
          <div className="flex flex-col gap-4 px-4 py-5">
            <div className="flex flex-col gap-krds-5">
              <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
                선택된 인증서
              </span>
              {/* 클릭 시 다시 선택(목록으로) */}
              <CertCard cert={selected} onClick={() => setSelected(null)} />
            </div>

            <div className="flex flex-col gap-krds-5">
              <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
                인증번호
              </span>
              <div className="flex items-center gap-2">
                {AUTH_BLOCKS.map((blk, i) => (
                  <div
                    key={i}
                    className="flex h-12 min-w-px flex-1 items-center justify-center rounded-krds-8 border border-krds-text-primary-active text-[17px] font-bold leading-normal text-krds-text-primary-active"
                  >
                    {blk}
                  </div>
                ))}
              </div>
              {/* 인증번호 복사하기 — 클립보드 복사 + 토스트 안내 */}
              <Button variant="primary" className="w-full" onClick={handleCopy}>
                인증번호 복사하기
              </Button>
            </div>
          </div>

          <CertInfoBox items={GUIDE} />
        </>
      )}

      {/* 인증서 비밀번호 확인 BottomSheet(MUI-CM-04-P18, slide354) — 컨테이너/footer 는 페이지 소유, 콘텐츠는 CrtfPswd. */}
      <BottomSheet
        open={pendingCert !== null}
        onOpenChange={(o) => {
          if (!o) closePswd()
        }}
        title="인증서 비밀번호 확인"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: closePswd },
              { label: '완료', variant: 'primary', onClick: handlePswdConfirm },
            ]}
          />
        }
      >
        <CrtfPswd
          password={password}
          onPasswordChange={(v) => {
            setPassword(v)
            if (pswdError) setPswdError(null)
          }}
          errorMessage={pswdError}
        />
      </BottomSheet>

      {/* 인증 결과/복사 안내 토스트 — MUI-CM-04-P19(설계서 slide355). */}
      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))} duration={2000}>
        {toast.message}
      </Toast>
    </div>
  )
}
CrtfSendPage.displayName = 'CrtfSendPage'
