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
  | { k: 'b'; t: ReactNode; bold?: boolean } // ● 채움 불릿
  | { k: 'd'; t: ReactNode; lv?: 1 | 2 } // - 대시(하위)
  | { k: 'n'; t: ReactNode } // 캐비엇/결론 노트(muted)
  | { k: 'box'; title: ReactNode; items: ReactNode[] } // 안내 Infobox(static)

// ● 채움 불릿
function Bullet({ t, bold }: { t: ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-krds-text-ink" aria-hidden />
      <span
        className={`min-w-px flex-1 text-[17px] leading-normal text-krds-text-ink wrap-break-word ${
          bold ? 'font-bold' : ''
        }`}
      >
        {t}
      </span>
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

// 캐비엇/결론 노트 — muted (Figma 손 모양 마커는 에셋 미보유로 muted 스타일 근사).
function Note({ t }: { t: ReactNode }) {
  return (
    <div className="flex items-start gap-1 pl-6">
      <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-krds-text-muted" aria-hidden />
      <span className="min-w-px flex-1 text-[15px] leading-normal text-krds-text-muted wrap-break-word">
        {t}
      </span>
    </div>
  )
}

function renderItems(items: Item[]) {
  return items.map((it, i) => {
    switch (it.k) {
      case 'b':
        return <Bullet key={i} t={it.t} bold={it.bold} />
      case 'd':
        return <Dash key={i} t={it.t} lv={it.lv} />
      case 'n':
        return <Note key={i} t={it.t} />
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
    <span className="flex size-8 items-center justify-center rounded-[4px] bg-krds-action-primary-active text-[17px] font-bold text-white">
      {n}
    </span>
  )
}

function FlowCard({ n, title, url }: { n: number; title: string; url?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[12px] border border-krds-border-field p-4">
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
    <span className="rounded-full bg-[#ffe567] px-3 py-1 text-center text-[14px] font-bold leading-tight text-krds-text-primary-active">
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
          <div className="flex w-full flex-col items-center rounded-[8px] bg-krds-bg-primary-faint px-3 py-3 text-center">
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

      {/* 입찰참가 목표 박스 */}
      <div className="flex flex-col items-center gap-2 rounded-[12px] bg-krds-action-primary-active px-4 py-5">
        <Icon name="Folder" size={32} fill={1} className="text-white" aria-hidden />
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
}
const CERT_PROVIDERS: CertProvider[] = [
  { name: '한국무역정보통신', tel: '1566-2119', url: 'www.tradesign.net' },
  { name: '한국전자인증', tel: '1566-0566', url: 'www.crosscert.com' },
  { name: '한국정보인증', tel: '1577-8787', url: 'www.signgate.com' },
  { name: '(주)코스콤 인증센터', tel: '1577-7337', url: 'www.signkorea.com' },
  { name: '금융결재원 전자인증센터', tel: '1577-5500', url: 'www.yessign.or.kr' },
]

function CertCard({ provider }: { provider: CertProvider }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[12px] bg-krds-bg-primary-faint p-4 text-center">
      <div className="flex items-center gap-2">
        <span className="text-[17px] font-bold text-krds-text-ink">{provider.name}</span>
        <PhoneBadge />
        <span className="text-[17px] text-krds-text-ink">{provider.tel}</span>
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
  { k: 'b', t: '입찰 전에 해당품목에 대한 품목등록을 완료하셔야 합니다.', bold: true },
  { k: 'b', t: '품목등록 신청 절차' },
  { k: 'd', t: '국방전자조달 > 마이페이지 > 업체정보관리 > 업체정보 추가등록 > 물품(내자) 탭 클릭> 화면 중간 등록품목명세' },
  { k: 'd', t: '신규 품목 등록 시 : 추가버튼 > 품류 및 품명 조회하여 등록희망품목 검색 > 등록희망품목 앞 선택박스 체크 후 확인버튼 클릭(복수선택가능) > 화면 하단의 신청버튼 클릭' },
  { k: 'd', t: '갱신 품목 등록 시(만료 전 90일부터 갱신 가능) : 갱신희망품목 정보 확인 > 갱신희망품목 선택박스 체크 후 > 갱신버튼 클릭 > 화면 하단의 신청버튼' },
  { k: 'b', t: '품목등록 신청 후 제출서류' },
  { k: 'd', t: '제조품목의 경우 : 공장등록증명서(발행일 3개월 이내일 것) 1부.' },
  { k: 'n', t: '단, 행정정보공동이용에서 확인 가능한 경우 생략가능(민원인 동의 필요)' },
  { k: 'd', t: '판매품목의 경우 : 사업자등록증명원(발행일 3개월 이내일 것) 1부.' },
  { k: 'n', t: '단, 행정정보공동이용에 확인 가능한 경우 생략가능(민원인 동의 필요)' },
  { k: 'd', t: '관련 법률에 따라 정부 인.허가, 신고가 필요한 품목의 경우 해당 인.허가 신고증을 FAX로제출' },
  { k: 'd', t: '제출 및 문의' },
  { k: 'd', lv: 2, t: '팩스번호 : 02)773-7587, 수신자 : 계약제도발전과 조달원등록 담당(반드시 기재)' },
  { k: 'd', lv: 2, t: '품목등록 신청 관련 문의전화: (02)2079-6915,6925' },
  { k: 'n', t: '이 단계까지 완료하셔야만 중앙조달(방위사업청) 입찰에 참여할 수 있습니다.' },
]

const SEC4_ITEMS: Item[] = [
  {
    k: 'b',
    t: (
      <>
        업체정보(대표자 주소 등) 변경사항이 있는 경우 나라장터(<Lnk url="www.g2b.go.kr" />) 에 변경
        요청하여 승인 처리되면 다음 날 국방전자조달에 자동 반영됨.
      </>
    ),
  },
  {
    k: 'b',
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

const SEC5_ITEMS: Item[] = [
  // 전자입찰 진행순서(경쟁입찰)
  { k: 'b', t: '전자입찰 진행순서(경쟁입찰)', bold: true },
  { k: 'd', t: '사용자 로그인 > 입찰공고 확인 > 입찰참가신청서 작성 제출 > 입찰서 작성 제출 > 입찰실시 및 입찰결과 확인' },
  { k: 'b', t: '사용자 로그인' },
  { k: 'd', t: '국방전자조달에 접속하여 화면 오른쪽 위에 로그인 버튼으로 로그인 합니다.' },
  { k: 'b', t: '입찰공고 확인' },
  { k: 'd', t: '[입찰 > 입찰공고] 메뉴를 선택하면 입찰공고 목록을 조회하실 수 있습니다.' },
  { k: 'd', t: '입찰공고 목록을 클릭하여 공고 세부내역을 확인합니다.' },
  { k: 'b', t: '입찰참가신청서 작성 제출' },
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
  { k: 'b', t: '투찰' },
  { k: 'd', t: '[입찰 > 입찰진행] 메뉴에 들어갑니다.' },
  { k: 'd', t: "입찰참가 신청 시 '등록확정' 또는 사후심사 건만 입찰서를 제출하실 수 있습니다." },
  { k: 'd', t: "입찰진행 목록에서 투찰할 대상 공고를 선택한 후 , '입찰서 제출' 버튼을 클릭하여 입찰서를 작성합니다." },
  { k: 'b', t: '입찰실시 및 입찰결과 확인' },
  { k: 'd', t: '입찰일시가 도래되면 해당 발주기관의 입찰담당관이 입찰을 진행하여, 낙찰 여부를 결정합니다.' },
  { k: 'b', t: '입찰결과 확인' },
  { k: 'd', t: '[입찰 > 입찰결과] 메뉴를 선택하면 입찰결과 목록 조회할 수 있습니다.' },
  { k: 'd', t: '적격심사제인 입찰 건은 업체별 투찰금액 및 적격심사순위만 공개하고, 추후 적격심사가 완료되면 최종낙찰업체를 공개합니다.' },
  { k: 'n', t: LATE_NOTE },
  // 전자입찰 진행순서(공개수의)
  { k: 'b', t: '전자입찰 진행순서(공개수의)', bold: true },
  { k: 'd', t: '사용자 로그인 > 입찰공고 확인 > 견적서 작성 제출 > 입찰실시 및 입찰결과 확인' },
  { k: 'b', t: '사용자 로그인' },
  { k: 'd', t: '국방전자조달에 접속하여 화면 오른쪽 위에 로그인 버튼으로 로그인 합니다.' },
  { k: 'b', t: '입찰공고 확인' },
  { k: 'd', t: '[입찰 > 입찰공고] 메뉴를 선택하면 입찰공고 목록을 조회하실 수 있습니다.' },
  { k: 'd', t: '입찰공고 목록을 클릭하여 공고 세부내역을 확인합니다.' },
  { k: 'b', t: '투찰' },
  { k: 'd', t: "공고 세부내역에서 화면 하단의 '견적서 작성' 버튼을 클릭하고 견적서 작성 후 제출합니다." },
  { k: 'b', t: '입찰실시 및 입찰결과 확인' },
  { k: 'd', t: '입찰실시가 도래되면 해당 발주기관의 입찰담당관이 입찰을 진행하여, 낙찰 여부를 결정합니다.' },
  { k: 'b', t: '입찰결과 확인' },
  { k: 'd', t: '[입찰 > 입찰결과 ] 메뉴를 선택하면 입찰결과 목록 조회할 수 있습니다.' },
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
