// 국외조달원 등록절차 — MUI-CM-05-M12. Figma 10020-86658 / 설계서 00.공통 v0.83 slide352·360.
// 이용안내 > 국외조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 2개 섹션(1.국외소재상사 / 2.국내소재상사) 각각에 번호 카드(단계) — 뱃지+제목+본문(링크·sub_notice·※).
// 색은 전부 KRDS 토큰(#0f316e=action-primary-active·text-primary-active, #c1d1ee=border-field,
//   #0054e9=text-primary, #1d1d1d=text-ink, #425679=text-info). sub_notice 노트색만 arbitrary(#717171/#db083e).
// [[cm-preparation01-m07]] 번호 카드 패턴 + [[cm-domestic01-m09]] sub_notice 노트 재사용.
import type { ReactNode } from 'react'

// ── Figma 'sub_notice' 아이콘 (안내 노트 마커) — fill=currentColor 로 text-* 색 제어. (M09 와 동일 path) ──
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

// 외부 URL 링크 (blue underline, 새 탭).
function Lnk({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-krds-text-primary underline wrap-break-word"
    >
      {children}
    </a>
  )
}

// 번호 뱃지 — 네이비 rounded-[4px] + 흰 번호.
function NumBadge({ n }: { n: number }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-krds-action-primary-active text-[17px] font-bold text-white">
      {n}
    </span>
  )
}

// 번호 카드 — 뱃지 + 제목(#0f316e 19px bold) + (선택)본문. children 없으면 등록완료형(헤더만).
function GuideCard({ n, title, children }: { n: number; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-krds-border-field p-4">
      <div className="flex items-center gap-2">
        <NumBadge n={n} />
        <span className="text-[19px] font-bold leading-normal text-krds-text-primary-active">
          {title}
        </span>
      </div>
      {children ? <div className="flex flex-col gap-1">{children}</div> : null}
    </div>
  )
}

// 본문 일반 텍스트 라인(17px ink). 링크 등 인라인 포함 가능.
function Line({ children }: { children: ReactNode }) {
  return (
    <p className="text-[17px] leading-normal text-krds-text-ink wrap-break-word">{children}</p>
  )
}

// sub_notice 노트 — red(경고) / gray(안내). 카드 본문용(pl 없음).
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

// ※ 안내 라인 (text-info #425679).
function InfoLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] leading-normal text-krds-text-info">
      <span className="w-5 shrink-0 text-center font-medium">※</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// - 대시 하위 항목(pl-6, ink).
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

// 국외조달등록/정보변경안내 링크 URL (Figma 그대로).
const FOREIGN_GUIDE_URL = 'https://www.d2b.go.kr/contents/info/foreign02.do?key=519'

export function Foreign01Page() {
  return (
    <div className="flex w-full flex-col">
      {/* 1. 국외소재상사(제조업, 공급업체) */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          1. 국외소재상사(제조업, 공급업체)
        </p>
        <GuideCard n={1} title="필요서류 제출">
          <Line>
            필요서류 : <Lnk href={FOREIGN_GUIDE_URL}>국외조달등록/정보변경안내</Lnk>
          </Line>
        </GuideCard>
        <GuideCard n={2} title="신용정보 확인 (D&B사)">
          <Line>
            신용정보확인 : 미국 D&B사를 통해 신용정보확인하고 있으며, 10근무일정도 소요
          </Line>
          <Note tone="gray">정상업체 확인</Note>
        </GuideCard>
        <GuideCard n={3} title="등록완료" />
      </div>

      {/* 2. 국내소재상사(...) */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          2. 국내소재상사(공급업체, 국외업체의 국내지사, 군수품무역업체(군수품무역중개업체 포함)
        </p>
        <GuideCard n={1} title="조달청 업체 외자업무 등록">
          <Line>
            <Lnk href="http://www.g2b.go.kr">www.g2b.go.kr</Lnk>
          </Line>
          <Note tone="gray">1일 후 2번단계로 진행합니다.</Note>
        </GuideCard>
        <GuideCard n={2} title="국방전자조달 사용자등록">
          <Line>
            <Lnk href="http://www.d2b.go.kr">www.d2b.go.kr</Lnk>
          </Line>
        </GuideCard>
        <GuideCard n={3} title="보안측정요청(국군방첩사령부)">
          <Line>
            <Lnk href="http://www.dcc.mil.kr">www.dcc.mil.kr</Lnk>
          </Line>
          <Note tone="red">
            신원조사 결과 부적격자는 방산업무에 참여할 수 없습니다. (국방부 방위산업보안업무훈령 별표
            15군 무역대리점 보안관리 규정)
          </Note>
          <Note tone="gray">적격판정 받은 경우 4번단계로 진행합니다.</Note>
        </GuideCard>
        <GuideCard n={4} title="추가정보입력(국방전자조달시스템)">
          <InfoLine>추가정보등록 입력 후 저장</InfoLine>
          <Dash>업체정보 추가등록 &gt; 국내소재상사 탭 클릭 후 추가정보등록 입력 후 신청</Dash>
          <Dash>별표 반드시 입력 / 보안측정일자는 입력일자</Dash>
          <InfoLine>
            업체정보(상호, 대표자, 주소, 방산업무 담당자)등이 변경시에는 별도의 보안 측정을 받아야
            합니다.
          </InfoLine>
          <Dash>
            상단의 ①필요서류 &gt;{' '}
            <Lnk href={`${FOREIGN_GUIDE_URL}#link01`}>국외조달등록/정보변경안내 참조</Lnk>
          </Dash>
        </GuideCard>
        <GuideCard n={5} title="등록완료" />
      </div>
    </div>
  )
}
Foreign01Page.displayName = 'Foreign01Page'
