// 회원탈퇴 — MUI-CM-02-P10. 설계서 00.공통 v0.84 slide209(mbWithdrawal).
// 마이페이지 > 사용자정보관리 > 회원탈퇴(팝업). 헤더 타이틀 "회원탈퇴".
// 구성(위→아래): 주의사항(Notice urgent — 최상단, 사용자 확정 2026-08-25) → 사용자 정보(사용자 ID·사용자명 —
//   설계서처럼 input(InputLabel+InputBox disabled) 형태) → 탈퇴 사유 작성*(TextArea, 최대 5줄·이후 내부 스크롤)
//   → footer [회원탈퇴](primary)/[취소](secondary).
//  - [회원탈퇴] → 탈퇴 사유 필수검증(RHF+zod) 통과 시 확인 팝업(AlertModal) → [확인] → 토스트 "회원 탈퇴 되었습니다." → 메인 이동+로그아웃(스텁).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { TextArea } from '@/ui/common/base/TextArea'
import { AlertModal } from '@/ui/common/composites/AlertModal'
import { ButtonGroup } from '@/ui/common/composites/ButtonGroup'
import { Notice } from '@/ui/common/composites/Notice'
import { Toast } from '@/ui/common/composites/Toast'
import {
  mbWithdrawalSchema,
  type MbWithdrawalForm,
} from '@/ui/biz/cm/mbWithdrawal/MbWithdrawalPage.schema'

// 상단 사용자 정보(ReadOnly) — 설계서 slide209 표기값(추후 API: authStore/cmService).
const MOCK_USER = {
  userId: 'Test1', // 사용자 ID
  userNm: '홍길동', // 사용자명
}

export function MbWithdrawalPage() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false) // 회원탈퇴 확인 팝업
  const [toastOpen, setToastOpen] = useState(false) // 탈퇴 완료 토스트

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MbWithdrawalForm>({
    resolver: zodResolver(mbWithdrawalSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { wdrwRsn: '' },
  })

  // [회원탈퇴] — 사유 필수검증 통과 시에만 확인 팝업 오픈(미입력 시 RHF 가 에러 표시 + 포커스).
  const onValid = () => setConfirmOpen(true)

  // 확인 팝업 [확인] — 실제 탈퇴 처리. 현재 스텁.
  const handleWithdraw = handleSubmit(() => {
    setToastOpen(true)
    // 추후: authStore 로그아웃 + navigate('/')
    console.log('[MbWithdrawal] 회원탈퇴 처리 → 메인 이동 + 로그아웃')
  })

  return (
    // min-h-full + footer mt-auto — 콘텐츠가 짧아도 버튼 영역이 화면 맨 아래 붙는다(사용자 확정 2026-08-25).
    <div className="flex min-h-full w-full flex-col">
      {/* 주의사항 — 되돌릴 수 없음 강조(urgent). 최상단 배치 + 문구를 배지 아래로 세로 정렬
          (사용자 확정 2026-08-25 — 공통 Notice 는 수정하지 않고 flex-col 오버라이드). */}
      <div className="px-krds-8 pt-krds-7 pb-krds-7">
        {/* 문장별 줄바꿈(v0.87 검토 57번 — 팝업은 그대로, 주의사항 문구만) */}
        <Notice type="urgent" badgeLabel="주의" className="flex-col">
          회원탈퇴 시 회원정보가 삭제됩니다.
          <br />
          회원탈퇴 시 되돌릴 수 없으며, 재가입 하셔야 합니다.
        </Notice>
      </div>

      {/* 사용자 정보 — 설계서(slide214)처럼 input 형태(라벨 위 + 값, 조회 전용 disabled). */}
      <div className="flex flex-col gap-krds-7 px-krds-8 pb-krds-7">
        <div className="flex flex-col gap-krds-3">
          <InputLabel htmlFor="wdrw-userId">사용자 ID</InputLabel>
          <InputBox id="wdrw-userId" disabled value={MOCK_USER.userId} readOnly />
        </div>
        <div className="flex flex-col gap-krds-3">
          <InputLabel htmlFor="wdrw-userNm">사용자명</InputLabel>
          <InputBox id="wdrw-userNm" disabled value={MOCK_USER.userNm} readOnly />
        </div>
      </div>

      {/* 탈퇴 사유 작성* — 최대 5줄까지 확장, 이후 내부 스크롤. */}
      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col gap-krds-5 px-krds-8 pb-krds-9"
      >
        <InputLabel htmlFor="wdrw-rsn" required>
          탈퇴 사유 작성
        </InputLabel>
        <TextArea
          id="wdrw-rsn"
          rows={5}
          placeholder="탈퇴 사유를 작성해주세요."
          error={!!errors.wdrwRsn}
          aria-invalid={!!errors.wdrwRsn}
          aria-describedby={errors.wdrwRsn ? 'wdrw-rsn-error' : undefined}
          // 최대 5줄 높이로 고정 후 내부 스크롤(base 의 min-h-[200px] 를 min-h-0 로 무력화).
          className="min-h-0 max-h-[7.5rem] overflow-y-auto"
          {...register('wdrwRsn')}
        />
        {errors.wdrwRsn && (
          <InputMessage id="wdrw-rsn-error" type="error">
            {errors.wdrwRsn.message}
          </InputMessage>
        )}
      </form>

      {/* footer — [회원탈퇴](primary) / [취소](secondary). mt-auto 로 화면 맨 아래 고정(짧은 콘텐츠에서도). */}
      <div
        className="sticky bottom-0 z-30 mt-auto border-t border-krds-border-divider bg-background px-krds-8 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <ButtonGroup
          items={[
            { label: '취소', variant: 'secondary', onClick: () => navigate(-1) },
            {
              label: '회원탈퇴',
              variant: 'primary',
              onClick: handleSubmit(onValid),
            },
          ]}
        />
      </div>

      {/* 회원탈퇴 확인 팝업 — 되돌릴 수 없음 경고(error 톤). */}
      <AlertModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="error"
        title="회원 탈퇴는 되돌릴 수 없습니다."
        description="정말 회원탈퇴를 할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{ label: '확인', onClick: handleWithdraw }}
      />

      {/* 탈퇴 완료 토스트. */}
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} duration={2000}>
        회원 탈퇴 되었습니다.
      </Toast>
    </div>
  )
}
MbWithdrawalPage.displayName = 'MbWithdrawalPage'
