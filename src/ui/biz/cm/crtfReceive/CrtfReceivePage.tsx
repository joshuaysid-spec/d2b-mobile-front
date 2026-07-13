// 인증서 가져오기 — MUI-CM-04-M16. Figma 10020-87271 / 설계서 00.공통 v0.83 slide339.
// PC → 스마트폰 인증서 복사. 인증번호 12자리(4×3) 입력 + 안내 + [인증서 가져오기].
//   미입력 + 가져오기 → 인증번호 필드 error("인증번호를 입력해주세요.").
//   입력했으나 불일치 → 토스트("인증번호가 틀렸습니다."). (실제 검증/가상 보안 키패드는 스마트PKI — 추후)
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { Toast } from '@/ui/common/composites/Toast'
import { CertInfoBox } from '@/ui/biz/cm/crtfMng/CertInfoBox'

// 데모용 인증번호(12자리) — 실제는 PC 화면에 표시되는 인증번호. 스마트PKI 연동 시 검증 교체.
const MOCK_AUTH_CODE = '123456789012'
const GUIDE = [
  'PC 화면의 인증서 가져오기, 내보내기 화면에 표시되는 인증번호 12자리를 입력하여 인증서 가져오기를 하실 수 있습니다.',
  'PC → 스마트폰 으로 인증서를 가져옵니다.',
]

export function CrtfReceivePage() {
  const [blocks, setBlocks] = useState(['', '', '']) // 4자리 × 3
  const [error, setError] = useState('') // 인증번호 필드 에러 메시지
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })
  const code = blocks.join('')

  const setBlock = (i: number, v: string) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? v : b)))
    if (error) setError('') // 입력 시작하면 에러 해제
  }
  const handleImport = () => {
    // 미입력 → 필드 에러(토스트 아님).
    if (code.trim() === '') {
      setError('인증번호를 입력해주세요.')
      return
    }
    if (code !== MOCK_AUTH_CODE) {
      setToast({ open: true, message: '인증번호가 틀렸습니다.' })
      return
    }
    console.log('[CrtfReceive] 인증서 가져오기 성공')
    // 추후: 성공 시 인증서 비밀번호 입력 화면 표시(스마트PKI)
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
              error={Boolean(error)}
              className="min-w-px flex-1 text-center"
              aria-label={`인증번호 ${i + 1}번째 4자리`}
              aria-invalid={Boolean(error)}
            />
          ))}
        </div>
        {error && <InputMessage type="error">{error}</InputMessage>}
      </div>

      {/* 안내 */}
      <CertInfoBox items={GUIDE} />

      {/* 인증서 가져오기 */}
      <div className="px-4 py-4">
        <Button variant="primary" className="w-full" onClick={handleImport}>
          인증서 가져오기
        </Button>
      </div>

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
