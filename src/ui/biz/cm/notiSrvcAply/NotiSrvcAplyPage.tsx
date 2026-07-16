// 알림서비스 신청 및 해지 — MUI-CM-02-M09. Figma 10020-82330 / 설계서 00.공통 v0.84 slide65(notiSrvcAply).
// 마이페이지 > 알림 서비스 신청 및 해지. 알림 수신정보 확인 + 알림 수단/항목별 on/off 설정.
// 구성: 안내(Notice) + 수신정보(휴대전화/이메일 + 회원정보 수정) + 알림 수단 선택(앱 PUSH·SMS/이메일)
//        + 알림 항목 선택(12개 항목별 토글). 값은 목업 초기상태(Figma), 토글은 로컬 상태 + API 경계 주석.
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { Switch } from '@/ui/common/base/Switch'
import { Notice } from '@/ui/common/composites/Notice'
import { cn } from '@/utils/cn'

// ── 수신정보(마스킹된 회원 연락처 — 추후 회원정보 API) ──────────────────────
const RECV_INFO: { label: string; value: string }[] = [
  { label: '휴대전화번호', value: '010-****-1234' },
  { label: '이메일', value: 'user****@naver.com' },
]

// ── 알림 수단(앱 PUSH · SMS/이메일) ─────────────────────────────────────────
const NOTI_MEANS: { id: string; icon: IconName; title: string; desc: string; defaultOn: boolean }[] = [
  { id: 'push', icon: 'Smartphone', title: '앱 PUSH', desc: '모바일 앱으로 알림', defaultOn: false },
  {
    id: 'sms',
    icon: 'Mail',
    title: 'SMS / 이메일',
    desc: '알림은 알림 항목 선택에 따라 자동으로 발송됩니다',
    defaultOn: false,
  },
]

// ── 알림 항목(12개 — 제목/설명/기본 on-off 는 Figma 목업값) ─────────────────
const NOTI_ITEMS: { id: string; title: string; desc: string; defaultOn: boolean }[] = [
  {
    id: 'bidStep',
    title: '입찰 단계별 안내',
    desc: '등록심사, 적격심사, 낙찰자 선정 등 전자입찰 단계별 주요사항을 안내합니다.',
    defaultOn: false,
  },
  {
    id: 'regItemBid',
    title: '등록품목 입찰공고 안내',
    desc: '조달업체의 등재 된 품목코드의 입찰공고가 등록되면 안내합니다.',
    defaultOn: false,
  },
  {
    id: 'itrstCntrctBid',
    title: '관심 계약팀 입찰공고 안내',
    desc: '관심 발주기관(계약팀)에서 입찰공고가 등록되면 안내합니다 (팝업에서 선택)',
    defaultOn: true,
  },
  {
    id: 'cntrctStep',
    title: '계약단계 안내',
    desc: '전자계약 단계별 진행상황 안내, 전자세금계산서 승인현황, 인지세납부 등을 안내합니다.',
    defaultOn: false,
  },
  {
    id: 'inspPay',
    title: '검사/검수/출납 안내',
    desc: '검사/검수/출납 항목이 확정 또는 반려되었을 시 안내합니다.',
    defaultOn: true,
  },
  {
    id: 'clmPay',
    title: '대금청구 및 지급 안내',
    desc: '대금청구의 접수/반려와 대금지급에 대해 안내합니다.',
    defaultOn: true,
  },
  {
    id: 'dlvrCert',
    title: '납품실적증명서 발급',
    desc: '납품실적증명서 발급 시 안내합니다.',
    defaultOn: false,
  },
  {
    id: 'itemReg',
    title: '품목등재 신청/확정/갱신',
    desc: '품목등록 관련 사항을 안내합니다.',
    defaultOn: true,
  },
  {
    id: 'natoCode',
    title: '나토 생산자부호 접수/완료',
    desc: '나토 생산자부호 접수 시 등록된 전화번호로 안내합니다.',
    defaultOn: true,
  },
  {
    id: 'sysNoticeD2b',
    title: '시스템 공지사항 안내',
    desc: '국방전자조달시스템 주요 공지사항을 안내합니다.',
    defaultOn: false,
  },
  {
    id: 'faultNoti',
    title: '장애발생/복구 안내',
    desc: '국방전자조달시스템 장애발생 및 복구사항을 안내합니다.',
    defaultOn: true,
  },
  {
    id: 'sysNoticeCost',
    title: '시스템 공지사항 안내',
    desc: '국방통합원가시스템 주요 공지사항을 안내합니다.',
    defaultOn: true,
  },
]

