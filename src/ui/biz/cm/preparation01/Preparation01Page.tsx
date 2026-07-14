// 사전준비사항 — MUI-CM-05-M07. Figma 10020-86138 / 설계서 00.공통 v0.83 slide352·355.
// 이용안내 > 조달사전준비안내 하위의 정적 안내(가이드) 페이지. 데이터가 아닌 고정 안내 문구라
// 목업/API 경계 없음. 번호 카드 3개(인증서 신청/발급·업체등록·사용자 등록) + 업체 추가 정보 등록 블록.
// 색은 전부 KRDS 토큰(#0f316e=action-primary-active·text-primary-active, #c1d1ee=border-field,
// #0054e9=text-primary, #1d1d1d=text-ink). 국방전자조달소개(IntroducePage) 안내 페이지 계열과 동일 컨벤션.
import type { ReactNode } from 'react'

import { Icon } from '@/ui/common/base/Icon'

// ── 로컬 조립물 (도메인 전용 안내 리스트 프리미티브) ─────────────────────────
// 번호 카드 — 번호 뱃지(#0f316e) + 섹션 제목(#0f316e) + 본문. 카드 3개 공용.
function GuideCard({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-field p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-krds-action-primary-active text-[17px] font-bold leading-normal text-white">
          {n}
        </span>
        <span className="text-[19px] font-bold leading-normal text-krds-text-primary-active">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

// 'N.' 시작 항목 — 번호 라벨 + 내용(줄바꿈 시 번호 폭만큼 들여쓰기 유지).
function NumItem({ n, bold, children }: { n: number; bold?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex items-start gap-1 text-[17px] leading-normal text-krds-text-ink ${
        bold ? 'font-bold' : 'font-normal'
      }`}
    >
      <span className="shrink-0 whitespace-nowrap">{n}.</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// '-' 대시 하위 항목 (pl-6 들여쓰기).
function DashItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 pl-6 leading-normal text-krds-text-ink">
      <span className="shrink-0 whitespace-nowrap text-[14px] font-medium">-</span>
      <span className="min-w-px flex-1 self-stretch text-[17px] wrap-break-word">{children}</span>
    </div>
  )
}

// 외부 링크 (pl-9, 새 탭). 발급사업자 홈페이지.
function LinkItem({ href }: { href: string }) {
  return (
    <div className="flex flex-col pl-9">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[17px] leading-normal text-krds-text-primary underline wrap-break-word"
      >
        {href}
      </a>
    </div>
  )
}

// 전화번호 (pl-9). Figma 아이콘 = 어두운 원형 뱃지 안에 흰색 채움 수화기(호출 액션 없음).
function PhoneItem({ tel }: { tel: string }) {
  return (
    <div className="flex items-center gap-1 pl-9">
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-krds-text-ink"
        aria-hidden
      >
        <Icon name="Call" size={12} fill={1} className="text-white" />
      </span>
      <span className="text-[17px] leading-normal text-krds-text-ink">{tel}</span>
    </div>
  )
}

// 채움 원형 불릿 항목 (업체 추가 정보 등록 블록 전용).
function BulletItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-krds-text-ink" aria-hidden />
      <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {children}
      </span>
    </div>
  )
}

// ── 인증서 발급사업자 (Figma 순서·값 그대로) ─────────────────────────────────
const CERT_ISSUERS: { name: string; url: string; tel: string }[] = [
  { name: '한국정보인증(주)', url: 'http://www.d2b.signra.com', tel: '1566-0566' },
  { name: '한국전자인증(주)', url: 'http://www.crosscert.com', tel: '1566-0566' },
  { name: '금융결제원', url: 'http://www.yessign.or.kr', tel: '1577-5500' },
  { name: 'Tradesign', url: 'http://www.tradesign.net', tel: '1577-5500' },
  { name: '한국정보인증(주)', url: 'http://www.signkorea.com', tel: '1577-7337' },
]

export function Preparation01Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 블록 A — 번호 카드 3개 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 1. 인증서 신청/발급 */}
        <GuideCard n={1} title="인증서 신청/발급">
          <NumItem n={1}>
            국방전자조달시스템 서비스 이용을 위해서는 공동인증서 발급사업자에서 발급하는 사업자
            범용인증서가 반드시 필요합니다.
          </NumItem>
          <div className="flex flex-col gap-1">
            <NumItem n={2}>공동인증서 발급사업자</NumItem>
            {CERT_ISSUERS.map((issuer) => (
              <div key={`${issuer.name}-${issuer.url}`} className="flex flex-col gap-1">
                <DashItem>{issuer.name}</DashItem>
                <LinkItem href={issuer.url} />
                <PhoneItem tel={issuer.tel} />
              </div>
            ))}
          </div>
        </GuideCard>

        {/* 2. 업체등록 */}
        <GuideCard n={2} title="업체등록">
          <div className="flex flex-col gap-1">
            <NumItem n={1}>나라장터 국가종합전자조달 (www.g2b.go.kr) 에 업체 등록을 해야합니다.</NumItem>
            <DashItem>등록 대상업체 : 내자업체, 시설업체, 국내상사 (무역대리점)</DashItem>
            <DashItem>
              등록방법 : 인터넷으로 국가종합전자조달(www.g2b.go.kr)에 접속하여 등록을 신청하면 됩니다.
            </DashItem>
            <DashItem>
              유의사항 : 업체등록 승인일 다음날 국방전자조달시스템에 전송되므로 마감일 3일전까지
              업체등록 및 승인을 마쳐야 합니다.
            </DashItem>
          </div>
          <div className="flex flex-col gap-1">
            <NumItem n={2}>문의 전화번호</NumItem>
            <DashItem>나라장터 국가종합전자조달 콜센터 : 1588-0800</DashItem>
          </div>
        </GuideCard>

        {/* 3. 사용자 등록 */}
        <GuideCard n={3} title="사용자 등록">
          <div className="flex flex-col gap-1">
            <NumItem n={1}>등록 대상자</NumItem>
            <DashItem>전자입찰, 전자계약, 대금청구등 국방조달업무 이용자</DashItem>
          </div>
          <div className="flex flex-col gap-1">
            <NumItem n={2}>등록 방법</NumItem>
            <DashItem>대표자 : 나라장터 국가종합전자조달에 대표자 등록 후 사용자 등록</DashItem>
            <DashItem>
              입찰대리인 : 나라장터 국가종합전자조달에 입찰대리인 등록 후 사용자 등록 후 대표자승인
            </DashItem>
            <DashItem>일반사용자 : 사용자 등록 후 대표자 승인</DashItem>
          </div>
        </GuideCard>
      </div>

      {/* 블록 B — 업체 추가 정보 등록 (카드 아님) */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">업체 추가 정보 등록</p>
        <div className="flex flex-col gap-1">
          <NumItem n={1} bold>
            나라장터 국가종합전자조달에 업체등록 후 국방전자조달시스템에서 업체정보를 확인하고, 필요한
            추가정보를 반드시 등록해야 합니다.
          </NumItem>
          <BulletItem>
            나라장터 국가종합전자조달에 등록한 업체정보는 다음날 국방전자조달시스템에 전송되므로
            업체정보 확인 및 추가정보 등록이 가능합니다.
          </BulletItem>
          <BulletItem>
            원활한 국방전자조달시스템 이용을 위해서는 마감 3일전까지 업체등록 및 추가정보 등록을 마쳐야
            합니다.
          </BulletItem>
          <BulletItem>국방전자조달시스템에 등록할 추가 정보(예시)</BulletItem>
          <DashItem>국내조달업체 : 품목코드 등재 등</DashItem>
          <DashItem>국외조달(무역대리점) : 해외 관련 업체 등</DashItem>
        </div>
      </div>
    </div>
  )
}
Preparation01Page.displayName = 'Preparation01Page'
