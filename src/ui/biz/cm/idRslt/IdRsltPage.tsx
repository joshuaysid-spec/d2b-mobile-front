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
//   - 카드 아이콘(신분증 뱃지): REGISTRY 미등록 'badge' 글리프 → AssignmentInd 로 근사.
//     (추가 권장 REGISTRY 항목: Badge = 'badge')
//   - 실패 안내 아이콘: 원형 정보 마크 → Info 로 근사.
//   - status 는 목업 로컬 상태(기본 success). 실연동 시 아이디찾기 결과로 주입하고 데모 토글 제거.
import { useState } from 'react'

import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'

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
  // 목업: 기본 success. 실연동 시 아이디찾기(MUI-CM-03-M03) 결과로 주입(데모 토글 제거).
  const [status, setStatus] = useState<IdRsltStatus>('success')
  const isSuccess = status === 'success'

  const handleGoIdPwLogin = () => {
    console.log('[idRslt] ID/PW 로그인 바로가기') // 추후 라우팅: ID/PW 로그인(MUI-CM-03-M02)
  }
  const handleFindPassword = () => {
    console.log('[idRslt] 비밀번호 찾기') // 추후 라우팅: 비밀번호 찾기
  }
  const handleUserRegisterGuide = () => {
    console.log('[idRslt] 사용자 등록 안내 바로가기') // 추후 라우팅: 사용자 등록 안내
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

      {/* 본문 — 신분증 아이콘 + 헤딩 + 결과 카드 (세로 중앙) */}
      <div className="flex flex-1 flex-col items-center pt-krds-14">
        <div className="flex size-[72px] items-center justify-center rounded-krds-xl bg-krds-bg-primary-faint">
          {/* TODO(디자인 에셋): badge(신분증 뱃지) — REGISTRY 미등록, AssignmentInd 로 근사 */}
          <Icon
            name="AssignmentInd"
            size={40}
            fill={isSuccess ? 1 : 0}
            className="text-krds-text-primary"
            aria-hidden
          />
        </div>

        <h1 className="mt-krds-8 text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
          {isSuccess ? '사용자 ID를 확인해주세요' : '사용자 ID를 확인할 수 없습니다'}
        </h1>

        {/* 결과 카드 */}
        <div className="mt-krds-8 w-full rounded-krds-xl bg-krds-bg-secondary px-krds-8 py-krds-9">
          {isSuccess ? (
            <dl className="flex flex-col gap-krds-6 text-center">
              <div className="flex flex-col gap-krds-2">
                <dt className="text-krds-body-md font-bold text-krds-text-ink">소속업체명</dt>
                <dd className="text-krds-body-md text-krds-text-ink">{MOCK_ID_RSLT.blngBzentyNm}</dd>
              </div>
              <div className="flex flex-col gap-krds-2">
                <dt className="text-krds-body-md font-bold text-krds-text-ink">아이디</dt>
                <dd className="text-krds-body-md text-krds-text-ink">{MOCK_ID_RSLT.userId}</dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col items-center gap-krds-3">
              {/* TODO(디자인 에셋): 원형 정보 마크 — Info 로 근사 */}
              <Icon name="Info" size={24} fill={1} className="text-krds-text-muted" aria-hidden />
              <p className="text-krds-body-md leading-normal text-krds-text-muted">
                가입된 인증정보가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션바 */}
      <div className="flex flex-col gap-krds-3 pt-krds-9">
        {isSuccess ? (
          <>
            <Button size="lg" className="w-full" onClick={handleGoIdPwLogin}>
              ID/PW 로그인 바로가기
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={handleFindPassword}>
              비밀번호 찾기
            </Button>
          </>
        ) : (
          <Button size="lg" className="w-full" onClick={handleUserRegisterGuide}>
            사용자 등록 안내 바로가기
          </Button>
        )}
      </div>
    </div>
  )
}
IdRsltPage.displayName = 'IdRsltPage'
