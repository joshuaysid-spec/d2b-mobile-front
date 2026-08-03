// MUI-CM-03-M09 사용자 등록 안내 (설계서 로그인 slide49 p48 / Figma 10020:82040)
// 조달업체 사용자 등록 절차·대상·방법을 안내하는 정적 안내 화면. 입력/폼 없음(읽기 전용).
// 모바일에서는 업체등록·사용자등록 기능이 없어 'PC버전에서만 등록 가능'을 강조 표시한다.
// 셸(AppLayout) 안 + sub헤더 라우트(/login/user-reg-info, header variant='sub' title='사용자 등록 안내').
// 헤더·스크롤(#app-scroll)·뒤로가기는 AppLayout 이 소유 → 페이지는 콘텐츠만 렌더.
//
// 디자인 정합(2026-08-03, Figma 10020:82040 재분석):
//   - 페이지 타이틀 = m_page title_24(24px Bold, px16/py20) → 공통 PageTitle 사용.
//   - 섹션 = p-16, 타이틀(19 Bold)·불릿 간 4px. 불릿(m_list) = 20px 박스 안 6px 도트 + gap 4.
//   - 붉은 강조 문구 = 14px #db083e(text-krds-badge-red). 좌측 확성기(sub_notice)는 KRDS 별도제작
//     글리프 — Figma 원본 SVG 에셋(subNoticeIcon.svg, 20px 박스 안 14px) 사용(2026-08-03 campaign 근사 교체).
//   - 하단 ※ 유의사항 = 배경 박스 없음 · 17px #425679(text-krds-text-info) · ※ 는 20px 열(가운데).
import { PageTitle } from '@/ui/common/base/PageTitle'
import subNoticeIcon from '@/assets/images/subNoticeIcon.svg'

// 안내 본문 — 설계서(slide49) 문구 그대로. 안정적 key = 문구 자체(고정 상수).
// 상단 조달업체 사용자 등록 절차 불릿.
const REGISTER_PROCESS_ITEMS = [
  '국방전자조달 입찰 참여 및 기타 업무를 처리하고자 하는 모든 업체는 공인인증기관에서 [공인인증서]를 발급받은 후 나라장터(조달청 G2B)에 업체등록을 한 다음 국방전자조달에서 사용자 등록을 하여야 합니다.',
  '나라장터(조달청 G2B)에서 업체등록을 하고 승인을 받으신 후 1일이 경과하여야 국방전자조달에서 사용자 등록을 하실 수 있습니다.',
] as const

// 등록대상자.
const REGISTER_TARGET_ITEMS = [
  '나라장터에서 업체 등록과 공인인증서를 발급 받은 업체로 전자입찰 참여 및 기타 업무를 처리하고자 하는 업체 사용자',
  '업체 사용자 유형 : 업체대표자, 업체 입찰대리인 및 일반사용자',
] as const

// 등록방법.
const REGISTER_METHOD_ITEMS = [
  '최초 등록 사용자는 업체대표자로 등록되며, 입찰대리인 및 일반사용자는 업체대표자 등록 완료 후 사용자 등록이 가능합니다.',
  '업체대표자 외 입찰대리인 및 일반사용자는 업체대표자의 승인 후 로그인이 가능합니다.',
  '입찰대리인은 먼저 나라장터에 등록하여야 하며, 익일 국방전자조달에 해당정보가 연계된 후 입찰대리인 사용자등록이 가능합니다.',
] as const

// 하단 ※ 유의사항(※ 기호는 렌더에서 20px 열로 분리 — Figma m_list ※ 변형).
const NOTICE_ITEMS = [
  '조달업체 대표사용자는 입찰대리인/일반사용자의 승인 및 사용중단 관리 권한이 부여 됨으로 관리자급에서 등록을 하시기 바랍니다.',
  '입찰서 제출은 업체대표자와 입찰대리인 및 예외처리자만 가능합니다. (외국인대표자 제외)',
] as const

/** 안내 불릿 리스트(Figma m_list) — 20px 박스 안 6px 도트 + gap 4px, 항목 간 4px. */
function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-krds-3">
      {items.map((text) => (
        <li
          key={text}
          className="flex gap-krds-3 text-krds-body-md leading-normal text-krds-text-ink"
        >
          {/* 도트 박스 20px — 첫 줄(line-height 26px)에 세로 중앙 */}
          <span aria-hidden className="flex h-[26px] w-5 shrink-0 items-center justify-center">
            <span className="size-1.5 rounded-full bg-krds-text-ink" />
          </span>
          <span className="min-w-px flex-1 wrap-break-word">{text}</span>
        </li>
      ))}
    </ul>
  )
}

export function UserRegInfoPage() {
  // 셸(AppLayout) 안 화면 — 헤더/스크롤/뒤로가기는 AppLayout 소유. 페이지는 콘텐츠만 렌더.
  return (
    <div className="flex flex-col pb-krds-8">
      {/* 페이지 타이틀 — m_page title_24 (24px Bold, px16/py20) */}
      <PageTitle as="h1">조달업체 사용자 등록</PageTitle>
      <p className="px-krds-8 pb-krds-8 text-krds-body-md leading-normal text-krds-text-ink wrap-break-word">
        조달업체 사용자 등록하기 전 안내사항을 꼭 확인하신 후 등록하여 주시기 바랍니다.
      </p>

      {/* 등록 절차 불릿 + PC버전 전용 강조 — 섹션 p-16, 항목 간 4px */}
      <section className="flex flex-col gap-krds-3 p-krds-8">
        <BulletList items={REGISTER_PROCESS_ITEMS} />

        {/* PC버전 전용 안내(강조) — 14px #db083e. 좌측 sub_notice = Figma 원본 SVG(20px 박스 안 14px). */}
        <div className="flex gap-krds-3">
          <span aria-hidden className="flex h-[21px] w-5 shrink-0 items-center justify-center">
            <img src={subNoticeIcon} alt="" className="size-[14px]" />
          </span>
          <p className="min-w-px flex-1 text-[14px] leading-normal text-krds-badge-red wrap-break-word">
            업체 등록, 사용자 등록은 PC버전에서 가능하며, 모바일에서는 지원하지 않습니다.
          </p>
        </div>
      </section>

      {/* 등록대상자 */}
      <section className="flex flex-col gap-krds-3 p-krds-8">
        <h2 className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">
          등록대상자
        </h2>
        <BulletList items={REGISTER_TARGET_ITEMS} />
      </section>

      {/* 등록방법 */}
      <section className="flex flex-col gap-krds-3 p-krds-8">
        <h2 className="text-krds-body-lg font-bold leading-normal text-krds-text-ink">등록방법</h2>
        <BulletList items={REGISTER_METHOD_ITEMS} />
      </section>

      {/* ※ 유의사항 — 배경 박스 없음 · 17px #425679(text-info) · ※ 20px 열(Figma 10020:82060) */}
      <ul className="flex flex-col gap-krds-3 p-krds-8 text-krds-body-md leading-normal text-krds-text-info">
        {NOTICE_ITEMS.map((text) => (
          <li key={text} className="flex gap-krds-3">
            <span aria-hidden className="w-5 shrink-0 text-center font-medium">
              ※
            </span>
            <span className="min-w-px flex-1 wrap-break-word">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
UserRegInfoPage.displayName = 'UserRegInfoPage'
