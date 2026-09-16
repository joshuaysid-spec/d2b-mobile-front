// 인증서 관리 — MUI-CM-04-M14. Figma 10020-82063 / 설계서 00.공통 v0.83 slide337.
// 보유 인증서 목록(카드: 발급기관 + 타이틀명 + 유효기간 + [인증서 삭제]).
// 삭제 클릭 → 인증서 삭제 BottomSheet(P15, CrtfDelPage 콘텐츠) 열림 → 비밀번호 입력 후 삭제하기:
//   비밀번호 불일치 → 토스트("인증서 비밀번호 입력이 틀렸습니다.") / 일치 → 목록에서 제거 + 토스트("인증서를 삭제하였습니다.").
// 검색/데이터영역(항목명 표) 없음 — 검색필터 미생성. 인증서 항목은 스마트PKI 솔루션 제공(항목명 잠정).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { showToast } from '@/stores/authStore'
import { CertCard } from '@/ui/biz/cm/crtfMng/CertCard'
import { MOCK_CERTS } from '@/ui/biz/cm/crtfMng/certMock'
import { CrtfDelPage } from '@/ui/biz/cm/crtfDel/CrtfDelPage'
import type { MockCertItem } from '@/types/mock/cm'

// 데모용 비밀번호 — 실제 검증은 스마트PKI 솔루션.
const MOCK_PASSWORD = '1234'

export function CrtfMngPage() {
  const [certs, setCerts] = useState<MockCertItem[]>(MOCK_CERTS)
  const [target, setTarget] = useState<MockCertItem | null>(null) // 삭제 대상(=BottomSheet 열림)
  const [password, setPassword] = useState('')

  const closeSheet = () => {
    setTarget(null)
    setPassword('')
  }
  const handleDelete = () => {
    if (!target) return
    // 비밀번호 미입력 → 토스트 안내.
    if (password.trim() === '') {
      showToast('인증서 비밀번호를 입력해주세요.')
      return
    }
    // 추후: 스마트PKI 솔루션으로 비밀번호 검증. 데모는 고정값 비교.
    if (password !== MOCK_PASSWORD) {
      showToast('인증서 비밀번호 입력이 틀렸습니다.')
      return
    }
    setCerts((prev) => prev.filter((c) => c.id !== target.id))
    console.log('[CrtfMng] 인증서 삭제', target.id)
    closeSheet()
    showToast('인증서를 삭제하였습니다.')
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 pb-4 pt-[26px]">
      {certs.length === 0 ? (
        <p className="py-10 text-center text-krds-body-md text-krds-text-subtle">
          보유한 인증서가 없습니다.
        </p>
      ) : (
        certs.map((c) => (
          <CertCard
            key={c.id}
            cert={c}
            footer={
              <Button variant="secondary" className="w-full" onClick={() => setTarget(c)}>
                인증서 삭제
              </Button>
            }
          />
        ))
      )}

      {/* 인증서 삭제 BottomSheet(P15) — 컨테이너/footer 는 여기(부모)가 소유, 콘텐츠는 CrtfDelPage. */}
      <BottomSheet
        open={target !== null}
        onOpenChange={(o) => {
          if (!o) closeSheet()
        }}
        title="인증서 삭제"
        footer={
          <ButtonGroup
            layout="asymmetric"
            items={[
              { label: '취소', variant: 'secondary', onClick: closeSheet },
              { label: '삭제하기', variant: 'primary', onClick: handleDelete },
            ]}
          />
        }
      >
        {target && <CrtfDelPage cert={target} password={password} onPasswordChange={setPassword} />}
      </BottomSheet>
    </div>
  )
}
CrtfMngPage.displayName = 'CrtfMngPage'
