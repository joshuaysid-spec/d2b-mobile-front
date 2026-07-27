// MUI-CM-03-M22 통합로그인 계정등록 (설계서 00.공통 v0.84 slide34~36)
// 구버전 아이디로 로그인한 사용자가 통합 로그인 계정(아이디·비밀번호)을 새로 등록하는 화면.
// 통합로그인계정등록안내(MUI-CM-03-P21, NewIdChgInfo) 팝업의 [통합 로그인 계정 등록]에서 진입.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/new-id, header variant='sub' title='통합 로그인 계정 등록').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서(slide35·slide36) 2단계 흐름:
//   [본인인증 전] 성명(읽기전용) + 주민등록번호 입력 → [본인인증하기](Nice 본인인증 솔루션 호출, CI 값 획득).
//     - 실패 시 토스트 "본인인증에 실패했습니다." (하이브리드 브릿지 미연동 — 목업은 성공만 반영)
//   [본인인증 후] 주민등록번호 마스킹 읽기전용(123456-7******)으로 전환 + 안내 문구 변경 +
//     통합 계정 아이디(중복체크) · 비밀번호 · 비밀번호 확인 입력 폼 노출 → [통합 아이디 등록하기].
//     - 중복체크: 사용가능 "사용이 가능합니다." / 중복 "이미 사용중인 계정입니다." / 미입력 "통합 계정 아이디를 입력해주세요."
//     - 도움말 + 기존 사용자 아이디 목록(업체에서 등록·생성한 기존 아이디) 표시.
//
// 데이터 연결: 본인인증 후 대상조회·중복확인·등록은 authService 실호출(USE_MOCK 분기).
//   성명·기존 아이디 목록은 getIntgAcntTarget() 결과(목업 mocks/auth). 직접 URL 진입 시 성명은 목업 폴백.
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'

import { authService } from '@/services/auth'
import { Button } from '@/ui/common/base/Button'
import { InputBox } from '@/ui/common/base/InputBox'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { InputMessage } from '@/ui/common/base/InputMessage'
import { PageTitle } from '@/ui/common/base/PageTitle'
import { Infobox } from '@/ui/common/composites/Infobox'
import { newIdPwRegSchema, type NewIdPwRegForm } from '@/ui/biz/cm/newId/NewIdPwReg.schema'
import type { IntgAcntTarget } from '@/types/domain'

// 도움말 문구(설계서 slide35 그대로). 안정적 key = 문구 자체(고정 상수).
const HELP_ITEMS = [
  '비밀번호는 9~16자 숫자, 영문 소문자, 특수문자 조합으로 입력하세요.',
  '입력 불가한 특수문자 : `~&()_{}[]|\\:;"\',.<>?/',
] as const

// 주민등록번호 표시 포맷 — 숫자만 → 6자리 뒤 하이픈(######-#######).
const formatRrn = (digits: string) => (digits.length <= 6 ? digits : `${digits.slice(0, 6)}-${digits.slice(6)}`)

// 본인인증 후 마스킹 표시 — 앞 7자리 노출, 뒤 6자리 마스킹(설계서 예: 123456-7******).
const maskRrn = (rrno: string) => {
  const d = rrno.replace(/\D/g, '')
  if (d.length < 7) return rrno
  return `${d.slice(0, 6)}-${d.slice(6, 7)}******`
}

// 중복체크 결과 상태 — idle(미확인) | available(사용가능) | duplicate(사용중).
type IdCheckState = 'idle' | 'available' | 'duplicate'

