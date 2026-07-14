// 국방조달참여절차 — MUI-CM-05-M09. Figma 10020-86472 / 설계서 00.공통 v0.83 slide352·357.
// 이용안내 > 국내조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 상단 절차 다이어그램(플로우차트) + 방법 섹션(1~5 번호 헤더 + ● 불릿/대시 리스트 + 안내 Infobox).
// 색은 전부 KRDS 토큰(#0f316e=action-primary-active·text-primary-active, #c1d1ee=border-field,
//   #ecf1fa=bg-primary-faint, #0054e9=text-primary, #1d1d1d=text-ink). 일회성 다이어그램 노란색만 arbitrary(#ffe567).
// ⚠️ 인증사업자 카드의 브랜드 로고는 레포에 에셋이 없어 생략(회사명/전화/링크만). 에셋 확보 후 추가 예정.
// [[cm-preparation01-m07]] 안내 페이지 계열과 동일 컨벤션(IntroducePage 참고).
import type { ReactNode } from 'react'

import { Icon } from '@/ui/common/base/Icon'
import { Infobox } from '@/ui/common/composites/Infobox'
// 인증사업자 로고 — Figma 10020-86472 에셋 추출(폐쇄망 대응: 레포에 정적 커밋).
import logoTradesign from '@/assets/images/cert/tradesign.png'
import logoCrosscert from '@/assets/images/cert/crosscert.png'
import logoSigngate from '@/assets/images/cert/signgate.png'
import logoSignkorea from '@/assets/images/cert/signkorea.png'
import logoYessign from '@/assets/images/cert/yessign.png'

// ── 공통 인라인 요소 ─────────────────────────────────────────────────────────
// 외부 URL 링크 (blue underline, 새 탭). label 이 표시 문자열, href 는 http:// 접두.
function Lnk({ url }: { url: string }) {
  return (
    <a
      href={`http://${url}`}
      target="_blank"
      rel="noreferrer"
      className="text-krds-text-primary underline wrap-break-word"
    >
      {url}
    </a>
  )
}

// 전화 뱃지 — 어두운 원형 + 흰색 채움 수화기(사전준비사항 PhoneItem 과 동일).
function PhoneBadge() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-krds-text-ink"
      aria-hidden
    >
      <Icon name="Call" size={12} fill={1} className="text-white" />
    </span>
  )
}

// 외부링크 표시용 open_in_new 아이콘.
function ExtIcon() {
  return <Icon name="OpenInNew" size={16} className="shrink-0 text-krds-text-primary" aria-hidden />
}

// ── 섹션 타이틀 / 번호 헤더 ───────────────────────────────────────────────────
function SecTitle({ children }: { children: ReactNode }) {
  return <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{children}</p>
}

function NumTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] font-bold leading-normal text-krds-text-ink">
      <span className="shrink-0 whitespace-nowrap">{n}.</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// ── 리스트 아이템 모델 (문서 순서 + level 기반 들여쓰기) ───────────────────────
type Item =
  | { k: 'b'; t: ReactNode; reg?: boolean } // ● 채움 불릿(기본 Bold, reg=Regular)
  | { k: 'p'; n: number; t: ReactNode } // (N) 괄호 번호 스텝(Bold) — 설계서 SEC5 진행순서
  | { k: 'd'; t: ReactNode; lv?: 1 | 2 } // - 대시(하위)
  | { k: 'n'; t: ReactNode; tone?: 'red' | 'gray' } // 결론(red) / 캐비엇(gray) 노트
  | { k: 'box'; title: ReactNode; items: ReactNode[] } // 안내 Infobox(static)

// ● 채움 불릿 — Figma 기준 기본 Bold, reg=true 면 Regular(설계서 SEC4 등).
function Bullet({ t, reg }: { t: ReactNode; reg?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-krds-text-ink" aria-hidden />
      <span
        className={`min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word ${
          reg ? '' : 'font-bold'
        }`}
      >
        {t}
      </span>
    </div>
  )
}

