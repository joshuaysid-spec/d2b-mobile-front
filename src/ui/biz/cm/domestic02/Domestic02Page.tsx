// 전자입찰절차(국내) — MUI-CM-05-M10. Figma 개인용-260723 10020-85946 / 설계서 00.공통 v0.84 slide371.
// 이용안내 > 국내조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 참가신청 서류 카드 4개(Card+Badge n순위) → 참가신청 절차(단계 박스 4) → 제출절차(단계 박스 7 + 경고 노트)
//   → 낙찰자 결정 방법(type3 카드 4 + 안내 노트) → 적격심사기준(번호 리스트 + 메뉴얼 바로가기).
// 단계 박스/불릿/대시는 Domestic03 과 동일 Figma 프리미티브(단계 뱃지 32px 사각 + m_list) — 프리미티브는 페이지 소유.
// sub_notice 노트색은 M09/M12 와 동일 arbitrary(#db083e red / #717171 gray).
import type { ReactNode } from 'react'

import { Badge } from '@/ui/common/base/Badge'
import { Card } from '@/ui/common/composites/Card'

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

// - 대시 하위 항목 — Figma m_list(pl-24px).
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

// ※ 안내 라인 (17px text-info) — Figma m_list(※ 20px 슬롯).
function InfoLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] leading-normal text-krds-text-info">
      <span className="w-5 shrink-0 text-center font-medium">※</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// Figma 'sub_notice' 아이콘 — M09/M12 와 동일 path, fill=currentColor.
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

// sub_notice 노트 — red(경고) / gray(안내).
function Note({ tone, children }: { tone: 'red' | 'gray'; children: ReactNode }) {
  const gray = tone === 'gray'
  return (
    <div className="flex items-start gap-1">
      <SubNoticeIcon
        className={`mt-px size-5 shrink-0 ${gray ? 'text-[#717171]' : 'text-[#db083e]'}`}
      />
      <span
        className={`min-w-px flex-1 text-[14px] leading-normal wrap-break-word ${
          gray ? 'text-[#717171]' : 'text-[#db083e]'
        }`}
      >
        {children}
      </span>
    </div>
  )
}

// 단계 박스 — 32px 사각 번호 뱃지(bg action-primary-active) + "단계"(19 Bold text-primary-active) + 본문.
function StepBox({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-field p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-krds-action-primary-active text-[17px] font-bold leading-normal text-white">
          {n}
        </span>
        <span className="text-[19px] font-bold leading-normal text-krds-text-primary-active">
          단계
        </span>
      </div>
      <div className="flex w-full flex-col gap-1">{children}</div>
    </div>
  )
}

// 섹션 래퍼 — Figma 섹션 프레임 p-16 + 타이틀·본문 gap 8px.
function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      {children}
    </div>
  )
}

// muted(#555) 카드 값 — Card 의 기본 ink 값 색을 Figma(m_card_inforow #555)대로 덮음.
function MutedValue({ children }: { children: ReactNode }) {
  return <span className="text-krds-text-muted">{children}</span>
}

// 낙찰자 결정 방법 type3 카드 — 제목 + (레이블 13px 위 / 값 17px 아래) 2행 + 중간 divider(#d1d7e0).
// 레이블 색 #717171 은 sub_notice gray 와 동일한 Figma 일회성 accent(토큰 없음).
function DecisionCard({ title, content, target }: { title: string; content: string; target: string }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] leading-normal text-[#717171]">내용</span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{content}</span>
      </div>
      <div className="h-px w-full bg-krds-bg-divider" aria-hidden />
      <div className="flex flex-col gap-1">
        <span className="text-[13px] leading-normal text-[#717171]">대상금액 (부가세포함)</span>
        <span className="text-[17px] leading-normal text-krds-text-muted">{target}</span>
      </div>
    </div>
  )
}

