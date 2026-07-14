// MUI-CM-03-M01 로그인-방식 선택 (Figma 10020:84937)
// anyID 솔루션 화면 활용 — 6개 인증방식 카드 중 선택 시 해당 인증화면으로 이동.
// (anyID 정책에 따라 개인·기업 선택 로그인이 추가될 수 있음)
// 셸(AppLayout) 안 + sub헤더 라우트(/login, handle: header variant='sub' title='로그인').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 디자인/설계서 메모(보고 대상):
//   - 설계서 원문의 "하단 [로그인] 버튼" 은 Figma(10020:84937)에 없음(사용자 확정: Figma대로 제외).
//     6개 인증방식 카드가 로그인 진입점.
//   - 인증방식 카드 아이콘 5종(간편/모바일신분증/공동/금융/아이디·비번)은 KRDS '별도제작' 커스텀
//     아이콘이라 폰트 기반 Icon REGISTRY 에 없음 → 의미가 가까운 Material Symbols 로 임시 근사(각 TODO).
//     생체인증만 Fingerprint 로 정확 매핑. person_add(사용자 등록 버튼)도 REGISTRY 미등록 → Person 근사.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon, type IconName } from '@/ui/common/base/Icon'
import { InputLabel } from '@/ui/common/base/InputLabel'
import { BottomSheet } from '@/ui/common/composites/BottomSheet'
import { Infobox } from '@/ui/common/composites/Infobox'
import { SimpleCert } from '@/ui/biz/cm/simpleCert/SimpleCertPage'
import { FnstCert } from '@/ui/biz/cm/fnstCert/FnstCertPage'
import { JntCert } from '@/ui/biz/cm/jntCert/JntCertPage'
import { MobileIdntyCert } from '@/ui/biz/cm/mobileIdntyCert/MobileIdntyCertPage'

interface LoginMethod {
  /** 인증방식 식별자 — 클릭 시 라우팅/시트 분기 기준. */
  id: string
  /** 카드 라벨(설계서 문구 그대로). */
  label: string
  /** 카드 아이콘. 별도제작 5종은 근사 매핑(TODO), 생체인증만 정확 매핑. */
  iconName: IconName
  /** 선택 시 이동할 인증화면 경로(라벨 아닌 데이터로 분기). */
  path: string
  /** true = 바텀시트 모달로 열림(P10~P13). 미지정 = path 로 페이지 이동(생체·ID/PW). */
  sheet?: boolean
}

// 설계서 인증방식 목록(순서 그대로). iconName 은 Figma 별도제작 아이콘의 임시 근사.
// P10~P13(간편/모바일신분증/공동/금융)은 Figma상 바텀시트 → sheet:true.
const LOGIN_METHODS: LoginMethod[] = [
  // TODO(디자인 에셋): certification_simple(KRDS 별도제작) — REGISTRY 미등록, Login 으로 임시 근사
  { id: 'simpleAuth', label: '간편인증', iconName: 'Login', path: '/login/simple-cert', sheet: true },
  // TODO(디자인 에셋): certification_mobile(KRDS 별도제작) — REGISTRY 미등록, AssignmentInd 로 임시 근사
  { id: 'mobileId', label: '모바일신분증', iconName: 'AssignmentInd', path: '/login/mobile-id', sheet: true },
  // TODO(디자인 에셋): 공동인증서(KRDS 별도제작) — REGISTRY 미등록, VerifiedUser 로 임시 근사
  { id: 'jointCert', label: '공동인증서', iconName: 'VerifiedUser', path: '/login/joint-cert', sheet: true },
  // TODO(디자인 에셋): 금융인증서(KRDS 별도제작) — REGISTRY 미등록, Description 으로 임시 근사
  { id: 'financeCert', label: '금융인증서', iconName: 'Description', path: '/login/finance-cert', sheet: true },
  // fingerprint — Material Symbols 정확 매핑
  { id: 'biometric', label: '생체인증', iconName: 'Fingerprint', path: '/login/biometric' },
  // TODO(디자인 에셋): id_password(KRDS 별도제작) — REGISTRY 미등록, Person 으로 임시 근사
  { id: 'idPw', label: '아이디·비밀번호', iconName: 'Person', path: '/login/id-pw' },
]

