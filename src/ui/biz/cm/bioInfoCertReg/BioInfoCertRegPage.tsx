// MUI-CM-03-M15 생체인증 등록 (로그인 설계서 slide55 p54 / Figma 10020:87131)
// 생체정보를 등록하기 위해 회원 정보(아이디·성명)를 입력하고 간편인증/본인인증으로 본인확인하는 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/biometric/register, handle: header variant='sub' title='생체인증 등록').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서(slide55·slide56) 동작 메모:
//   - 사용자 정보(아이디·성명) 입력 후 [간편인증]/[본인인증] 진행 → 성공 시
//     생체인증등록완료(MUI-CM-03-M20, BioInfoCertRsltPage)로 이동.
//   - 본인인증 실패 시: 좌측(입력) 화면으로 복귀 + "회원정보가 없습니다." 토스트 노출(설계서 slide56).
//     → 하이브리드 인증 브릿지 미연동이라 프론트는 성공 목업만 반영, 실패/토스트는 API 연동 시점에 배선.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { Infobox } from '@/ui/common/composites/Infobox'
import {
  bioInfoCertRegSchema,
  type BioInfoCertRegForm,
} from '@/ui/biz/cm/bioInfoCertReg/BioInfoCertRegPage.schema'

// 도움말 문구(설계서 slide55 그대로). 안정적 key = 문구 자체(고정 상수).
const HELP_ITEMS = [
  '사용자 정보를 입력한 후 간편인증 또는 본인인증을 진행하면, 디바이스에 저장된 생체정보를 사용할 수 있습니다.',
] as const

// 본인확인 수단(설계서 slide55: 간편인증 / 본인인증)
type CertMethod = 'simple' | 'self'

export function BioInfoCertRegPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BioInfoCertRegForm>({
    resolver: zodResolver(bioInfoCertRegSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userId: '', userName: '' },
  })

  // 간편인증/본인인증 — 입력값 검증 후 본인확인 진행(목업: 성공 처리 → 생체인증등록완료 M20 이동)
  const runCert = (method: CertMethod) =>
    handleSubmit((data) => {
      console.log('[bioInfoCertReg] 본인확인', { method, ...data })
      // 추후 API: authService.verifyMember(method, data) → 성공 시 완료 화면, 실패 시 "회원정보가 없습니다." 토스트
      navigate('/login/biometric/register/result') // 생체인증등록완료(MUI-CM-03-M20)
    })

  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  // min-h-full 로 스크롤 영역을 채워 하단 도움말/버튼을 바닥에 배치.

  // ── 회원 정보 입력 화면(Figma 10020:87131 / 설계서 slide55) ──
  return (
    <form onSubmit={runCert('self')} className="flex min-h-full flex-col" noValidate>
      {/* 회원 정보 입력 — 아이디 · 성명(Figma 표시 순서) */}
      <div className="flex flex-col gap-krds-8 px-krds-8 pt-krds-8">
        {/* 아이디 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="userId" required>
            아이디
          </InputLabel>
          <InputBox
            id="userId"
            placeholder="아이디를 입력해주세요"
            autoComplete="off"
            error={!!errors.userId}
            aria-invalid={!!errors.userId}
            onClear={() => setValue('userId', '')}
            {...register('userId')}
          />
          {errors.userId && <InputMessage type="error">{errors.userId.message}</InputMessage>}
        </div>

        {/* 성명 */}
        <div className="flex flex-col gap-krds-5">
          <InputLabel htmlFor="userName" required>
            성명
          </InputLabel>
          <InputBox
            id="userName"
            placeholder="성명을 입력해주세요"
            autoComplete="off"
            error={!!errors.userName}
            aria-invalid={!!errors.userName}
            onClear={() => setValue('userName', '')}
            {...register('userName')}
          />
          {errors.userName && <InputMessage type="error">{errors.userName.message}</InputMessage>}
        </div>
      </div>

      {/* 하단 — 도움말(기본 펼침) + 간편인증/본인인증 */}
      <div className="mt-auto flex flex-col pt-krds-8">
        {/* 도움말 Infobox(collapsible, 기본 펼침). 기본 ⓘ 아이콘 = systemInfo.svg */}
        <Infobox defaultOpen title="도움말" items={[...HELP_ITEMS]} />

        {/* 간편인증 / 본인인증 (Figma: 좌 간편인증 · 우 본인인증, 동일 폭 primary) */}
        <div className="flex gap-krds-5 px-krds-8 py-krds-8">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={runCert('simple')}
          >
            간편인증
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            본인인증
          </Button>
        </div>
      </div>
    </form>
  )
}
BioInfoCertRegPage.displayName = 'BioInfoCertRegPage'
