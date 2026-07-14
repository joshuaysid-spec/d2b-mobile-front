// MUI-MS-01-M01 앱실행 스플래시 - 로고 (설계서 00.공통 p17 / Figma 10020:81760)
// 앱 기동 시 노출되는 로고 스플래시. 로고 + 태그라인 + 로딩 스피너(진행률).
// 셸(AppLayout) 밖 독립 풀스크린 라우트(/splash) — 헤더·바텀네비 없음.
//
// 동작: 로딩 진행률(목업) 0→100% 애니메이션 → 100% 도달 시 앱 접근권한 동의(M02, /app-authrt-agre)로 이동.
//   설계서 실제 흐름: 보안 프로그램 로딩(TouchEn mVacchine/mTransKey/AppIron, smart pki) + 버전 체크
//   → 정상: 다음 화면 / 필수 업데이트: P04 / 오류: P05. (백엔드 미연동 — 진행률은 목업 타이머)
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Logo } from '@/ui/common/base/Logo'
import { Spinner } from '@/ui/common/base/Spinner'

export function SplashPage() {
  const navigate = useNavigate()
  const [percent, setPercent] = useState(0)

  // 목업 로딩 진행률 애니메이션. 추후: 보안 프로그램 로딩/버전 체크 실제 진행률 바인딩.
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((p) => Math.min(p + 4, 100))
    }, 70)
    return () => clearInterval(timer)
  }, [])

  // 100% 도달 → 앱 접근권한 동의(M02)로 이동.
  useEffect(() => {
    if (percent < 100) return
    const t = setTimeout(() => navigate('/app-authrt-agre'), 400)
    return () => clearTimeout(t)
  }, [percent, navigate])

  return (
    <div className="flex h-dvh w-full flex-col items-center bg-krds-bg-secondary px-6">
      {/* 로고 + 태그라인 — 화면 상단 ~38%(Figma y=290/768) */}
      <div className="flex flex-col items-center gap-2 pt-[38dvh]">
        <Logo className="h-10 w-[244px]" alt="국방전자조달시스템" />
        {/* TODO(디자인 에셋): '투명한 전자입찰' 은 Figma 손글씨 스타일 그래픽.
            get_design_context 타임아웃으로 원본 SVG 미추출 → 임시 텍스트 근사(보고 대상). */}
        <span className="text-krds-text-primary font-bold tracking-tight">
          투명한 전자입찰
        </span>
      </div>

      {/* 로딩 스피너 + 진행률 — 화면 하단 ~74%(Figma y=566/768) */}
      <div className="mt-auto pb-[16dvh]">
        <Spinner percent={percent} />
      </div>
    </div>
  )
}
SplashPage.displayName = 'SplashPage'
