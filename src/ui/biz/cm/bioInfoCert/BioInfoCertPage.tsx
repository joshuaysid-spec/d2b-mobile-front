// MUI-CM-03-M14 생체인증 (로그인 설계서 slide54 p53 / Figma 10020:87175)
// 생체인증 로그인 진입 화면. 지문 아이콘 + 안내문 + 도움말 + [취소]/[등록하기] 버튼.
// 셸(AppLayout) 안 + sub헤더 라우트(제안 /login/biometric, handle: header variant='sub' title='생체인증').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 설계서(slide54) 동작 메모:
//   - 진입 전 등록된 생체인증이 있는 경우 생체인증 로그인을 진행(성공 시 즉시 로그인).
//     생체인증 대기화면은 시스템(디바이스)에 따름 → 프론트는 디바이스 생체인증 기능 호출만 담당.
//     (하이브리드 브릿지 미연동 — 아래 useEffect 자리는 두지 않고 API 연동 시점에 배선)
//   - [등록하기] → 생체인증 등록 페이지(MUI-CM-03-M15) 이동.
//   - [취소]   → 이전 로그인 선택 화면(MUI-CM-03-M01 MainLogin) 이동.
//
// 디자인 메모(보고 대상):
//   - 지문 아이콘은 Figma 상 파란 원형 액센트가 겹친 KRDS 커스텀 일러스트(별도제작). 폰트 REGISTRY 엔
//     플레인 'fingerprint' 글리프만 있어 카드 + Icon 'Fingerprint' 로 근사(액센트 오버레이 미표현).
import { Button } from '@/ui/common/base/Button'
import { Icon } from '@/ui/common/base/Icon'
import { Infobox } from '@/ui/common/composites/Infobox'

export function BioInfoCertPage() {
  // [등록하기] — 생체인증 등록(MUI-CM-03-M15)으로 이동
  const handleRegister = () => {
    console.log('[bioInfoCert] 생체인증 등록하기')
    // 추후 라우팅: navigate(생체인증 등록 MUI-CM-03-M15)
  }

  // [취소] — 이전 로그인 선택 화면(MainLogin)으로 이동
  const handleCancel = () => {
    console.log('[bioInfoCert] 취소 — 로그인 선택 화면')
    // 추후 라우팅: navigate(-1) 또는 로그인 선택 MUI-CM-03-M01
  }

  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  // min-h-full 로 스크롤 영역을 채워 안내부는 중앙, 도움말/버튼은 하단에 배치.
  return (
    <div className="flex min-h-full flex-col">
      {/* 중앙 안내 — 지문 아이콘 + 문구 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-krds-9 px-krds-8">
        {/* 지문 아이콘 카드 — Figma 커스텀 일러스트 근사(TODO 디자인 에셋) */}
        <div className="flex size-[88px] items-center justify-center rounded-krds-xl border border-krds-border-divider bg-krds-bg-primary-faint shadow-krds-card">
          <Icon
            name="Fingerprint"
            size={48}
            className="text-krds-text-primary-active"
            aria-hidden
          />
        </div>
        <h1 className="text-center text-krds-heading-sm font-bold leading-normal text-krds-text-ink">
          편리한 로그인을 위해
          <br />
          생체정보를 등록할 수 있습니다.
        </h1>
      </div>

      {/* 하단 — 도움말(기본 펼침) + 액션 버튼 */}
      <div className="flex flex-col">
        {/* 도움말 Infobox(collapsible, 기본 펼침). 기본 ⓘ 아이콘 = systemInfo.svg */}
        <Infobox
          defaultOpen
          title="도움말"
          items={['생체인증 로그인은 생체인증이 가능한 디바이스에서 등록 후 이용 가능합니다.']}
        />

        {/* 취소 / 등록하기 (Figma: 취소 좁게 · 등록하기 넓게) */}
        <div className="flex gap-krds-5 px-krds-8 py-krds-8">
          <Button variant="secondary" size="lg" className="flex-1" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" size="lg" className="flex-[2]" onClick={handleRegister}>
            등록하기
          </Button>
        </div>
      </div>
    </div>
  )
}
BioInfoCertPage.displayName = 'BioInfoCertPage'