// (N) 괄호 번호 스텝 — Bold, "(n)" 마커(불릿 없음). 설계서 SEC5 전자입찰 진행순서.
function ParenStep({ n, t }: { n: number; t: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] font-bold leading-normal text-krds-text-ink">
      <span className="shrink-0 whitespace-nowrap">({n})</span>
      <span className="min-w-px flex-1 wrap-break-word">{t}</span>
    </div>
  )
}

// - 대시 (level 1 = pl-6, level 2 = pl-12)
function Dash({ t, lv = 1 }: { t: ReactNode; lv?: 1 | 2 }) {
  return (
    <div className={`flex items-start gap-1 ${lv === 2 ? 'pl-12' : 'pl-6'}`}>
      <span className="shrink-0 whitespace-nowrap text-[14px] font-medium leading-normal text-krds-text-ink">
        -
      </span>
      <span className="min-w-px flex-1 self-stretch text-[17px] leading-normal text-krds-text-ink wrap-break-word">
        {t}
      </span>
    </div>
  )
}

// Figma 'sub_notice' 아이콘 (안내 노트 마커 — 손가락 포인터). Figma 원본 SVG path 그대로,
// fill=currentColor 로 두어 text-* 클래스로 색을 제어(red 결론 / gray 캐비엇 공용).
function SubNoticeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M9.95331 14.1825L7.66331 16.4725C7.37581 16.7599 7.02081 16.9036 6.59831 16.9036C6.17581 16.9036 5.82088 16.7599 5.53352 16.4725L3.53997 14.479C3.25247 14.1916 3.10872 13.8345 3.10872 13.4077C3.10872 12.9809 3.25247 12.6238 3.53997 12.3363L5.81706 10.0671V7.67461C5.81706 7.39044 5.94713 7.19627 6.20727 7.09211C6.4674 6.98794 6.6974 7.03572 6.89726 7.23544L12.7771 13.1023C12.9768 13.3022 13.0224 13.5322 12.9139 13.7923C12.8055 14.0525 12.6091 14.1825 12.325 14.1825H9.95331ZM14.0366 5.94211C13.2225 5.12808 12.2633 4.60697 11.1591 4.37877C10.055 4.15072 8.97511 4.23377 7.91956 4.62794C7.75942 4.68141 7.59574 4.68197 7.42852 4.62961C7.26129 4.57725 7.15095 4.47093 7.09747 4.31065C7.03553 4.13343 7.04386 3.9612 7.12247 3.79398C7.20095 3.62676 7.3315 3.51218 7.51414 3.45023C8.79733 2.9769 10.1058 2.87752 11.4396 3.15211C12.7734 3.42669 13.9362 4.05968 14.9277 5.05107C15.9191 6.04259 16.5507 7.21301 16.8227 8.56232C17.0945 9.91162 16.9895 11.2321 16.5077 12.5238C16.4457 12.6979 16.3304 12.8222 16.1616 12.8965C15.9928 12.9707 15.8239 12.9725 15.6552 12.9021C15.4949 12.8402 15.3886 12.7263 15.3362 12.5607C15.2839 12.3951 15.2887 12.2279 15.3508 12.0592C15.745 11.0036 15.828 9.92377 15.6 8.81961C15.3718 7.71544 14.8507 6.75627 14.0366 5.94211ZM12.7577 7.24982C13.0739 7.56607 13.3189 7.92586 13.4925 8.32919C13.6661 8.73252 13.7743 9.15745 13.8171 9.60398C13.8341 9.77273 13.785 9.91482 13.6696 10.0302C13.5543 10.1456 13.408 10.2034 13.2306 10.2034C13.0617 10.2034 12.9175 10.1443 12.7979 10.0263C12.6782 9.90822 12.6012 9.76482 12.5671 9.59607C12.5276 9.32676 12.4534 9.06711 12.3443 8.81711C12.2353 8.56711 12.0804 8.34169 11.8796 8.14086C11.6787 7.94002 11.4504 7.77947 11.1946 7.65919C10.9386 7.53905 10.6717 7.4619 10.3939 7.42773C10.2252 7.39357 10.0783 7.32009 9.95331 7.20732C9.82831 7.09468 9.75456 6.94968 9.73206 6.77232C9.7097 6.60343 9.75407 6.45572 9.86518 6.32919C9.97629 6.20252 10.112 6.14773 10.2723 6.16482C10.7413 6.19912 11.1916 6.30732 11.6231 6.4894C12.0548 6.67162 12.433 6.92509 12.7577 7.24982Z"
      />
    </svg>
  )
}

