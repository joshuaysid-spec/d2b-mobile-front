// MUI-MS-01-M02 앱접근권한동의 - 앱 접근권한 안내 (Figma 10020:81679)
// 프리로그인 단계에서 앱이 사용하는 접근권한(필수/선택)을 안내하고 [확인] 으로 필수 권한 동의를 처리한다.
// 셸(AppLayout) 밖 독립 풀스크린 라우트(/app-authrt-agre) — 헤더·바텀네비 없음. 배경은 흰색(Figma).
//
// 설계서 ↔ Figma '알림' 권한 분류가 달랐음(설계서=필수 / Figma=선택).
//   → 사용자 확정: 설계서대로 '알림' 을 [필수 접근권한] 5번째로 둔다.
//
// 동작(백엔드 미연동 — 경계만 표시): [확인] 클릭 시 필수 접근권한 동의 처리 후 다음 화면 이동.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { Button } from '@/ui/common/base/Button'
import { AppAuthrtAgre } from '@/ui/biz/cm/appAuthrtAgre/AppAuthrtAgre'
import { AppUpdateInfo } from '@/ui/biz/cm/appAuthrtAgre/AppUpdateInfo'
import { AppErrInfo } from '@/ui/biz/cm/appAuthrtAgre/AppErrInfo'

interface PermissionItem {
  /** 안정적 고유 key. */
  id: string
  /** 좌측 아이콘(Icon REGISTRY 키). */
  icon: IconName
  /** 권한명 (설계서 원문 그대로). */
  title: string
  /** 권한 용도 설명 (설계서 원문 그대로). */
  desc: string
}

// [필수 접근권한] — 설계서 데이터영역 순서. 아이콘 = Figma 글리프 정식 매핑.
const REQUIRED_PERMISSIONS: PermissionItem[] = [
  {
    id: 'deviceAppRecord',
    icon: 'Smartphone',
    title: '기기 및 앱 기록',
    desc: '앱 상태(버전) 확인, 앱 접근 메뉴 확인',
  },
  {
    id: 'deviceId',
    icon: 'AssignmentInd',
    title: '기기 ID 정보',
    desc: '접속 기기 식별, OS 식별',
  },
  {
    id: 'internetConn',
    icon: 'Public',
    title: '인터넷 연결 정보',
    desc: '접속 IP, 접속 정보 확인',
  },
  { id: 'location', icon: 'Map', title: '위치 정보', desc: '접속 위치 정보 확인' },
  {
    id: 'notification',
    icon: 'Notifications',
    title: '알림',
    desc: '신청한 공고 알림, 중요 알림 메시지',
  },
]

// [선택 접근권한] — 설계서 원문 기준(전화·사진/미디어/파일·카메라 3개). '알림'은 필수로 이동(사용자 확정).
// 아이콘 = Figma 글리프 정식 매핑(Call/Image/PhotoCamera).
const OPTIONAL_PERMISSIONS: PermissionItem[] = [
  { id: 'phone', icon: 'Call', title: '전화', desc: '전화 걸기 및 관리' },
  { id: 'media', icon: 'Image', title: '사진/미디어/파일', desc: '이미지 파일첨부, 문서 파일첨부' },
  { id: 'camera', icon: 'PhotoCamera', title: '카메라', desc: 'PC 로그인, 촬영 파일 등록' },
]

// 하단 안내 문구(설계서 원문) — Figma 인포박스의 3개 불릿.
const GUIDANCE_NOTES = [
  { id: 'optAgree', text: '선택 접근권한은 관련 기능 이용시 동의하실 수 있습니다.' },
  { id: 'optDeny', text: '미동의 시에도 해당 기능외 앱 서비스 이용이 가능합니다.' },
  { id: 'settings', text: '휴대폰의 보안설정에서 접근 권한을 변경하실 수 있습니다.' },
]

