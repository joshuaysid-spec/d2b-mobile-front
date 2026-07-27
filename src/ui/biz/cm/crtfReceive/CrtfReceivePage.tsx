// 인증서 가져오기 — MUI-CM-04-M16. Figma 10020-87271 / 설계서 00.공통 v0.83 slide339.
// PC → 스마트폰 인증서 복사. 인증번호 12자리(4×3) 입력 + 안내 + [인증서 가져오기]
// → 인증번호 일치 시 인증서 비밀번호 확인(P18, CrtfPswd 시트) → 완료 시 인증서 복사.
// 안내 메시지는 토스트(MUI-CM-04-P19, slide355). 실제 검증/가상 보안 키패드는 스마트PKI — 데모는 고정값 비교.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Toast } from '@/ui/common/composites/Toast'
import { CertInfoBox } from '@/ui/biz/cm/crtfMng/CertInfoBox'
import { CrtfPswd } from '@/ui/biz/cm/crtfSend/CrtfPswd'

// 데모용 인증번호(12자리) — 실제는 PC 화면에 표시되는 인증번호. 스마트PKI 연동 시 검증 교체.
const MOCK_AUTH_CODE = '123456789012'
// 데모용 인증서 비밀번호 — 실제 검증은 스마트PKI 솔루션(IndvIdntIdnty 와 동일 데모값).
const MOCK_PASSWORD = '1234'
const GUIDE = [
  'PC 화면의 인증서 가져오기, 내보내기 화면에 표시되는 인증번호 12자리를 입력하여 인증서 가져오기를 하실 수 있습니다.',
  'PC → 스마트폰 으로 인증서를 가져옵니다.',
]

export function CrtfReceivePage() {
  const [blocks, setBlocks] = useState(['', '', '']) // 4자리 × 3
  const [pswdOpen, setPswdOpen] = useState(false) // P18 인증서 비밀번호 확인 시트
  const [password, setPassword] = useState('')
  const [pswdError, setPswdError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })
  const code = blocks.join('')

  const setBlock = (i: number, v: string) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? v : b)))
  }

  // 인증번호 확인 → 일치 시 인증서 비밀번호 확인 시트(P18) 열기.
  const handleImport = () => {
    // 미입력 → 토스트 안내.
    if (code.trim() === '') {
      setToast({ open: true, message: '인증번호를 입력해주세요.' })
      return
    }
    if (code !== MOCK_AUTH_CODE) {
      setToast({ open: true, message: '인증번호가 틀렸습니다.' }) // P19 토스트
      return
    }
    setPassword('')
    setPswdError(null)
    setPswdOpen(true)
  }

  const closePswd = () => {
    setPswdOpen(false)
    setPassword('')
    setPswdError(null)
  }

  // P18 완료 — 성공 시 인증서 복사 + 토스트(P19), 실패 시 시트 유지 + 에러(설계서 slide354 문구).
  const handlePswdConfirm = () => {
    if (password.trim() === '') {
      setPswdError('인증서의 비밀번호를 입력해주세요.')
      return
    }
    // 추후 API: 스마트PKI 솔루션으로 인증서 비밀번호 검증·인증서 복사. 데모는 고정값 비교.
    if (password !== MOCK_PASSWORD) {
      setPswdError('인증번호가 틀렸습니다.')
      return
    }
    console.log('[CrtfReceive] 인증서 가져오기 성공')
    closePswd()
    setBlocks(['', '', ''])
    setToast({ open: true, message: '인증서를 복사하였습니다.' }) // P19 토스트
  }

  return (
    <div className="flex w-full flex-col">
      {/* 인증번호 입력 — 4자리 × 3(12자리) */}
      <div className="flex flex-col gap-4 px-4 py-5">
        <InputLabel>인증번호 입력</InputLabel>
        <div className="flex items-start gap-2">
          {blocks.map((b, i) => (
            <InputBox
              key={i}
              inputType="numeric"
              maxLength={4}
              value={b}
              placeholder="0000"
              onChange={(e) => setBlock(i, e.target.value)}
              className="min-w-px flex-1"
              style={{ textAlign: 'center' }}
              aria-label={`인증번호 ${i + 1}번째 4자리`}
            />
          ))}
        </div>
      </div>

      {/* 안내 */}
      <CertInfoBox items={GUIDE} />

      {/* 인증서 가져오기 */}
      <div className="px-4 py-4">
        <Button variant="primary" className="w-full" onClick={handleImport}>
          인증서 가져오기
        </Button>
      </div>

      {/* 인증서 비밀번호 확인 BottomSheet(MUI-CM-04-P18, slide354) — 컨테이너/footer 는 페이지 소유, 콘텐츠는 CrtfPswd(crtfSend 자산 재활용). */}
      <BottomSheet
        open={pswdOpen}
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

      {/* 인증 결과 안내 토스트 — MUI-CM-04-P19(설계서 slide355). */}
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
CrtfReceivePage.displayName = 'CrtfReceivePage'