export function MainLoginPage() {
  const navigate = useNavigate()
  // 열린 인증수단 바텀시트(method.id) — P10~P13. 생체·ID/PW 는 페이지 이동.
  const [openSheet, setOpenSheet] = useState<string | null>(null)
  const closeSheet = (open: boolean) => {
    if (!open) setOpenSheet(null)
  }

  const handleSelectMethod = (method: LoginMethod) => {
    // (추후: 인증 성공 → 소속업체 많으면 P14 → 홈)
    if (method.sheet) {
      setOpenSheet(method.id)
      return
    }
    navigate(method.path)
  }

  const handleUserRegisterGuide = () => {
    navigate('/login/user-reg-info') // 사용자 등록 안내(MUI-CM-03-M09)
  }

  return (
    <>
      {/* 인증방식 선택 */}
      <section className="flex flex-col gap-krds-5 px-krds-8 pt-krds-9">
        <InputLabel>인증방식 선택</InputLabel>
        <div className="grid grid-cols-2 gap-krds-8">
          {LOGIN_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelectMethod(method)}
              className="flex h-[86px] flex-col items-center justify-center gap-krds-3 rounded-krds-xl border border-krds-border-divider bg-background shadow-krds-card"
            >
              <Icon name={method.iconName} size={24} aria-hidden />
              <span className="text-krds-body-lg font-bold text-krds-text-ink">{method.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 처음 방문하셨나요? */}
      <section className="flex flex-col gap-krds-9 px-krds-8 pt-krds-14 pb-krds-8">
        <h2 className="text-krds-heading-lg font-bold leading-normal tracking-[1px]">
          <span className="text-krds-text-primary">처음 </span>
          <span className="text-krds-text-ink">방문하셨나요?</span>
        </h2>

        <div className="flex flex-col gap-krds-8">
          <p className="text-krds-body-md leading-normal text-krds-text-ink">
            사용자 등록 방법을 자세하게 안내드립니다. 모바일에서는 업체등록, 사용자등록을 지원하지
            않습니다.
          </p>

          {/* 사용자 등록 안내 바로가기 — Figma m_button_ (카드형 이동 버튼) */}
          <button
            type="button"
            onClick={handleUserRegisterGuide}
            className="flex h-[74px] items-center gap-krds-5 rounded-krds-xl border border-krds-border-divider bg-background px-krds-10 shadow-krds-card"
          >
            <Icon name="Person" size={24} aria-hidden className="shrink-0" />
            <span className="flex-1 text-left text-krds-body-lg font-bold text-krds-text-ink">
              사용자 등록 안내 바로가기
            </span>
            <Icon name="TrendingFlat" size={20} aria-hidden className="shrink-0" />
          </button>

          {/* 로그인에 어려움이 있으신가요? — Infobox(static, 항상 펼침) */}
          <Infobox
            collapsible={false}
            title="로그인에 어려움이 있으신가요?"
            items={[
              '비밀번호 자동완성기능(ex. 알패스 등)은 사용할 수 없습니다.',
              <>1577-1118 대표전화로 전화주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.</>,
            ]}
          />
        </div>
      </section>

      {/* 인증수단 바텀시트(P10~P13) — 카드 클릭 시 해당 시트 오픈 */}
      <BottomSheet open={openSheet === 'simpleAuth'} onOpenChange={closeSheet} title="간편인증">
        <SimpleCert />
      </BottomSheet>
      <BottomSheet open={openSheet === 'financeCert'} onOpenChange={closeSheet} title="금융인증서">
        <FnstCert />
      </BottomSheet>
      <BottomSheet open={openSheet === 'jointCert'} onOpenChange={closeSheet} title="공동인증서">
        <JntCert />
      </BottomSheet>
      <BottomSheet open={openSheet === 'mobileId'} onOpenChange={closeSheet} title="모바일 신분증">
        <MobileIdntyCert />
      </BottomSheet>
    </>
  )
}
MainLoginPage.displayName = 'MainLoginPage'
