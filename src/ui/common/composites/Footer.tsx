// Figma Footer(9300-27758) / m_footer(9300-27759) 1:1.
// 페이지 콘텐츠 하단에 들어가는 일반 블록(고정/sticky 아님). w-full, 360w 세로 스택.
//
// 구조 (위 → 아래):
//   A. 아코디언 "유관기관 바로가기" (접이식, useState 토글)
//      - 상단 1px divider
//      - 헤더: bg-primary-faint, h-56, 19px Bold ink + chevron(ExpandMore, 열림 시 rotate-180)
//      - 펼침 콘텐츠: 관련 사이트 행 5개 (h-56, bg-white, branch 아이콘 + 텍스트 + ArrowForwardIos)
//   B. 콘텐츠 영역 (bg-primary-faint, px-16 py-24 gap-24)
//      1. Logo (<Logo size="footer" />, 196×32)
//      2. 기관 정보 (본청/분청 주소, 대표전화, 팩스)
//      3. SNS 버튼 (instagram/youtube/x/facebook/blog — 40px 원형)
//      4. 1px divider
//      5. 정책 링크 (flex-wrap, 개인정보처리방침 Bold 강조)
//      6. copyright
//
// 아토믹 분리 금지 — 모든 행/버튼/링크는 이 파일 내부 작은 컴포넌트/맵으로 처리.
//
// Props (동적 부분만; 나머지는 Figma 내용 기본값 하드코딩):
//   | prop                 | type                          | 기본값                          |
//   |----------------------|-------------------------------|---------------------------------|
//   | relatedSites         | FooterLink[]                  | 5개(전자조달/방사청/국방/조달/인증) |
//   | snsLinks             | { type; href }[]              | [] (없으면 SNS 영역 미표시)      |
//   | policyLinks          | FooterLink[]                  | 5개(고객지원~모바일앱서비스)      |
//   | defaultAccordionOpen | boolean                       | true                            |
//   | className            | string                        | -                               |
//
// SNS 버튼은 브랜드 SVG(assets/images: instagram/youtube/imgX/facebook/blog)를 SNS_META 로 매핑.
import * as React from 'react'

import { Logo } from '@/ui/common/base/Logo'
import { Icon } from '@/ui/common/base/Icon'
import { SectionDivider } from '@/ui/common/base/SectionDivider'
import { cn } from '@/utils/cn'
import branchIcon from '@/assets/images/branch.svg'
import instagramIcon from '@/assets/images/instagram.svg'
import youtubeIcon from '@/assets/images/youtube.svg'
import xIcon from '@/assets/images/imgX.svg'
import facebookIcon from '@/assets/images/facebook.svg'
import blogIcon from '@/assets/images/blog.svg'

export interface FooterLink {
  label: string
  href?: string
  onClick?: () => void
}

export type FooterSnsType = 'instagram' | 'youtube' | 'x' | 'facebook' | 'blog'

export interface FooterSnsLink {
  type: FooterSnsType
  href: string
}

export interface FooterProps {
  /** 관련 사이트 행. 기본 5개(전자조달시스템(타기관)/방위사업청/국방관련사이트/조달관련사이트/인증센터). */
  relatedSites?: FooterLink[]
  /** SNS 버튼 목록. 비어 있으면 SNS 영역 미표시. */
  snsLinks?: FooterSnsLink[]
  /** 정책 링크. 기본 5개(고객지원/개인정보처리방침/저작권 및 공공데이터 이용정책/보안프로그램/모바일앱서비스). */
  policyLinks?: FooterLink[]
  /** 아코디언 초기 펼침 여부. 기본 true. */
  defaultAccordionOpen?: boolean
  className?: string
}

// --- Figma 기본값 (동적 props 미주입 시 사용) ------------------------------
const DEFAULT_RELATED_SITES: FooterLink[] = [
  { label: '전자조달시스템(타기관)' },
  { label: '방위사업청' },
  { label: '국방관련사이트' },
  { label: '조달관련사이트' },
  { label: '인증센터' },
]

const DEFAULT_POLICY_LINKS: FooterLink[] = [
  { label: '고객지원' },
  { label: '개인정보처리방침' },
  { label: '저작권 및 공공데이터 이용정책' },
  { label: '보안프로그램' },
  { label: '모바일앱서비스' },
]

// 개인정보처리방침은 Figma 상 Bold 강조.
const EMPHASIZED_POLICY = '개인정보처리방침'

// SNS 메타 — 브랜드 SVG 매핑(label = aria-label, icon = 브랜드 SVG).
const SNS_META: Record<FooterSnsType, { label: string; icon: string }> = {
  instagram: { label: '인스타그램', icon: instagramIcon },
  youtube: { label: '유튜브', icon: youtubeIcon },
  x: { label: 'X (트위터)', icon: xIcon },
  facebook: { label: '페이스북', icon: facebookIcon },
  blog: { label: '네이버 블로그', icon: blogIcon },
}

// --- 내부 인라인 컴포넌트 (별도 파일 분리 금지) -----------------------------