// 결론/캐비엇 노트 — 마커는 Figma sub_notice 아이콘. 색은 Figma 일회성 accent(토큰 없음):
//   결론 강조("이 단계까지…"/마감 안내) = #db083e(red, 좌측 정렬) · 캐비엇("단, …") = #717171(gray, pl-6).
function Note({ t, tone = 'red' }: { t: ReactNode; tone?: 'red' | 'gray' }) {
  const gray = tone === 'gray'
  return (
    <div className={`flex items-start gap-1 ${gray ? 'pl-6' : ''}`}>
      <SubNoticeIcon
        className={`mt-px size-5 shrink-0 ${gray ? 'text-[#717171]' : 'text-[#db083e]'}`}
      />
      <span
        className={`min-w-px flex-1 text-[14px] leading-normal wrap-break-word ${
          gray ? 'text-[#717171]' : 'text-[#db083e]'
        }`}
      >
        {t}
      </span>
    </div>
  )
}

function renderItems(items: Item[]) {
  return items.map((it, i) => {
    switch (it.k) {
      case 'b':
        return <Bullet key={i} t={it.t} reg={it.reg} />
      case 'p':
        return <ParenStep key={i} n={it.n} t={it.t} />
      case 'd':
        return <Dash key={i} t={it.t} lv={it.lv} />
      case 'n':
        return <Note key={i} t={it.t} tone={it.tone} />
      case 'box':
        return (
          <div key={i} className="py-1">
            <Infobox title={it.title} collapsible={false} items={it.items} />
          </div>
        )
      default:
        return null
    }
  })
}

// ── 절차 다이어그램 (Figma 10020-86474) ───────────────────────────────────────
// 카드1·2(뱃지+타이틀) → 분기(중앙조달/부대조달·시설공사 노란 pill + 연결선) → 입찰참가(네이비, folder).
function FlowBadge({ n }: { n: number }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-krds-action-primary-active text-[17px] font-bold text-white">
      {n}
    </span>
  )
}

