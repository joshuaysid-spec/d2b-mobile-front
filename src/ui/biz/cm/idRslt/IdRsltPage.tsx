// MUI-CM-03-M05 아이디 찾기 결과 (설계서 로그인 slide43 / Figma 성공 10020:81982 · 실패 10020:81999)
// 아이디 찾기(MUI-CM-03-M03) 인증 후 결과 화면. 성공/실패 두 상태를 한 화면에서 렌더.
//   - 성공: 소속업체명 + 아이디 표시 → [ID/PW 로그인 바로가기] · [비밀번호 찾기]
//   - 실패: '가입된 인증정보가 없습니다' 안내 → [사용자 등록 안내 바로가기]
// 셸(AppLayout) 안 + sub헤더 라우트(/login/find-id/result, header variant='sub' title='아이디 찾기').
//   헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 소유 → 페이지는 콘텐츠만 렌더.
//
// 디자인/설계서 메모(보고 대상):
//   - 아이디 값: 설계서 slide43·Figma(10020:81982) 모두 'abcdef1234' 를 마스킹 없이 그대로 노출 →
//     설계서/Figma 우선하여 미마스킹. (마스킹 정책이 필요하면 아래 maskUserId 스텁 활성화)
//   - 신분증 배지(80px 흰 배경 + #c1d1ee 1.33px 보더 + 파란 점 데코): Figma 실측 재현(2026-08-03).
//     assignment_ind 글리프는 Material Symbols 존재(AssignmentInd) — 성공/실패 동일 배지.
//   - 실패 안내(m_empty data): alert_error 원형 느낌표 → Error 글리프(CardList 빈 목록과 동일 패턴).
//   - status 는 목업 로컬 상태(기본 success). 실연동 시 아이디찾기 결과로 주입하고 데모 토글 제거.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import alertErrorIcon from '@/assets/images/alertErrorIcon.svg'

type IdRsltStatus = 'success' | 'fail'

// 성공 결과 목업 — 설계서 slide43 목업값 그대로(㈜ABC 업체 / abcdef1234).
// TODO(설계서 확인): 소속업체명·아이디 항목 영문ID — 로그인 설계서 slide43엔 영문ID 미기재(임시 키).
const MOCK_ID_RSLT = {
  blngBzentyNm: '㈜ABC 업체', // 소속업체명
  userId: 'abcdef1234', // 아이디
}

// TODO(마스킹 정책): 아이디 마스킹이 필요하면 활성화(설계서/Figma는 미마스킹 노출).
// const maskUserId = (id: string) => id.replace(/(?<=.{4}).(?=.{2})/g, '*')

export function IdRsltPage() {
  const navigate = useNavigate()
  // 목업: 기본 success. 실연동 시 아이디찾기(MUI-CM-03-M03) 결과로 주입(데모 토글 제거).
  const [status, setStatus] = useState<IdRsltStatus>('success')
  const isSuccess = status === 'success'

  const handleGoIdPwLogin = () => {
    navigate('/login/id-pw') // ID/PW 로그인(MUI-CM-03-M02)
  }
  const handleFindPassword = () => {
    navigate('/login/find-pw') // 비밀번호 찾기(MUI-CM-03-M06)
  }
  const handleUserRegisterGuide = () => {
    navigate('/login/user-reg-info') // 사용자 등록 안내(MUI-CM-03-M09)
  }

  // 셸(AppLayout) 안 화면 — 콘텐츠만 렌더. min-h-full flex 로 본문 중앙 + 하단 액션바 배치.
  return (
    <div className="flex min-h-full flex-col px-krds-8 pb-krds-8">
      {/* 데모 전용: status 토글 (실연동 시 제거 — 아이디찾기 결과로 status 주입) */}
      <div className="flex justify-end gap-krds-4 pt-krds-3">
        {(['success', 'fail'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className="text-krds-body-sm text-krds-text-muted underline aria-pressed:font-bold aria-pressed:text-krds-text-primary"
          >
            {s === 'success' ? '성공(데모)' : '실패(데모)'}
          </button>
        ))}
      </div>

      {/* 본문 — 신분증 배지 + 헤딩 + 결과 카드 (Figma: 세로 중앙 정렬, 그룹 간 24px) */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-10 py-krds-8">
        <div className="flex flex-col items-center gap-krds-7">
          {/* 신분증 배지 — 80px 흰 배경 + border-field(#c1d1ee) 1.33px + radius 27 +
              파란 점 데코(24px, border-primary-soft=#a7c4f7) 위에 assignment_ind 50px (Figma 10020:81986) */}
          <div className="relative flex size-20 items-center justify-center rounded-[27px] border-[1.33px] border-krds-border-field bg-background">
            {/* 점 데코는 글리프 좌상단(15,15) 정렬 — Figma 실측 */}
            <span
              aria-hidden
              className="absolute left-[15px] top-[15px] size-6 rounded-full bg-krds-border-primary-soft"
            />
            {/* 글리프 색 = #0f316e(primary-active) — Figma 배지 글리프 실측(2026-08-03) */}
            <Icon
              name="AssignmentInd"
              size={50}
              className="relative text-krds-text-primary-active"
              aria-hidden
            />
          </div>

          <h1 className="text-center text-[24px] font-bold leading-normal text-krds-text-ink">
            {isSuccess ? (
              '사용자 ID를 확인해주세요'
            ) : (
              <>
                사용자 ID를
                <br />
                확인할 수 없습니다
              </>
            )}
          </h1>
        </div>

        {/* 결과 카드 — bg-primary-faint(#ecf1fa) · radius 8 · p 20 (Figma 10020:81991·82008) */}
        <div className="w-full rounded-krds-8 bg-krds-bg-primary-faint p-krds-9">
          {isSuccess ? (
            <dl className="flex flex-col gap-krds-8 text-center">
              <div className="flex flex-col gap-krds-3">
                <dt className="text-krds-body-md font-bold text-krds-text-ink">소속업체명</dt>
                <dd className="text-krds-body-md text-krds-text-ink">{MOCK_ID_RSLT.blngBzentyNm}</dd>
              </div>
              <div className="flex flex-col gap-krds-3">
                <dt className="text-krds-body-md font-bold text-krds-text-ink">아이디</dt>
                <dd className="text-krds-body-md text-krds-text-ink">{MOCK_ID_RSLT.userId}</dd>
              </div>
            </dl>
          ) : (
            // m_empty data — alert_error 원본 SVG(#C1D1EE 채움 원 + 흰 느낌표) + 17 Medium ink
            <div className="flex flex-col items-center gap-krds-5">
              <img src={alertErrorIcon} alt="" aria-hidden className="size-[30px]" />
              <p className="text-center text-krds-body-md font-medium leading-normal text-krds-text-ink">
                가입된 인증정보가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션바 — 버튼 h-48(default) · 간격 8px (Figma 10020:81998·82010) */}
      <div className="flex flex-col gap-krds-5 pt-krds-8">
        {isSuccess ? (
          <>
            <Button className="w-full" onClick={handleGoIdPwLogin}>
              ID/PW 로그인 바로가기
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleFindPassword}>
              비밀번호 찾기
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={handleUserRegisterGuide}>
            사용자 등록 안내 바로가기
          </Button>
        )}
      </div>
    </div>
  )
}
IdRsltPage.displayName = 'IdRsltPage'
