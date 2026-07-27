// 청렴계약제 — MUI-CM-05-M08. Figma 개인용-260723 10020-86224 / 설계서 00.공통 v0.84 slide369.
// 이용안내 > 국내조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 상단 인용 인포박스(bg-blue-pastel + text-info 19 Bold 중앙) + 섹션(개요·적용대상·시행일자·내용·제출요령).
// 리스트는 Figma m_list 1:1 — 불릿 슬롯 20px + gap 4px(들여쓰기 24px), 대시 pl-[24px].
// [[cm-preparation01-m07]] 안내 페이지 계열(Domestic01/Foreign01)과 동일 컨벤션 — 프리미티브는 페이지 소유.
import type { ReactNode } from 'react'

// 섹션 타이틀 (19 Bold ink).
function SecTitle({ children }: { children: ReactNode }) {
  return <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{children}</p>
}

// ● 불릿 항목 — Figma m_list: 20px 불릿 슬롯 + 4px gap, 본문 17 Regular ink.
function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1">
      <span className="flex h-[26px] w-5 shrink-0 items-center justify-center" aria-hidden>
        <span className="size-1.5 rounded-full bg-krds-text-ink" />
      </span>
      <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {children}
      </span>
    </div>
  )
}

// - 대시 하위 항목 — Figma m_list(pl-24px): "-" 14 Medium + 4px gap, 본문 17 Regular.
function Dash({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 pl-6">
      <span className="shrink-0 whitespace-nowrap text-[14px] font-medium leading-normal text-krds-text-ink">
        -
      </span>
      <span className="min-w-px flex-1 self-stretch text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {children}
      </span>
    </div>
  )
}

// 섹션 래퍼 — Figma 섹션 프레임 p-16 + 타이틀·본문 gap 4px.
function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1 p-4">
      <SecTitle>{title}</SecTitle>
      {children}
    </div>
  )
}

export function Preparation02Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 인용 인포박스 — bg-blue-pastel(#f5f9ff) + text-info(#425679) 19 Bold 중앙 */}
      <div className="p-4">
        <div className="flex flex-col items-center justify-center rounded-[12px] bg-krds-bg-blue-pastel p-4">
          {/* 줄바꿈은 Figma 원본의 명시적 3줄 그대로 */}
          <p className="whitespace-pre-line text-center text-[19px] font-bold leading-normal text-krds-text-info wrap-break-word">
            {'"부패없는 투명한 행정" 과 사회발전,\n국가경쟁력에 관건됨을 인식\n"유리처럼 맑고 깨끗한 조달행정" 구현을 위해 계약제를 시행합니다.'}
          </p>
        </div>
      </div>

      <Section title="개요">
        <Bullet>
          방위사업청에서는 부패없는 투명한 행정 이 사회발전과 국가경쟁력에 중요한 관건이됨을 깊이
          인식하여 유리알처럼 맑고 깨끗한 조달행정 을 구현하고자 방위사업청에서 발주하는 모든 물품 ·
          용역에 대하여 청렴계약제를 시행합니다.
        </Bullet>
      </Section>

      <Section title="적용대상">
        <Bullet>방위사업청에서 발주하는 모든 물품 · 용역 · 구매의 계약에 적용됩니다.</Bullet>
      </Section>

      <Section title="시행일자">
        <Bullet>2002. 01. 01 이후 입찰공고 및 수의시담시부터 적용합니다.</Bullet>
      </Section>

      <Section title="내용">
        <Bullet>
          방위사업청에서 물품 · 용역 · 구매에 적용되는 청렴계약 이행 특수조건 및 청렴계약 이행
          서약서는 국방전자조달 인터넷 홈페이지에 게재되어 있습니다.
        </Bullet>
      </Section>

      <Section title="청렴계약 이행서약서 제출요령">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Bullet>청렴계약 이행 서약서는 다음과 같이 제출합니다.</Bullet>
            <Dash>신규업체 : 업체 등재신청시 1회 제출</Dash>
          </div>
          <Bullet>
            조달원 기재사항 변경 신청시 제출 청렴계약 이행서약서는 국방전자조달 홈페이지에서
            다운받거나 상담실에 비치된 서식을 사용하실 수 있습니다.
          </Bullet>
        </div>
      </Section>
    </div>
  )
}
Preparation02Page.displayName = 'Preparation02Page'