export function NewIdPwReg() {
  const navigate = useNavigate()
  const location = useLocation()
  // 진입 시 성명 — P21(로그인) 에서 넘겨준 사용자명. 직접 URL 진입 시 목업 폴백('홍길동').
  const entryName = (location.state as { userNm?: string } | null)?.userNm ?? '홍길동'

  // 본인인증 완료 여부 — 완료 시 계정 아이디/비밀번호 입력 폼 노출 + 주민번호 마스킹.
  const [verified, setVerified] = useState(false)
  // 본인인증 후 조회한 대상 정보(성명 + 기존 사용자 아이디 목록).
  const [target, setTarget] = useState<IntgAcntTarget | null>(null)
  // 통합계정 아이디 중복체크 결과.
  const [idCheck, setIdCheck] = useState<IdCheckState>('idle')

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewIdPwRegForm>({
    resolver: zodResolver(newIdPwRegSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: { userRrno: '', userId: '', userEnpswd: '', userEnpswdChk: '' },
  })

  const rrnoValue = watch('userRrno')
  const displayName = target?.userNm ?? entryName

  // [본인인증하기] — 주민등록번호 검증 후 Nice 본인인증(외부 브릿지, 스텁) → 대상 조회 → 폼 노출.
  const handleVerify = async () => {
    const ok = await trigger('userRrno')
    if (!ok) return
    console.log('[newIdPwReg] 본인인증(Nice)', { userRrno: getValues('userRrno') })
    // 추후: Nice 본인인증 솔루션 성공 판정(CI 획득). 실패 시 "본인인증에 실패했습니다." 토스트.
    const t = await authService.getIntgAcntTarget()
    setTarget(t)
    setVerified(true)
  }

  // [중복체크] — 통합계정 아이디 중복확인. 미입력이면 필드 에러 표시.
  const handleIdCheck = async () => {
    const ok = await trigger('userId')
    if (!ok) {
      setIdCheck('idle')
      return
    }
    const { available } = await authService.checkIntgAcntId(getValues('userId'))
    setIdCheck(available ? 'available' : 'duplicate')
  }

  // [통합 아이디 등록하기] — 전체 검증 통과 시 통합계정 생성 → 등록완료(M23) 이동.
  const onSubmit = async (data: NewIdPwRegForm) => {
    await authService.registerIntgAcnt({
      userRrno: data.userRrno,
      userId: data.userId,
      userEnpswd: data.userEnpswd,
    })
    // 설계서 slide35 는 '메인 이동 + 재로그인 안내 팝업' 이나, v0.84 는 등록완료 화면(M23)을 신설 → 완료 화면으로 이동.
    navigate('/login/new-id/result', { state: { userId: data.userId } })
  }

  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col" noValidate>
      {/* 타이틀 + 안내(본인인증 전/후 문구 변경) */}
      <PageTitle as="h1">통합 로그인 계정 등록</PageTitle>
      <p className="px-4 pb-4 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
        {verified
          ? '국방전자조달시스템에서 사용할 통합 아이디와 비밀번호를 등록해주세요.'
          : '국방전자조달시스템에서 사용할 통합 아이디가 필요합니다. 통합 아이디를 등록하기 위해 본인인증을 해주세요.'}
      </p>

      {/* 회원 정보 — 성명(읽기전용) + 주민등록번호 */}
      <div className="flex flex-col gap-5 px-4 pt-1">
        {/* 성명 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userNm">성명</InputLabel>
          <InputBox id="userNm" value={displayName} readOnly disabled />
        </div>

        {/* 주민등록번호 */}
        <div className="flex flex-col gap-2">
          <InputLabel htmlFor="userRrno" required>
            주민등록번호
          </InputLabel>
          {verified ? (
            // 본인인증 후 — 마스킹 읽기전용(수정 불가)
            <InputBox id="userRrno" value={maskRrn(rrnoValue)} readOnly disabled />
          ) : (
            <Controller
              name="userRrno"
              control={control}
              render={({ field }) => (
                <InputBox
                  id="userRrno"
                  inputType="numeric"
                  format={formatRrn}
                  maxLength={14}
                  placeholder="주민등록번호를 입력하세요"
                  autoComplete="off"
                  error={!!errors.userRrno}
                  aria-invalid={!!errors.userRrno}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onClear={() => setValue('userRrno', '')}
                />
              )}
            />
          )}
          {errors.userRrno && <InputMessage type="error">{errors.userRrno.message}</InputMessage>}
        </div>
      </div>

      {/* 본인인증 전 — [본인인증하기] */}
      {!verified && (
        <div className="px-4 pt-8">
          <Button type="button" size="lg" className="w-full" onClick={handleVerify}>
            본인인증하기
          </Button>
        </div>
      )}

      {/* 본인인증 후 — 통합 계정 아이디/비밀번호 입력 + 등록 */}
      {verified && (
        <>
          <div className="flex flex-col gap-5 px-4 pt-5">
            {/* 통합 계정 아이디 + 중복체크 */}
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="userId" required>
                통합 계정 아이디
              </InputLabel>
              <div className="flex gap-2">
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <InputBox
                      id="userId"
                      inputType="english"
                      maxLength={16}
                      placeholder="아이디를 입력해주세요"
                      autoComplete="off"
                      className="flex-1"
                      error={!!errors.userId || idCheck === 'duplicate'}
                      aria-invalid={!!errors.userId || idCheck === 'duplicate'}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                        setIdCheck('idle') // 아이디 변경 시 중복체크 결과 초기화
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="shrink-0"
                  onClick={handleIdCheck}
                >
                  중복체크
                </Button>
              </div>
              {errors.userId ? (
                <InputMessage type="error">{errors.userId.message}</InputMessage>
              ) : idCheck === 'duplicate' ? (
                <InputMessage type="error">이미 사용중인 계정입니다.</InputMessage>
              ) : idCheck === 'available' ? (
                <InputMessage type="info">사용이 가능합니다.</InputMessage>
              ) : null}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="userEnpswd" required>
                비밀번호
              </InputLabel>
              <InputBox
                id="userEnpswd"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="new-password"
                error={!!errors.userEnpswd}
                aria-invalid={!!errors.userEnpswd}
                onClear={() => setValue('userEnpswd', '')}
                {...register('userEnpswd')}
              />
              {errors.userEnpswd && (
                <InputMessage type="error">{errors.userEnpswd.message}</InputMessage>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="userEnpswdChk" required>
                비밀번호 확인
              </InputLabel>
              <InputBox
                id="userEnpswdChk"
                type="password"
                placeholder="비밀번호를 한번 더 입력해주세요"
                autoComplete="new-password"
                error={!!errors.userEnpswdChk}
                aria-invalid={!!errors.userEnpswdChk}
                onClear={() => setValue('userEnpswdChk', '')}
                {...register('userEnpswdChk')}
              />
              {errors.userEnpswdChk && (
                <InputMessage type="error">{errors.userEnpswdChk.message}</InputMessage>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              통합 아이디 등록하기
            </Button>
          </div>

          {/* 도움말(기본 펼침) */}
          <div className="px-4 pt-6">
            <Infobox defaultOpen title="도움말" items={[...HELP_ITEMS]} />
          </div>

          {/* 기존 사용자 아이디 목록 — 업체에서 등록·생성한 기존 아이디 정보 */}
          {target && target.userIds.length > 0 && (
            <section className="flex flex-col gap-3 px-4 pb-8 pt-6">
              <h2 className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">
                기존 사용자 아이디 목록
              </h2>
              <p className="text-krds-body-md leading-normal text-krds-text-muted wrap-break-word">
                업체에서 등록, 생성한 기존 아이디 정보입니다.
              </p>
              <ul className="flex flex-col gap-2">
                {target.userIds.map((it) => (
                  <li
                    key={it.userId}
                    className="flex items-center justify-between gap-3 rounded-krds-8 bg-krds-bg-secondary px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-krds-body-md text-krds-text-muted">
                      {it.bzentyNm}
                    </span>
                    <span className="shrink-0 text-krds-body-md font-bold text-krds-text-ink">
                      {it.userId}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </form>
  )
}
NewIdPwReg.displayName = 'NewIdPwReg'
