// 인증서 내보내기 — MUI-CM-04-M17. Figma 10020-87296(목록)·87316(선택됨) / 설계서 00.공통 v0.83 slide340.
// 스마트폰 → PC 인증서 복사. ① 내보낼 인증서 선택(목록) → ② 선택된 인증서 + 인증번호(복사용) 표시.
//   (인증서 선택 시 인증서 비밀번호 확인 P18 은 이번 범위 밖 — 선택 → 바로 ② 표시. 클릭으로 재선택)
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Toast } from '@/ui/common/composites/Toast'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import { CertInfoBox } from '@/ui/biz/cm/crtfMng/CertInfoBox'
import { MOCK_CERTS } from '@/ui/biz/cm/crtfMng/certMock'
import type { CertItem } from '@/types/cert'

// 복사용 인증번호(12자리, 4×3) — PC 가 입력할 값. 스마트PKI 발급값, 데모 고정.
const AUTH_BLOCKS = ['1234', '5678', '9012']
const GUIDE = [
  'PC 화면의 인증서 가져오기, 내보내기 화면에 표시되는 인증번호 12자리를 입력하여 인증서 내보내기를 하실 수 있습니다.',
  '스마트폰 → PC 로 인증서를 내보냅니다.',
]

export function CrtfSendPage() {
  const [selected, setSelected] = useState<CertItem | null>(null)
  const [copyToastOpen, setCopyToastOpen] = useState(false)

  // 인증번호(12자리) 클립보드 복사 + 토스트.
  const handleCopy = async () => {
    const code = AUTH_BLOCKS.join('')
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // 클립보드 API 미지원/거부 시에도 안내는 노출(WebView 환경 대응).
    }
    setCopyToastOpen(true)
    console.log('[CrtfSend] 인증번호 복사', code)
  }

  // ① 인증서 선택(목록)
  if (!selected) {
    return (
      <div className="flex w-full flex-col gap-4 px-4 py-5">
        <p className="whitespace-pre-line text-[17px] leading-normal text-krds-text-ink">
          {'스마트폰 → PC 로 내보내기 하려는\n인증서를 선택해주세요.'}
        </p>
        {MOCK_CERTS.map((c) => (
          <CertCard
            key={c.id}
            cert={c}
            onClick={() => {
              setSelected(c)
              console.log('[CrtfSend] 인증서 선택', c.id)
              // 추후: 인증서 비밀번호 확인(P18) 후 인증번호 표시
            }}
          />
        ))}
      </div>
    )
  }

  // ② 선택된 인증서 + 인증번호(복사용)
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-4 px-4 py-5">
        <div className="flex flex-col gap-krds-5">
          <span className="text-[17px] font-bold leading-normal text-krds-text-ink">
            선택된 인증서
          </span>
          {/* 클릭 시 다시 선택(목록으로) */}
          <CertCard cert={selected} onClick={() => setSelected(null)} />
        </div>

        <div className="flex flex-col gap-krds-5">
          <span className="text-[17px] font-bold leading-normal text-krds-text-ink">인증번호</span>
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

      <Toast open={copyToastOpen} onClose={() => setCopyToastOpen(false)} duration={2000}>
        인증번호가 복사되었습니다.
      </Toast>
    </div>
  )
}
CrtfSendPage.displayName = 'CrtfSendPage'