function FlowCard({ n, title, url }: { n: number; title: string; url?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[8px] border border-krds-border-tertiary px-4 pb-4 pt-[14px]">
      <FlowBadge n={n} />
      <p className="text-[17px] font-bold leading-normal text-krds-text-ink">{title}</p>
      {url ? (
        <a
          href={`http://${url}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[17px] leading-normal text-krds-text-primary underline"
        >
          {url}
          <ExtIcon />
        </a>
      ) : null}
    </div>
  )
}

// 노란 pill 라벨.
function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[16px] bg-[#ffe567] px-[14px] py-1.5 text-center text-[14px] font-bold leading-tight text-krds-text-primary-active">
      {children}
    </span>
  )
}

// 세로 연결선 + 아래 화살표.
function DownArrow() {
  return (
    <div className="flex flex-col items-center">
      <span className="h-3 w-0.5 bg-krds-text-primary-active" />
      <Icon name="ExpandMore" size={20} className="-mt-1 text-krds-text-primary-active" aria-hidden />
    </div>
  )
}

function ProcedureFlow() {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-krds-border-field p-6">
      <FlowCard n={1} title="조달청 나라장터 업체등록" url="www.g2b.go.kr" />
      <FlowCard n={2} title="국방 전자조달 사용자등록" />

      {/* 분기 — 좌: 중앙조달(품목등록) · 우: 부대조달, 시설공사. items-stretch 로 우측 연결선이 좌측 높이만큼 늘어남 */}
      <div className="flex items-stretch justify-center gap-4">
        {/* 좌 */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <DownArrow />
          <Pill>중앙조달</Pill>
          <DownArrow />
          {/* 품목등록 박스 — Figma 일회성 accent 색 #d3e1fb(토큰 없음) */}
          <div className="flex w-full flex-col items-center rounded-[8px] bg-[#d3e1fb] p-4 text-center">
            <span className="text-[15px] font-bold text-krds-text-primary-active">품목등록</span>
            <span className="text-[13px] text-krds-text-primary-active">(3년주기 갱신등록)</span>
          </div>
          <DownArrow />
          <Pill>중앙조달</Pill>
          <DownArrow />
        </div>
        {/* 우 */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <DownArrow />
          <Pill>부대조달, 시설공사</Pill>
          <span className="w-0.5 flex-1 bg-krds-text-primary-active" />
          <Icon name="ExpandMore" size={20} className="-mt-1 text-krds-text-primary-active" aria-hidden />
        </div>
      </div>

      {/* 입찰참가 목표 박스 — 네이비 배경 + 흰 원 안에 네이비 folder */}
      <div className="flex flex-col items-center gap-2 rounded-[12px] bg-krds-action-primary-active p-4">
        <span className="flex size-[46px] items-center justify-center rounded-full bg-white" aria-hidden>
          <Icon name="Folder" size={28} fill={1} className="text-krds-action-primary-active" />
        </span>
        <span className="text-[19px] font-bold text-white">입찰참가</span>
      </div>
    </div>
  )
}

// ── 인증사업자 카드 (로고 생략 — 회사명/전화/링크) ────────────────────────────
interface CertProvider {
  name: string
  tel: string
  url: string
  logo: string
}
const CERT_PROVIDERS: CertProvider[] = [
  { name: '한국무역정보통신', tel: '1566-2119', url: 'www.tradesign.net', logo: logoTradesign },
  { name: '한국전자인증', tel: '1566-0566', url: 'www.crosscert.com', logo: logoCrosscert },
  { name: '한국정보인증', tel: '1577-8787', url: 'www.signgate.com', logo: logoSigngate },
  { name: '(주)코스콤 인증센터', tel: '1577-7337', url: 'www.signkorea.com', logo: logoSignkorea },
  { name: '금융결재원 전자인증센터', tel: '1577-5500', url: 'www.yessign.or.kr', logo: logoYessign },
]

function CertCard({ provider }: { provider: CertProvider }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[12px] border border-krds-border-field p-4 text-center">
      <div className="flex h-[46px] w-full items-center justify-center">
        <img src={provider.logo} alt={provider.name} className="max-h-10 w-auto object-contain" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-[17px] text-krds-text-ink">{provider.name}</span>
        <span className="flex items-center gap-0.5">
          <PhoneBadge />
          <span className="text-[17px] text-krds-text-ink">{provider.tel}</span>
        </span>
      </div>
      <a
        href={`http://${provider.url}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-[17px] text-krds-text-primary underline"
      >
        {provider.url}
        <ExtIcon />
      </a>
    </div>
  )
}

// ── 방법: 섹션 3·4·5 리스트 콘텐츠 (Figma 1:1) ───────────────────────────────
const SEC3_ITEMS: Item[] = [
  { k: 'b', t: '입찰 전에 해당품목에 대한 품목등록을 완료하셔야 합니다.' },
  { k: 'b', t: '품목등록 신청 절차' },
  { k: 'd', t: '국방전자조달 > 마이페이지 > 업체정보관리 > 업체정보 추가등록 > 물품(내자) 탭 클릭> 화면 중간 등록품목명세' },
  { k: 'd', t: '신규 품목 등록 시 : 추가버튼 > 품류 및 품명 조회하여 등록희망품목 검색 > 등록희망품목 앞 선택박스 체크 후 확인버튼 클릭(복수선택가능) > 화면 하단의 신청버튼 클릭' },
  { k: 'd', t: '갱신 품목 등록 시(만료 전 90일부터 갱신 가능) : 갱신희망품목 정보 확인 > 갱신희망품목 선택박스 체크 후 > 갱신버튼 클릭 > 화면 하단의 신청버튼' },
  { k: 'b', t: '품목등록 신청 후 제출서류' },
  { k: 'd', t: '제조품목의 경우 : 공장등록증명서(발행일 3개월 이내일 것) 1부.' },
  { k: 'n', tone: 'gray', t: '단, 행정정보공동이용에서 확인 가능한 경우 생략가능(민원인 동의 필요)' },
  { k: 'd', t: '판매품목의 경우 : 사업자등록증명원(발행일 3개월 이내일 것) 1부.' },
  { k: 'n', tone: 'gray', t: '단, 행정정보공동이용에 확인 가능한 경우 생략가능(민원인 동의 필요)' },
  { k: 'd', t: '관련 법률에 따라 정부 인.허가, 신고가 필요한 품목의 경우 해당 인.허가 신고증을 FAX로제출' },
  { k: 'd', t: '제출 및 문의' },
  { k: 'd', lv: 2, t: '팩스번호 : 02)773-7587, 수신자 : 계약제도발전과 조달원등록 담당(반드시 기재)' },
  { k: 'd', lv: 2, t: '품목등록 신청 관련 문의전화: (02)2079-6915,6925' },
  { k: 'n', t: '이 단계까지 완료하셔야만 중앙조달(방위사업청) 입찰에 참여할 수 있습니다.' },
]

const SEC4_ITEMS: Item[] = [
  {
    k: 'b',
    reg: true,
    t: (
      <>
        업체정보(대표자 주소 등) 변경사항이 있는 경우 나라장터(<Lnk url="www.g2b.go.kr" />) 에 변경
        요청하여 승인 처리되면 다음 날 국방전자조달에 자동 반영됨.
      </>
    ),
  },
  {
    k: 'b',
    reg: true,
    t: (
      <>
        품목등록은 나라장터(<Lnk url="www.g2b.go.kr" />)와 국방전자조달 자료가 공유되지 않으므로 각
        기관에 각각 등록해야 함 (기관별 별도 관리 되고 있음)
      </>
    ),
  },
]

// 입찰참가신청 진행상태 8종 (Infobox 본문) — 설계서 문구 그대로("학인" 등 원문 유지).
const BID_STATES: ReactNode[] = [
  '미 신청 : [입찰참가신청서 작성] 버튼을 눌러 입찰참가신청서를 작성할 수 있습니다.',
  '신청/심사중 : 입찰참가신청서를 제출한 상태입니다. 발주기관에서 심사를 할 때까지 기다리셔야 합니다. (등록확정처리는 발주기관으로 문의 부탁드립니다.)',
  '반려 : 입찰참가신청서 제출 후 조달업체에서 반려한 상태입니다. 입찰참가신청서를 작성하시려면 입찰참가신청서 작성버튼을 클릭하세요.',
  '등록불가 : [입찰등록결과 조회] 버튼을 눌러 불가사유를 학인 후 입찰참가신청서를 다시 수정 작성하여 제출할 수 있습니다.',
  '등록확정 : 좌측의 입찰서 제출 메뉴에서 입찰서를 제출하실 수 있습니다.',
  '사후심사/투찰가능 : 좌측의 입찰서 제출 메뉴에서 입찰서를 작성할 수 있으며, 등록심사는 입찰서 제출마감 후 진행하며, 탈락 시 개찰대상에서 제외됩니다.',
  '미동의 : 구성업체가 공동수급협정서에 동의를 하지 않았습니다.(구성업체는 입찰참가신청 메뉴에서 입찰참가신청서 조회화면에서 동의하시면 됩니다.)',
  '동의완료 : 구성업체가 모두 동의한 상태입니다. [입찰참가신청서 조회/반려] 버튼을 눌러 협정서제출 버튼을 클릭하세요.',
]

const LATE_NOTE =
  '입찰참가신청서 등록마감일, 입찰서 투찰마감일 당일은 사용자가 많아 처리속도가 지연되어, 마감시간 이전에 제출을 못하는 경우가 발생하오니, 미리(1일전에) 제출바랍니다.'

// 입찰결과 확인 안내 Infobox 본문(설계서: 경쟁입찰 2항목 / 공개수의 1항목).
const BID_RESULT_ITEMS_COMPET: ReactNode[] = [
  '[입찰 > 입찰결과] 메뉴를 선택하면 입찰결과 목록 조회할 수 있습니다.',
  '적격심사제인 입찰 건은 업체별 투찰금액 및 적격심사순위만 공개하고, 추후 적격심사가 완료되면 최종낙찰업체를 공개합니다.',
]
const BID_RESULT_ITEMS_OPEN: ReactNode[] = [
  '[입찰 > 입찰결과 ] 메뉴를 선택하면 입찰결과 목록 조회할 수 있습니다.',
]

const SEC5_ITEMS: Item[] = [
  // 전자입찰 진행순서(경쟁입찰) — 스텝은 (1)~(5) 괄호번호, 마지막 '입찰결과 확인'은 안내 Infobox(번호 없음)
  { k: 'b', t: '전자입찰 진행순서(경쟁입찰)' },
  { k: 'd', t: '사용자 로그인 > 입찰공고 확인 > 입찰참가신청서 작성 제출 > 입찰서 작성 제출 > 입찰실시 및 입찰결과 확인' },
  { k: 'p', n: 1, t: '사용자 로그인' },
  { k: 'd', t: '국방전자조달에 접속하여 화면 오른쪽 위에 로그인 버튼으로 로그인 합니다.' },
  { k: 'p', n: 2, t: '입찰공고 확인' },
  { k: 'd', t: '[입찰 > 입찰공고] 메뉴를 선택하면 입찰공고 목록을 조회하실 수 있습니다.' },
  { k: 'd', t: '입찰공고 목록을 클릭하여 공고 세부내역을 확인합니다.' },
  { k: 'p', n: 3, t: '입찰참가신청서 작성 제출' },
  { k: 'd', t: "공고 세부내역에서 화면 하단의 '입찰참가신청서 작성' 버튼을 클릭하고 신청서를 작성 후 제출합니다." },
  {
    k: 'box',
    title: '입찰참가신청서 작성시 유의사항',
    items: [
      "입찰보증금은 투찰금액의 '5%이상' 을 입력합니다.",
      "품목별 단가제의 경우에는 '투찰금액(수량 X 투찰단가)' 의 5%이상을 입력합니다.",
    ],
  },
  {
    k: 'box',
    title: '전자보증서 제출방법',
    items: [
      "입찰참가신청서 제출 전에 [입찰공고목록]에서 'G2B공고번호'를 전자보증서 발급회사에 통보하여 입찰자 명의의 전자보증서 발급을 청약합니다.",
      '전자보증서 발급회사는 전자보증서를 전산망으로 전송하며, 약 15분 후에 국방전자조달(서버)에 도착합니다.',
    ],
  },
  {
    k: 'box',
    title: '입찰참가신청 진행상태 설명 [마이페이지 > 나의 진행업무 > 입찰참가신청 화면]',
    items: BID_STATES,
  },
  { k: 'p', n: 4, t: '투찰' },
  { k: 'd', t: '[입찰 > 입찰진행] 메뉴에 들어갑니다.' },
  { k: 'd', t: "입찰참가 신청 시 '등록확정' 또는 사후심사 건만 입찰서를 제출하실 수 있습니다." },
  { k: 'd', t: "입찰진행 목록에서 투찰할 대상 공고를 선택한 후 , '입찰서 제출' 버튼을 클릭하여 입찰서를 작성합니다." },
  { k: 'p', n: 5, t: '입찰실시 및 입찰결과 확인' },
  { k: 'd', t: '입찰일시가 도래되면 해당 발주기관의 입찰담당관이 입찰을 진행하여, 낙찰 여부를 결정합니다.' },
  { k: 'box', title: '입찰결과 확인', items: BID_RESULT_ITEMS_COMPET },
  { k: 'n', t: LATE_NOTE },
  // 전자입찰 진행순서(공개수의) — 스텝 (1)~(4), 마지막 '입찰결과 확인'은 안내 Infobox
  { k: 'b', t: '전자입찰 진행순서(공개수의)' },
  { k: 'd', t: '사용자 로그인 > 입찰공고 확인 > 견적서 작성 제출 > 입찰실시 및 입찰결과 확인' },
  { k: 'p', n: 1, t: '사용자 로그인' },
  { k: 'd', t: '국방전자조달에 접속하여 화면 오른쪽 위에 로그인 버튼으로 로그인 합니다.' },
  { k: 'p', n: 2, t: '입찰공고 확인' },
  { k: 'd', t: '[입찰 > 입찰공고] 메뉴를 선택하면 입찰공고 목록을 조회하실 수 있습니다.' },
  { k: 'd', t: '입찰공고 목록을 클릭하여 공고 세부내역을 확인합니다.' },
  { k: 'p', n: 3, t: '투찰' },
  { k: 'd', t: "공고 세부내역에서 화면 하단의 '견적서 작성' 버튼을 클릭하고 견적서 작성 후 제출합니다." },
  { k: 'p', n: 4, t: '입찰실시 및 입찰결과 확인' },
  { k: 'd', t: '입찰실시가 도래되면 해당 발주기관의 입찰담당관이 입찰을 진행하여, 낙찰 여부를 결정합니다.' },
  { k: 'box', title: '입찰결과 확인', items: BID_RESULT_ITEMS_OPEN },
  { k: 'n', t: LATE_NOTE },
]

export function Domestic01Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 절차 다이어그램 */}
      <div className="flex flex-col gap-2 p-4">
        <SecTitle>절차</SecTitle>
        <ProcedureFlow />
      </div>

      {/* 방법 */}
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-2">
          <SecTitle>방법</SecTitle>
          <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">
            방위사업청 및 각 부대의 입찰에 참여하기 위한 [업체등록] 절차는 아래와 같습니다.
          </p>
        </div>

        {/* 1. 인증서 발급 + 인증사업자 카드 */}
        <div className="flex flex-col gap-2">
          <NumTitle n={1}>아래 전자서명인증사업자에서 인증서를 발급받은 후</NumTitle>
          <Bullet
            t={
              <>
                조달청 나라장터(<Lnk url="www.d2b.go.kr" />, Tel : 1588-0800)에서 업체등록을 하셔야
                합니다
              </>
            }
          />
          <div className="flex flex-col gap-2 pt-1">
            {CERT_PROVIDERS.map((p) => (
              <CertCard key={`${p.name}-${p.url}`} provider={p} />
            ))}
          </div>
        </div>

        {/* 2. 사용자등록 */}
        <div className="flex flex-col gap-1">
          <NumTitle n={2}>조달청의 나라장터 업체등록하신 후</NumTitle>
          {renderItems([
            { k: 'b', t: '다음 날 국방전자조달시스템에서 사용자등록을 하셔야 로그인 할 수 있습니다.' },
            { k: 'b', t: '사용자등록 절차' },
            { k: 'd', t: '국방전자조달시스템 > 사용자등록(우측 상단) > 로그인(간편인증 또는 인증서)' },
            { k: 'n', t: '이 단계까지 완료하시면 국방전자조달에서 공고된 입찰에 참여하실 수 있습니다.' },
          ])}
        </div>

        {/* 3. 중앙조달 품목등록 */}
        <div className="flex flex-col gap-1">
          <NumTitle n={3}>중앙조달(방위사업청)입찰에 참여하실 경우</NumTitle>
          {renderItems(SEC3_ITEMS)}
        </div>

        {/* 4. 업체등록 및 변경 시 유의사항 */}
        <div className="flex flex-col gap-1">
          <NumTitle n={4}>업체등록 및 변경 시 유의사항</NumTitle>
          {renderItems(SEC4_ITEMS)}
        </div>

        {/* 5. 입찰참가 */}
        <div className="flex flex-col gap-1 pb-4">
          <NumTitle n={5}>입찰참가 (물품/공사/용역)</NumTitle>
          {renderItems(SEC5_ITEMS)}
        </div>
      </div>
    </div>
  )
}
Domestic01Page.displayName = 'Domestic01Page'
