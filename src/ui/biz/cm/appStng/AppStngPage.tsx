// 설정 — MUI-MS-02-M01. Figma 10020-87979 / 설계서 00.공통 v0.83 slide365·368.
// 전체메뉴 > 설정. 앱 설정 정보를 안내/제어(알림 설정·앱 설정·약관). 정적 안내 + 로컬 상태(토글/아코디언).
// 구성: 알림 설정(푸시 토글 + 알림 서비스 바로가기) · 앱 설정(권한/버전정보 아코디언/캐시삭제) · 약관(개인정보/저작권).
//  - 앱 캐시 삭제 클릭 → 확인 팝업(AlertModal, MUI-MS-02-P02 AppCashDel). 취소/삭제.
// 색은 KRDS 토큰(#d1d7e0=border-divider, #f5f9ff=bg-blue-pastel, #1d1d1d=text-ink, #555≈text-muted).
// 참고: 설계서 경로는 ms/appStng 이나, 레포 컨벤션(MS 화면은 cm/ 하위)에 맞춰 cm/appStng 에 둔다(영문 ID 유지).
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { Icon, type IconName } from '@/ui/common/base/Icon'
import { Switch } from '@/ui/common/base/Switch'
import { AlertModal } from '@/ui/common/composites/AlertModal'

// 섹션 제목 (24px bold).
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-5">
      <p className="text-[24px] font-bold leading-normal text-krds-text-ink">{children}</p>
    </div>
  )
}

// 설정 카드 — 흰 배경 + border-divider + 미세 그림자. 내부 행/구분선을 담는다.
function SettingCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 flex flex-col rounded-[12px] border border-krds-border-divider bg-white px-4 shadow-[0_0_5px_rgba(23,43,77,0.1)]">
      {children}
    </div>
  )
}

// 설정 행 — 아이콘 + 라벨(17px bold) + 우측 이동 화살표(trending_flat). 클릭 시 이동/동작.
function SettingRow({
  icon,
  label,
  onClick,
}: {
  icon: IconName
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-2 py-5 text-left"
    >
      <Icon name={icon} size={24} className="shrink-0 text-krds-text-ink" aria-hidden />
      <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
        {label}
      </span>
      <Icon name="TrendingFlat" size={20} className="shrink-0 text-krds-text-ink" aria-hidden />
    </button>
  )
}

function RowDivider() {
  return <div className="h-px w-full bg-krds-border-divider" aria-hidden />
}

// 앱 버전정보 — 아코디언 행(아이콘 + 라벨 + 버전 + 펼침 chevron). 펼치면 기기/버전 정보 박스.
const APP_VERSION = 'v1.0.1'
const VERSION_INFO: { label: string; data: string }[] = [
  { label: '현재 앱 버전', data: 'V 1.0.1' },
  { label: '내 기기 정보', data: 'iPhone 16.2' },
  { label: '내 기기 OS', data: 'ios' },
]

function AppVersionAccordion() {
  const [open, setOpen] = useState(true) // Figma 기본 펼침
  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-2 py-5 text-left"
      >
        <Icon name="Smartphone" size={24} className="shrink-0 text-krds-text-ink" aria-hidden />
        <span className="min-w-px flex-1 text-[17px] font-bold leading-normal text-krds-text-ink">
          앱 버전정보
        </span>
        <span className="shrink-0 text-[17px] font-bold text-krds-text-primary-active">
          {APP_VERSION}
        </span>
        <Icon
          name="ExpandMore"
          size={20}
          className={`shrink-0 text-krds-text-ink transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="mb-5 flex flex-col gap-1 rounded-[12px] bg-krds-bg-blue-pastel p-4">
          {VERSION_INFO.map((row) => (
            <div key={row.label} className="flex items-start gap-2 text-[17px] leading-normal">
              <span className="min-w-px flex-1 text-krds-text-muted">{row.label}</span>
              <span className="min-w-px flex-1 text-right text-krds-text-muted">{row.data}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function AppStngPage() {
  const navigate = useNavigate()
  // 앱 푸시 알림 — 마이페이지 알림설정 값과 동일(추후 API 로 초기화). 현재 mock ON.
  const [pushOn, setPushOn] = useState(true)
  // 앱 캐시 삭제 확인 팝업(MUI-MS-02-P02).
  const [cacheOpen, setCacheOpen] = useState(false)

  return (
    <div className="flex w-full flex-col pb-6">
      {/* 알림 설정 */}
      <SectionTitle>알림 설정</SectionTitle>
      <div className="flex flex-col gap-4 px-4 pb-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[19px] font-bold leading-normal text-krds-text-ink">앱 푸시 알림</p>
            <Switch
              checked={pushOn}
              onCheckedChange={(v) => {
                setPushOn(v)
                console.log('[AppStng] 앱 푸시 알림', v) // 추후 API: cmService.setPushNoti(v)
              }}
              aria-label="앱 푸시 알림"
            />
          </div>
          <p className="text-[17px] leading-normal text-krds-text-muted">모바일 앱으로 알림</p>
        </div>
        <SettingCard>
          {/* 마이페이지 하단의 '알림 서비스 신청 및 해지'(MUI-CM-02-M09 NotiSrvcAplyPage)와 동일 화면. */}
          <SettingRow
            icon="NotificationsActive"
            label="알림 서비스 신청 및 해지"
            onClick={() => navigate(ROUTES.NOTI_SRVC_APLY)}
          />
        </SettingCard>
      </div>

      {/* 앱 설정 */}
      <SectionTitle>앱 설정</SectionTitle>
      <div className="flex flex-col px-0 pb-5">
        <SettingCard>
          <SettingRow
            icon="Smartphone"
            label="앱 권한 설정"
            onClick={() => console.log('[AppStng] 앱 권한 설정')} // 추후: 시스템 앱 설정으로 이동(Native)
          />
          <RowDivider />
          <AppVersionAccordion />
          <RowDivider />
          <SettingRow icon="Smartphone" label="앱 캐시 삭제" onClick={() => setCacheOpen(true)} />
        </SettingCard>
      </div>

      {/* 약관 */}
      <SectionTitle>약관</SectionTitle>
      <div className="flex flex-col px-0 pb-5">
        <SettingCard>
          <SettingRow
            icon="Description"
            label="개인정보처리방침"
            onClick={() => window.open('https://www.dapa.go.kr/', '_blank', 'noopener')} // 외부 브라우저 링크
          />
          <RowDivider />
          <SettingRow
            icon="Description"
            label="저작권 정책"
            onClick={() => window.open('https://www.dapa.go.kr/', '_blank', 'noopener')} // 외부 브라우저 링크
          />
        </SettingCard>
      </div>

      {/* 앱 캐시 삭제 확인 팝업 (MUI-MS-02-P02) */}
      <AlertModal
        open={cacheOpen}
        onOpenChange={setCacheOpen}
        variant="none"
        title="앱 캐시 삭제"
        description="앱에 임시 보관된 캐시를 삭제할까요?"
        secondaryAction={{ label: '취소' }}
        primaryAction={{
          label: '삭제',
          onClick: () => console.log('[AppStng] 앱 캐시 삭제 실행'), // 추후: Native 캐시 삭제 브릿지
        }}
      />
    </div>
  )
}
AppStngPage.displayName = 'AppStngPage'
