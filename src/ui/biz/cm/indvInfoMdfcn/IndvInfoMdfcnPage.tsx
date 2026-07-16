// 개인정보수정 — MUI-CM-02-M04. Figma 10020-82439 / 설계서 00.공통 v0.84 slide65(indvInfoMdfcn).
// 사용자정보관리 > 개인정보수정. 개인정보 접근 전 비밀번호 재인증 게이트.
// 구성: 안내(Notice, lock) + 비밀번호 입력(InputLabel + 설명 + InputBox password) + 확인(Button primary).
//  - 확인 → 인증 검증(추후 API) 후 개인정보 상세/수정 진입. 현재 목업(console.log).
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { Notice } from '@/ui/common/composites/Notice'

export function IndvInfoMdfcnPage() {
  const [pswd, setPswd] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 추후 API: cmService.verifyIndvPswd(pswd) → 성공 시 개인정보 상세/수정(M03) 진입.
    console.log('[IndvInfoMdfcn] 비밀번호 인증', pswd)
  }

  return (
    <div className="flex flex-col">
      {/* 안내 — 추가 인증 필요(lock) */}
      <div className="p-krds-8">
        <Notice icon="Lock">개인정보 접근을 위해 추가 인증이 필요합니다.</Notice>
      </div>

      {/* 비밀번호 입력 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-krds-8 px-krds-8 py-krds-9">
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="indv-pswd">비밀번호 입력</InputLabel>
          <p className="text-[14px] leading-normal text-krds-text-muted">
            인증을 위해 비밀번호를 입력해주세요
          </p>
          <InputBox
            id="indv-pswd"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            value={pswd}
            onChange={(e) => setPswd(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          확인
        </Button>
      </form>
    </div>
  )
}
IndvInfoMdfcnPage.displayName = 'IndvInfoMdfcnPage'