// 섹션 제목(24px bold) + 우측 유틸 슬롯.
function SectionHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-krds-8 px-krds-8 pb-krds-9">
      <p className="min-w-px flex-1 text-[24px] font-bold leading-normal text-krds-text-ink">
        {children}
      </p>
      {action}
    </div>
  )
}

function SectionDivider() {
  return <div className="my-krds-9 h-px w-full bg-krds-border-divider" aria-hidden />
}

// 알림 토글 행 — 아이콘 + [제목(19 bold) + 토글] + 설명(17 muted). 행 사이 구분선.
function NotiToggleRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  first,
  last,
}: {
  icon: IconName
  title: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  first: boolean
  last: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-krds-5',
        first ? 'pb-krds-8' : last ? 'pt-krds-8' : 'py-krds-8',
        !last && 'border-b border-krds-border-divider',
      )}
    >
      <div className="flex shrink-0 items-center pt-0.5">
        <Icon name={icon} size={24} className="text-krds-text-ink" aria-hidden />
      </div>
      <div className="flex min-w-px flex-1 flex-col gap-krds-5">
        <div className="flex items-start gap-krds-5">
          <p className="min-w-px flex-1 text-[19px] font-bold leading-normal text-krds-text-ink">
            {title}
          </p>
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-label={title}
            className="shrink-0"
          />
        </div>
        <p className="text-[17px] leading-normal text-krds-text-muted">{description}</p>
      </div>
    </div>
  )
}

export function NotiSrvcAplyPage() {
  // 알림 수단/항목 on-off — Figma 초기값. 토글 시 로컬 반영 + API 경계.
  const [means, setMeans] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTI_MEANS.map((m) => [m.id, m.defaultOn])),
  )
  const [items, setItems] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTI_ITEMS.map((it) => [it.id, it.defaultOn])),
  )

  const toggleMeans = (id: string, v: boolean) => {
    setMeans((prev) => ({ ...prev, [id]: v }))
    console.log('[NotiSrvcAply] 알림 수단', id, v) // 추후 API: cmService.setNotiMeans(id, v)
  }
  const toggleItem = (id: string, v: boolean) => {
    setItems((prev) => ({ ...prev, [id]: v }))
    console.log('[NotiSrvcAply] 알림 항목', id, v) // 추후 API: cmService.setNotiItem(id, v)
  }
  const goEditMember = () => {
    // 추후: 회원정보 수정 화면 이동.
    console.log('[NotiSrvcAply] 회원정보 수정')
  }

  return (
    <div className="flex flex-col pb-6">
      {/* 안내 */}
      <div className="p-krds-8">
        <Notice>입찰 · 계약 관련 주요 업무 알림을 모바일로 받을 수 있습니다.</Notice>
      </div>

      {/* 수신정보 */}
      <section>
        <SectionHeading
          action={
            <button
              type="button"
              onClick={goEditMember}
              className="flex shrink-0 items-center gap-krds-3 rounded-[4px]"
            >
              <span className="text-[17px] font-medium leading-normal text-krds-text-primary">
                회원정보 수정
              </span>
              <Icon name="ArrowForwardIos" size={20} className="text-krds-text-primary" aria-hidden />
            </button>
          }
        >
          수신정보
        </SectionHeading>
        <div className="flex flex-col gap-1 px-krds-8">
          {RECV_INFO.map((row) => (
            <div key={row.label} className="flex items-start gap-krds-5">
              <span className="min-w-px flex-1 text-[17px] font-medium leading-normal text-krds-text-ink">
                {row.label}
              </span>
              <span className="min-w-px flex-1 text-right text-[17px] leading-normal text-krds-text-ink">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 알림 수단 선택 */}
      <section>
        <SectionHeading>알림 수단 선택</SectionHeading>
        <div className="flex flex-col px-krds-8">
          {NOTI_MEANS.map((m, i) => (
            <NotiToggleRow
              key={m.id}
              icon={m.icon}
              title={m.title}
              description={m.desc}
              checked={means[m.id]}
              onCheckedChange={(v) => toggleMeans(m.id, v)}
              first={i === 0}
              last={i === NOTI_MEANS.length - 1}
            />
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 알림 항목 선택 */}
      <section>
        <SectionHeading>알림 항목 선택</SectionHeading>
        <div className="flex flex-col px-krds-8">
          {NOTI_ITEMS.map((it, i) => (
            <NotiToggleRow
              key={it.id}
              icon="NotificationsActive"
              title={it.title}
              description={it.desc}
              checked={items[it.id]}
              onCheckedChange={(v) => toggleItem(it.id, v)}
              first={i === 0}
              last={i === NOTI_ITEMS.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
NotiSrvcAplyPage.displayName = 'NotiSrvcAplyPage'