// 'N.' 번호 리스트 항목 (적격심사 섹션).
function NumItem({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] leading-normal text-krds-text-ink">
      <span className="shrink-0 whitespace-nowrap">{n}.</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// '바로가기' 링크 텍스트 — 사용자 메뉴얼(대상 URL 미정, 스텁).
function ShortcutLink() {
  return (
    <button
      type="button"
      className="text-[17px] leading-normal text-krds-text-primary underline"
      onClick={() => console.log('[Domestic02] 사용자 메뉴얼 바로가기')} // 추후: 메뉴얼 게시물 연결
    >
      바로가기
    </button>
  )
}

// 전자입찰 참가신청 서류 카드 (Card + Badge 조립, 값은 muted).
const APPLY_DOCS: {
  id: string
  rank: string
  title: ReactNode
  method: ReactNode
  note: ReactNode
}[] = [
  {
    id: 'doc-1',
    rank: '1순위',
    title: '입찰참가신청서',
    method: '인터넷으로 작성제출',
    note: '등록마감시간 초과시 제출 불가',
  },
  {
    id: 'doc-2',
    rank: '2순위',
    title: (
      <>
        입찰보증금 납부서(서면)
        <br />
        입찰보증금 납부서(전자보증서)
      </>
    ),
    method: (
      <>
        발주기관으로 직접 제출
        <br />
        인터넷으로 제출
      </>
    ),
    note: '등록마감시간 초과시 제출 불가',
  },
  {
    id: 'doc-3',
    rank: '3순위',
    title: '입찰공고시 요구서류 (해당업종 공장등록증명)',
    method: '발주기관으로 직접 제출',
    note: '등록마감시간 초과시 제출 불가',
  },
  {
    id: 'doc-4',
    rank: '4순위',
    title: '입찰서',
    method: '인터넷으로 작성 제출',
    note: '입찰서 제출 마감시간 초과시 제출 불가',
  },
]

// 낙찰자 결정 방법 카드 데이터 (Figma 값 그대로).
const DECISIONS = [
  {
    id: 'dec-1',
    title: '최저가낙찰',
    content: '최저가 투찰가를 낙찰자로 결정',
    target: '물품(제조/구매) : 2.1억원 미만',
  },
  {
    id: 'dec-2',
    title: '적격심사제 (국계령42조)',
    content: '계약이행능력을 종합심사 후 낙찰자로 결정',
    target: '물품(제조/구매) : 2.1억원 이상, 종합점수 95점 이상 합격',
  },
  {
    id: 'dec-3',
    title: '2단 경쟁 (국계령18조)',
    content: '기술평가 합격자 중 최저가 투찰자를 낙찰자로 결정',
    target: '품목의 특성상 필요한 사업 (특별한 기술이 필요한 용역 등)',
  },
  {
    id: 'dec-4',
    title: '협상에 의한 계약 (국계령43조)',
    content: '가격평가 결과를 합산하여 최고점을 득한 자 순으로 협상대상자로 결정',
    target: '물품, 용역계약에 있어서 품목의 특성상 긴급, 기타 등의 이유로 필요하다고 인정되는 사업',
  },
]

export function Domestic02Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 전자입찰 참가신청 서류 — Card + Badge(n순위) */}
      <Section title="전자입찰 참가신청 서류">
        {APPLY_DOCS.map((doc) => (
          <Card
            key={doc.id}
            className="shadow-krds-card"
            badges={
              <Badge type="pastel" color="blue">
                {doc.rank}
              </Badge>
            }
            title={doc.title}
            rows={[
              { label: '제출방법', value: <MutedValue>{doc.method}</MutedValue> },
              { label: '비고', value: <MutedValue>{doc.note}</MutedValue> },
            ]}
          />
        ))}
      </Section>

      {/* 인터넷 입찰참가신청 절차 — 단계 1~4 */}
      <Section title="인터넷 입찰참가신청 절차">
        <StepBox n={1}>
          <Bullet>{'지문인식 로그인 > 제조사 선택 > 지문인식> PIN번호입력 후 확인'}</Bullet>
          <Bullet>{'사용자 로그인 > 전자서명인증사업자 선택 > 인증서패스워드 입력'}</Bullet>
        </StepBox>
        <StepBox n={2}>
          <Bullet>{'물품/용역/공사 > 경쟁입찰 > 입찰공고 > 품목선택'}</Bullet>
        </StepBox>
        <StepBox n={3}>
          <Bullet>
            {'입찰참가신청서 작성 > 입찰보증금 납부방법, 보증서선택 / 입찰보증금 입력 후 신청버튼 클릭'}
          </Bullet>
        </StepBox>
        <StepBox n={4}>
          <Bullet>입찰참가신청서조회를 통하여 문서가 제대로 조회되면 정상 처리</Bullet>
        </StepBox>
      </Section>

      {/* 전자입찰서 제출절차 — 단계 1~7 + 마감 경고 노트 */}
      <Section title="전자입찰서 제출절차">
        <StepBox n={1}>
          <Bullet>
            {'입찰등록결과조회에서 입찰등록상태가 "사후심사/투찰가능, 등록확정/투찰가능 " 으로 되어있으면 입찰서(투찰서) 제출 가능'}
          </Bullet>
          <InfoLine>입찰등록확정 문의사항 (발주기관 : 공고내역조회시 문의처 참고)</InfoLine>
        </StepBox>
        <StepBox n={2}>
          <Bullet>간편인증, 아이디/비밀번호, 금융인증 로그인</Bullet>
        </StepBox>
        <StepBox n={3}>
          <Bullet>{'물품/용역/공사 > 경쟁입찰 > 입찰서제출 > 품목선택 후 입찰서 작성 버튼 클릭'}</Bullet>
        </StepBox>
        <StepBox n={4}>
          <Bullet>투찰금액 입력(보증금의 20배를 초과하는 금액 입력 불가)</Bullet>
        </StepBox>
        <StepBox n={5}>
          <Bullet>복수예비가격 번호 중 2개 선택(기초예비가격 미적용인 경우 선택 안함)</Bullet>
        </StepBox>
        <StepBox n={6}>
          <Bullet>입찰서작성 후 확인 버튼</Bullet>
        </StepBox>
        <StepBox n={7}>
          <Bullet>입찰서조회로 투찰금액이 확인되면 정상 처리</Bullet>
        </StepBox>
        <Note tone="red">
          전자입찰은 마감시간 1초라도 초과시에는 투찰이 불가능하오니 충분한 시간전에 입찰을
          완료하시기 바라며 기타 세부사항은 전자입찰절차를 참고바랍니다.
        </Note>
      </Section>

      {/* 낙찰자 결정 방법 — type3 카드 4 + 안내 노트 */}
      <Section title="낙찰자 결정 방법">
        {DECISIONS.map((d) => (
          <DecisionCard key={d.id} title={d.title} content={d.content} target={d.target} />
        ))}
        <Note tone="gray">
          입찰공고 품목 중 적격심사 대상품목은 저가입찰 방지 및 능력있는 업체선정을 위하여
          적격여부를 심사 후 낙찰업체로 결정되며, 목표가격 범위내 최저가격으로 입찰한 자를
          순차적으로 심사합니다.
        </Note>
      </Section>

      {/* 적격심사기준 및 세부내역 별점 */}
      <div className="flex w-full flex-col gap-1 p-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          적격심사기준 및 세부내역 별점
        </p>
        <NumItem n={1}>전자입찰관련 문의 : 발주기관(입찰공고내역 문의처 전화번호 참고)</NumItem>
        <NumItem n={2}>전자입찰관련 문서 다운로드</NumItem>
        <Dash>
          사용자 메뉴얼 <ShortcutLink />
        </Dash>
      </div>
    </div>
  )
}
Domestic02Page.displayName = 'Domestic02Page'