/** 권한 1건: 좌측 아이콘 + (권한명 / 용도설명) — 필수·선택 공용. */
function PermissionRow({ item }: { item: PermissionItem }) {
  return (
    <li className="flex items-start gap-krds-7">
      <Icon name={item.icon} size={24} className="mt-krds-1 text-krds-text-primary" aria-hidden />
      <div className="flex flex-col gap-krds-1">
        <span className="text-krds-body-md font-bold text-krds-text-strong">{item.title}</span>
        <span className="text-krds-body-sm text-krds-text-muted">{item.desc}</span>
      </div>
    </li>
  )
}

export function AppAuthrtAgrePage() {
  const navigate = useNavigate()
  // 앱실행 순차 흐름: [확인] → P03 → P04 → P05 → 홈. (업체선택 P14 는 로그인 후 별도 흐름)
  const [step, setStep] = useState<'form' | 'p03' | 'p04' | 'p05'>('form')

  const handleConfirm = () => {
    // 필수 접근권한 동의 처리 후 P03(선택 접근권한 팝업)부터 순차 진행.
    console.log(
      '[AppAuthrtAgre] 필수 접근권한 동의 확인',
      REQUIRED_PERMISSIONS.map((p) => p.id),
    )
    // 추후 API: authService.agreeAppPermission(REQUIRED_PERMISSIONS.map((p) => p.id))
    setStep('p03')
  }

  // P05 까지 끝나면 홈으로. (홈에서 첫 진입이면 P06 이용안내 → 공지 P08 순으로 노출)
  const handleLaunchDone = () => {
    setStep('form')
    navigate('/')
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-background">
      {/* 본문(스크롤 영역) */}
      <div className="flex-1 overflow-y-auto px-krds-10 pt-krds-12 pb-krds-9">
        {/* 헤더 타이틀 + 안내문 */}
        <h1 className="text-krds-heading-lg font-bold text-krds-text-strong">앱 접근권한 안내</h1>
        <p className="mt-krds-7 text-krds-body-md text-krds-text-muted">
          국방전자조달시스템에서는 다음 권한들을 사용합니다. 서비스 시용을 위해 권한을 허용해 주시기
          바랍니다.
        </p>

        {/* 필수 접근권한 */}
        <section className="mt-krds-12">
          <h2 className="text-krds-heading-sm font-bold text-krds-text-strong">필수 접근권한</h2>
          <ul className="mt-krds-8 flex flex-col gap-krds-8">
            {REQUIRED_PERMISSIONS.map((item) => (
              <PermissionRow key={item.id} item={item} />
            ))}
          </ul>
        </section>

        {/* 선택 접근권한 */}
        <section className="mt-krds-12">
          <h2 className="text-krds-heading-sm font-bold text-krds-text-strong">선택 접근권한</h2>
          <ul className="mt-krds-8 flex flex-col gap-krds-8">
            {OPTIONAL_PERMISSIONS.map((item) => (
              <PermissionRow key={item.id} item={item} />
            ))}
          </ul>
        </section>

        {/* 하단 안내 인포박스 */}
        <div className="mt-krds-12 border-t border-krds-border-divider pt-krds-9">
          <ul className="flex flex-col gap-krds-5 rounded-krds-8 bg-krds-bg-primary-faint p-krds-8">
            {GUIDANCE_NOTES.map((note) => (
              <li key={note.id} className="flex gap-krds-4 text-krds-body-sm text-krds-text-info">
                <span aria-hidden>•</span>
                <span>{note.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 고정 확인 버튼 */}
      <div className="shrink-0 px-krds-10 pb-krds-9 pt-krds-5">
        <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm}>
          확인
        </Button>
      </div>

      {/* 앱실행 순차 팝업: P03 선택권한 → P04 업데이트 → P05 오류 → 홈 */}
      <AppAuthrtAgre
        open={step === 'p03'}
        onOpenChange={(o) => {
          if (!o) setStep('p04')
        }}
      />
      <AppUpdateInfo
        open={step === 'p04'}
        onOpenChange={(o) => {
          if (!o) setStep('p05')
        }}
      />
      <AppErrInfo
        open={step === 'p05'}
        onOpenChange={(o) => {
          if (!o) handleLaunchDone()
        }}
      />
    </div>
  )
}
AppAuthrtAgrePage.displayName = 'AppAuthrtAgrePage'
