// 관련시스템 — MUI-CM-05-M05. Figma 10020-85863 / 설계서 00.공통 v0.83 slide350.
// 국방통합원가시스템·국방표준종합정보시스템 소개 + 시스템 관계 + 사용자 등록 안내(불릿 섹션). 정보 안내 화면(검색·설문 없음).
import type { ReactNode } from 'react'

// 외부 시스템 링크(도메인 주소).
function LinkText({ label, href }: { label: string; href: string }) {
  return (
    <>
      {label}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-krds-text-primary underline"
      >
        {href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </a>
    </>
  )
}

interface BulletItem {
  node: ReactNode
  /** 하위 항목(대시 마커 + 들여쓰기). 기본 false(불릿 점). */
  sub?: boolean
}

const SECTIONS: { title: string; items: BulletItem[] }[] = [
  {
    title: '국방통합원가시스템이란?',
    items: [
      {
        node: '국방통합원가시스템은 이전 산정 위주의 원가업무 체계에서 드러난 여러 문제점(원가 부풀리기, 과다계상 등)을 해결 하고자 검증 위주로 개편된 원가 업무를 지원하기 위해 새롭게 구축된 시스템 입니다.',
      },
      { node: '서비스 개통 : 2012. 4. 2' },
      { node: '접속방법 : 국방전자조달시스템 - 국방통합원가 (주메뉴)' },
      { node: <LinkText label="도메인 주소 : " href="https://dics.d2b.go.kr/" /> },
    ],
  },
  {
    title: '국방표준종합정보시스템이란?',
    items: [
      {
        node: '국방표준종합정보시스템은 노후화된 기존 목록/규격체계를 대체하는 신규 시스템으로 군수품 획득, 운영유지 전(全) 단계의 표준화 업무를 지원하는 규격 및 목록 관리, 부품/단종 관리, BOM(Bill of Material)체계 관리 시스템입니다.',
      },
      { node: '서비스 개통 : 2013. 4. 1' },
      { node: '접속방법 : 국방전자조달시스템 - 국방표준종합 (주메뉴)' },
      { node: <LinkText label="도메인 주소 : " href="http://kdsis.dapa.go.kr/" /> },
    ],
  },
  {
    title: '국방전자조달시스템과 국방통합원가시스템, 국방표준종합정보시스템',
    items: [
      {
        node: '기존의 원가/규격, 목록 시스템은 국방전자조달시스템의 조달업무체계의 하나로 포함되어 있었으나, 각 업무 분야에 특화된 시스템이 새롭게 구축되어 별도의 체계로 서비스 중에 있습니다.',
      },
      {
        node: '국방통합원가시스템과 국방표준종합정보시스템은 국방전자조달시스템과는 별도로 개발·운영 중인 시스템이지만 국방전자조달시스템과 주 도메인 및 관련 정보가 연계되어 있으며, 조달업무의 전체 흐름과 사용자 편의성 등을 고려하여 국방전자조달 시스템의 메인화면 - 주메뉴에서 접속하도록 구성되어 있습니다.',
      },
    ],
  },
  {
    title: '시스템 사용자 등록',
    items: [
      {
        node: "국방통합원가시스템과 국방표준종합정보시스템을 이용하시기 위해서는 먼저 국방전자조달시스템에 사용자 등록이 되어있어야 합니다.\n(국방전자조달시스템 메인화면 우측 상단의 '사용자 등록' 선택)",
      },
      {
        node: '국방전자조달시스템과는 달리 국방통합원가시스템과 국방표준종합정보시스템은 보안에 민감한 자료들을 처리하기 때문에 사전에 VPN 신청 및 승인절차를 거쳐야 시스템을 이용하실 수 있습니다.',
      },
      {
        sub: true,
        node: "VPN(Virtual Private Network) : '가상사설망'. 인터넷망과 같은 공중망을 사설망과 같이 사용할 수 있게 해주는 통신서비스로 VPN 장비를 통해 해당 업체과 방사청 간에 보안성 높은 회선을 확보할 수 있는 장점을 지닙니다.",
      },
      {
        node: "자세한 VPN 신청 및 시스템 이용 방법은 국방전자조달시스템 상단의 '국방표준종합' 과 '국방통합원가' 메뉴를 클릭하여 표시되는 안내창을 참조하시기 바랍니다.",
      },
    ],
  },
]

function BulletSection({ title, items }: { title: string; items: BulletItem[] }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map((it, i) =>
          it.sub ? (
            // 하위 항목 — 대시(-) 마커 + 들여쓰기
            <li
              key={i}
              className="flex gap-1 whitespace-pre-line pl-6 text-[17px] leading-normal text-krds-text-ink"
            >
              <span className="shrink-0 text-[14px]">-</span>
              <span className="min-w-px flex-1 wrap-break-word">{it.node}</span>
            </li>
          ) : (
            <li
              key={i}
              className="flex gap-1 whitespace-pre-line text-[17px] leading-normal text-krds-text-ink"
            >
              <span
                aria-hidden
                className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-ink"
              />
              <span className="min-w-px flex-1 wrap-break-word">{it.node}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

export function SystemPage() {
  return (
    <div className="flex w-full flex-col">
      {SECTIONS.map((s) => (
        <BulletSection key={s.title} title={s.title} items={s.items} />
      ))}
    </div>
  )
}
SystemPage.displayName = 'SystemPage'