/** 관련 사이트 한 행. branch 아이콘은 REGISTRY 미등록이라 작은 점 마커로 대체. */
function RelatedSiteRow({ link }: { link: FooterLink }) {
  const content = (
    <>
      {/* branch 분기 마커 (branch.svg, 12×12) */}
      <img src={branchIcon} alt="" width={12} height={12} aria-hidden className="shrink-0" />
      <span className="flex-1 text-[17px] font-medium leading-snug text-krds-text-ink">
        {link.label}
      </span>
      <Icon
        name="ArrowForwardIos"
        size={20}
        className="shrink-0 text-krds-text-muted"
        aria-hidden
      />
    </>
  )

  const rowClass =
    'flex h-14 w-full items-center gap-2 border-b border-krds-border-divider bg-white px-4 text-left'

  if (link.href) {
    return (
      <a href={link.href} onClick={link.onClick} className={rowClass}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" onClick={link.onClick} className={rowClass}>
      {content}
    </button>
  )
}

/** SNS 원형 버튼. 브랜드 SVG + 정확한 aria-label. */
function SnsButton({ link }: { link: FooterSnsLink }) {
  const meta = SNS_META[link.type]
  return (
    <a
      href={link.href}
      aria-label={meta.label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-krds-border-divider bg-krds-bg-primary-faint text-krds-text-ink"
    >
      <img src={meta.icon} alt="" width={45} height={45} aria-hidden className="shrink-0" />
    </a>
  )
}

/** 정책 링크 한 항목. */
function PolicyLink({ link }: { link: FooterLink }) {
  const emphasized = link.label === EMPHASIZED_POLICY
  const className = cn(
    'text-[17px] leading-snug text-krds-text-ink',
    emphasized ? 'font-bold' : 'font-normal',
  )
  if (link.href) {
    return (
      <a href={link.href} onClick={link.onClick} className={className}>
        {link.label}
      </a>
    )
  }
  return (
    <button type="button" onClick={link.onClick} className={className}>
      {link.label}
    </button>
  )
}

// --- Footer ----------------------------------------------------------------

const Footer = ({
  relatedSites = DEFAULT_RELATED_SITES,
  snsLinks = [],
  policyLinks = DEFAULT_POLICY_LINKS,
  defaultAccordionOpen = true,
  className,
}: FooterProps) => {
  const [accordionOpen, setAccordionOpen] = React.useState(defaultAccordionOpen)

  return (
    <footer className={cn('w-full', className)}>
      {/* A. 아코디언 "유관기관 바로가기" */}
      <SectionDivider />
      <button
        type="button"
        aria-expanded={accordionOpen}
        aria-controls="footer-related-sites"
        onClick={() => setAccordionOpen((v) => !v)}
        className="flex h-14 w-full items-center justify-between bg-krds-bg-primary-faint px-4 text-left"
      >
        <span className="text-[19px] font-bold leading-snug text-krds-text-ink">
          유관기관 바로가기
        </span>
        <Icon
          name="ArrowForwardIos"
          size={24}
          className={cn(
            'shrink-0 rotate-90 text-krds-text-ink transition-transform',
            accordionOpen && 'rotate-[270deg]',
          )}
          aria-hidden
        />
      </button>

      {accordionOpen && (
        <div id="footer-related-sites">
          {relatedSites.map((site, i) => (
            <RelatedSiteRow key={`${site.label}-${i}`} link={site} />
          ))}
        </div>
      )}

      {/* B. 콘텐츠 영역 */}
      <div className="flex flex-col gap-6 bg-krds-bg-primary-faint px-4 py-6">
        {/* 1. 로고 */}
        <Logo size="footer" />

        {/* 2. 기관 정보 */}
        <div className="flex flex-col gap-2 text-[17px] leading-relaxed text-krds-text-ink">
          <p className="break-keep">
            <span className="font-bold">본청</span>
            <br />
            <span className="font-normal">
              (35222)
              <br />
              대전광역시 서구 월평중로 21 방위사업청
            </span>
          </p>
          <p className="break-keep">
            <span className="font-bold">분청</span>
            <br />
            <span className="font-normal">
              (13809)
              <br />
              경기도 과천시 관문로 47 정부과천청사 3동, 4동
            </span>
          </p>
          <p className="break-keep">
            <span className="font-bold">대표전화 1577-1118</span>
            <br />
            <span className="font-normal">
              (고객지원 내선 1번, 평일 : 09:00 ~ 18:00)
            </span>
          </p>
          <p className="font-bold break-keep">팩스 02-773-7587</p>
        </div>

        {/* 3. SNS 버튼 */}
        {snsLinks.length > 0 && (
          <nav aria-label="SNS 바로가기" className="flex flex-wrap gap-2">
            {snsLinks.map((link) => (
              <SnsButton key={link.type} link={link} />
            ))}
          </nav>
        )}

        {/* 4. divider */}
        <SectionDivider />

        {/* 5. 정책 링크 */}
        <nav
          aria-label="정책 및 약관"
          className="flex flex-wrap gap-x-4 gap-y-1"
        >
          {policyLinks.map((link, i) => (
            <PolicyLink key={`${link.label}-${i}`} link={link} />
          ))}
        </nav>

        {/* 6. copyright */}
        <p className="text-[15px] leading-snug text-krds-text-muted break-keep">
          © Defense Acquisition Program Administration. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
Footer.displayName = 'Footer'

export { Footer }
