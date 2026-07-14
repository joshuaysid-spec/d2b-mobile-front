// MUI-CM-03-M15 생체인증 등록 (로그인 설계서 slide55 p54 / Figma 10020:87131 · 본인인증후 10020:87190)
// 생체정보를 등록하기 위해 회원 정보(아이디·성명)를 입력하고 간편인증/본인인증으로 본인확인하는 화면.
// 셸(AppLayout) 안 + sub헤더 라우트(제안 /login/biometric/register, handle: header variant='sub' title='생체인증 등록').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서(slide55·slide56) 동작 메모:
//   - 사용자 정보(아이디·성명) 입력 후 [간편인증]/[본인인증] 진행 → 성공 시 본인인증 완료 화면으로 전환.
//     (본인인증후 화면 = Figma 10020:87190 / 설계서 slide56 문구와 동일 — 본 화면의 로컬 상태로 표현)
//   - 본인인증 실패 시: 좌측(입력) 화면으로 복귀 + "회원정보가 없습니다." 토스트 노출(설계서 slide56).
//     → 하이브리드 인증 브릿지 미연동이라 프론트는 성공 목업만 반영, 실패/토스트는 API 연동 시점에 배선.
//   - [생체인증 로그인] → 디바이스 생체인증 진행, 성공 시 메인 홈 이동(설계서 slide56).
//
// 디자인 메모(보고 대상):
//   - 완료 상태 체크 아이콘은 Figma 상 연한 파란 원 + 흰 체크. 폰트 REGISTRY 의 'CheckCircle'(check_circle,
//     기본 FILL=1) 로 근사(솔리드 원 + 체크 knockout). 원 톤은 text-krds-text-primary 로 근사.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
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
  // 본인인증 완료 여부 — 완료 시 완료 화면(Figma 10020:87190)으로 전환. (하이브리드 인증 미연동 → 목업)
  const [verified, setVerified] = useState(false)

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

  // 간편인증/본인인증 — 입력값 검증 후 본인확인 진행(목업: 성공 처리 → 완료 화면 전환)
  const runCert = (method: CertMethod) =>
    handleSubmit((data) => {
      console.log('[bioInfoCertReg] 본인확인', { method, ...data })
      // 추후 API: authService.verifyMember(method, data) → 성공 시 완료 화면, 실패 시 "회원정보가 없습니다." 토스트
      setVerified(true)
    })

  // [생체인증 로그인] — 디바이스 생체인증 로그인 진행(성공 시 메인 홈)
  const handleBioLogin = () => {
    console.log('[bioInfoCertReg] 생체인증 로그인')
    // 추후 API: authService.biometricLogin() → 성공 판정 후 메인 홈
    navigate('/')
  }

  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  // min-h-full 로 스크롤 영역을 채워 하단 도움말/버튼을 바닥에 배치.

  // ── 본인인증 완료 화면(Figma 10020:87190 / 설계서 slide56) ──
  if (verified) {
    return (
      <div className="flex min-h-full flex-col">
        {/* 중앙 안내 — 체크 아이콘 + 완료 문구 + 안내 박스 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-krds-8 px-krds-8">
          <Icon
            name="CheckCircle"
            size={64}
            className="text-krds-text-primary"
            aria-hidden
          />
          <h1 className="text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
            본인 인증이 완료되었습니다.
          </h1>
          <p className="w-full rounded-krds-xl bg-krds-bg-primary-faint px-krds-8 py-krds-7 text-center text-krds-body-md leading-normal text-krds-text-info wrap-break-word">
            디바이스에 등록된
            <br />
            모든 얼굴정보, 지문정보를 이용하여
            <br />
            로그인을 진행합니다.
          </p>
        </div>

        {/* 하단 — 생체인증 로그인 */}
        <div className="px-krds-8 py-krds-8">
          <Button variant="primary" size="lg" className="w-full" onClick={handleBioLogin}>
            생체인증 로그인
          </Button>
        </div>
      </div>
    )
  }

  // ── 회원 정보 입력 화면(기본, Figma 10020:87131 / 설계서 slide55) ──
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
