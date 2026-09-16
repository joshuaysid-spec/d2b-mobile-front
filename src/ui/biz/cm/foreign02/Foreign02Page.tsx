// 국외조달원 등록/변경안내 — MUI-CM-05-M13. Figma 개인용-260723 10020-86724 / 설계서 00.공통 v0.84 slide374.
// 이용안내 > 국외조달안내 하위의 정적 안내(가이드) 페이지. 고정 안내 문구라 목업/API 경계 없음.
// 구성: 인트로(근거 법령 불릿) → 1. 국외소재상사((1) 신규등록 카드 4 · (2) 정보변경 카드 3)
//   → 2. 국내소재상사((1) 신규등록 카드 4 · (2) 정보변경 카드 2 · 보안측정안내 연락처 카드).
// 카드 = Figma m_card type3(제목 19 Bold + 레이블 13 #717171 / 값 17 muted 블록 + divider #d1d7e0).
// 서식 다운로드 — 다운로드 실배선(목업 GUID, 2026-09-02 사용자 확정), CmdtyElctrCtrtPrgrsDtl_Adoc 패턴 복제.
//   프리미티브는 안내 페이지 계열 컨벤션대로 페이지 소유.
import { type ReactNode } from 'react'

import { fbQueries } from '@/queries/tss/fb/fbQueries'
import { saveBlob } from '@/utils/download'
import { Icon } from '@/ui/common/base/Icon'
import { showToast } from '@/stores/authStore'

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

// '(N) 소제목' — Bold 17 괄호번호 헤더 (신규등록/정보변경).
function ParenTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] font-bold leading-normal text-krds-text-ink">
      <span className="shrink-0 whitespace-nowrap">({n})</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
  )
}

// ※ 안내 라인 (17px #717171 — 카드 비고 내부 노트).
function CaveatLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[17px] leading-normal text-[#717171]">
      <span className="w-5 shrink-0 text-center font-medium">※</span>
      <span className="min-w-px flex-1 wrap-break-word">{children}</span>
    </div>
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

// 서식 다운로드 버튼 — Figma: 24px 아이콘 + '다운로드'(17 blue underline). 핸들러는 페이지가 소유(훅·토스트 1벌).
function DownloadButton({ doc, onDownload }: { doc: string; onDownload: (doc: string) => void }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-[17px] leading-normal text-krds-text-primary underline"
      onClick={() => onDownload(doc)}
    >
      <Icon name="Download" size={24} aria-hidden />
      다운로드
    </button>
  )
}

// m_card type3 — 제목 + 블록들(레이블 13 #717171 + 값 17 muted)·divider(#d1d7e0) 구분.
interface DocBlock {
  label: string
  content: ReactNode
}
function DocCard({ title, blocks }: { title: ReactNode; blocks: DocBlock[] }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
        {title}
      </p>
      {blocks.map((b, i) => (
        <div key={b.label + i} className="contents">
          {i > 0 && <div className="h-px w-full bg-krds-bg-divider" aria-hidden />}
          <div className="flex flex-col gap-1">
            <span className="text-[13px] leading-normal text-[#717171]">{b.label}</span>
            {b.content}
          </div>
        </div>
      ))}
    </div>
  )
}

// 카드 값 텍스트(17 muted).
function Val({ children }: { children: ReactNode }) {
  return (
    <span className="text-[17px] leading-normal text-krds-text-muted wrap-break-word">
      {children}
    </span>
  )
}

// 섹션 래퍼 — 타이틀(19 Bold) + 본문.
function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      {children}
    </div>
  )
}

// 소절 헤더(신규등록/정보변경) — (N) 제목 + 대시 항목들.
function SubHeader({ n, title, timing }: { n: number; title: string; timing: string }) {
  return (
    <div className="flex flex-col gap-1">
      <ParenTitle n={n}>{title}</ParenTitle>
      <Dash>{timing}</Dash>
      <Dash>필요서류</Dash>
    </div>
  )
}

// 보안측정안내 연락처 (Figma 값 그대로).
const DCC_CONTACTS = [
  '사령부(총괄) : 02) 731-5312',
  '대구·경북·포항 등 : 053) 750-2715',
  '수원·용인·이천·안성 등 : 031) 331-2711',
  '전남·전북 : 062) 606-0311',
  '충북 : 043) 298-2606',
  '인천·안양·안산·김포 등 : 031) 384-1113',
  '경남 : 055) 270-2240',
  '서울·성남·하남 등 : 02) 2126-2376',
  '부산·울산·경남 양산 등 : 051) 701-8113',
  '대전·충남 : 042) 606-2326',
]

export function Foreign02Page() {
  const downloadFile = fbQueries.useDownloadFile()

  // 서식 다운로드 — guid 로 Blob 수신 → 서식명.hwp 로 저장. 실패는 토스트 안내.
  // ⚠️ 임시 GUID(서식명) — 서식 파일 저장소/GUID 확정 시 교체.
  const handleDownload = async (doc: string) => {
    try {
      saveBlob(await downloadFile.mutateAsync(doc), `${doc}.hwp`)
    } catch {
      showToast('파일 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 인트로 — 근거 법령 */}
      <div className="flex w-full flex-col gap-1 p-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          우수한 업체가 상시 경쟁입찰에 참여 할 수 있도록 신규등록 및 등록업체의 정보 변경 안내
        </p>
        <Bullet>국가를 당사자로 하는 계약에 관한 법률 시행령 제12조(경쟁입찰의 참가자격)</Bullet>
        <Bullet>
          국가를 당사자로 하는 계약에 관한 법률 시행령 제78조(부정당업자의 입찰참가 자격제한)
        </Bullet>
      </div>

      {/* 1. 국외소재상사 */}
      <Section title="1. 국외소재상사">
        <SubHeader n={1} title="신규등록" timing="등록시기 : 연중 수시" />
        <DocCard
          title="등록신청서 원본 1부"
          blocks={[
            {
              label: '다운로드',
              content: (
                <>
                  <Val>Application for Registration</Val>
                  <DownloadButton
                    doc="Application for Registration(국문)"
                    onDownload={handleDownload}
                  />
                  <DownloadButton
                    doc="Application for Registration(영문)"
                    onDownload={handleDownload}
                  />
                </>
              ),
            },
            { label: '비고', content: <Val>대표자가 서명한 원본서류 제출</Val> },
          ]}
        />
        <DocCard
          title="보안준수 서약서(공증) 원본 1부"
          blocks={[
            {
              label: '다운로드',
              content: (
                <>
                  <Val>Pledge for Security</Val>
                  <DownloadButton doc="Pledge for Security(국문)" onDownload={handleDownload} />
                  <DownloadButton doc="Pledge for Security(영문)" onDownload={handleDownload} />
                </>
              ),
            },
            { label: '비고', content: <Val>해당국에서 공증된 원본서류 제출</Val> },
          ]}
        />
        <DocCard
          title="사업자등록증명서 1부"
          blocks={[
            { label: '다운로드', content: <Val>Business Registration Certificate</Val> },
            { label: '비고', content: <Val>사본제출 가능</Val> },
          ]}
        />
        <DocCard
          title="등록신청서 원본 1부"
          blocks={[
            { label: '필요서류', content: <Val>Application for Registration</Val> },
            { label: '비고', content: <Val>등록신청서 상 대리점(agent) 등록요청 시 제출</Val> },
          ]}
        />

        <SubHeader n={2} title="정보변경" timing="변경시기 : 변경 후 즉시" />
        <DocCard
          title="조달원등록변경신청서 원본 1부"
          blocks={[
            { label: '변경내용', content: <Val>대표자 / 상호</Val> },
            {
              label: '필요서류',
              content: (
                <>
                  <Val>Application for Amendment in Registration</Val>
                  <DownloadButton
                    doc="Application for Amendment in Registration(국문)"
                    onDownload={handleDownload}
                  />
                  <DownloadButton
                    doc="Application for Amendment in Registration(영문)"
                    onDownload={handleDownload}
                  />
                </>
              ),
            },
            { label: '비고', content: <Val>대표자가 서명한 원본서류 제출</Val> },
          ]}
        />
        <DocCard
          title="보안준수 서약서(공증) 원본 1부"
          blocks={[
            { label: '변경내용', content: <Val>대표자 / 상호</Val> },
            {
              label: '필요서류',
              content: (
                <>
                  <Val>Pledge for Security</Val>
                  <DownloadButton doc="Pledge for Security(국문)" onDownload={handleDownload} />
                  <DownloadButton doc="Pledge for Security(영문)" onDownload={handleDownload} />
                </>
              ),
            },
            { label: '비고', content: <Val>해당국에서 공증된 원본 서류 제출</Val> },
          ]}
        />
        <DocCard
          title="조달원등록변경신청서 원본 1부"
          blocks={[
            { label: '변경내용', content: <Val>대표자 / 상호</Val> },
            {
              label: '필요서류',
              content: (
                <>
                  <Val>Application for Amendment in Registration</Val>
                  <DownloadButton
                    doc="Application for Amendment in Registration(국문)"
                    onDownload={handleDownload}
                  />
                  <DownloadButton
                    doc="Application for Amendment in Registration(영문)"
                    onDownload={handleDownload}
                  />
                </>
              ),
            },
            { label: '비고', content: <Val>대표자가 서명한 원본서류 제출</Val> },
          ]}
        />
      </Section>

      {/* 2. 국내소재상사 */}
      <Section title="2. 국내소재상사">
        <SubHeader n={1} title="신규등록" timing="등록시기 : 연중 수시" />
        <DocCard
          title="사업자등록증명원 (법인의 경우 등기부등본 1부 추가)"
          blocks={[
            {
              label: '비고',
              content: (
                <Val>
                  인터넷 조달청(<Lnk href="http://www.g2b.go.kr/">www.g2b.go.kr</Lnk>)등록 시 필요
                </Val>
              ),
            },
          ]}
        />
        {/* 제목은 화면설계서 기준 "보안측정결과서 1부"(v0.84 slide134·163 국내소재상사 제출서류 표기).
            Figma 원본은 첫 카드 제목("사업자등록증명원…") 복붙 오류라 설계서 우선(사용자 확정). */}
        <DocCard
          title="보안측정결과서 1부"
          blocks={[
            {
              label: '비고',
              content: (
                <>
                  <Val>
                    국군방첩사령부에서 신청(<Lnk href="http://www.dcc.mil.kr/">www.dcc.mil.kr</Lnk>
                    {' > 방위산업 > 보안측정신청)'}
                  </Val>
                  <CaveatLine>
                    국군방첩사령부에서 방위사업청 등록담당자에게 직접 결과 송부하므로 제출 생략
                  </CaveatLine>
                </>
              ),
            },
          ]}
        />
        <DocCard
          title="청렴계약 이행서약"
          blocks={[
            {
              label: '비고',
              content: (
                <Val>
                  국방전자조달(<Lnk href="https://www.d2b.go.kr/">www.d2b.go.kr</Lnk>) 사용자등록 시
                  서약 후 저장
                </Val>
              ),
            },
          ]}
        />
        <DocCard
          title="대리점계약서 사본 1부 (관련업체 등록 필요시만)"
          blocks={[{ label: '비고', content: <Val>해외 공급업체와의 대리점계약서 제출</Val> }]}
        />

        <SubHeader n={2} title="정보변경" timing="변경시기 : 변경 후 즉시" />
        <DocCard
          title="보안측정결과서"
          blocks={[
            { label: '변경내용', content: <Val>주소 / 대표자 / 상호 / 업무취급자 추가</Val> },
            {
              label: '비고',
              content: (
                <>
                  <Val>
                    국군방첩사령부에서 신청 (<Lnk href="http://www.dcc.mil.kr/">www.dcc.mil.kr</Lnk>
                    {' > 방위산업 > 보안측정신청)'}
                  </Val>
                  <CaveatLine>
                    국군방첩사령부에서 방위사업청 등록담당자에게 직접 결과 송부하므로 제출 생략
                  </CaveatLine>
                </>
              ),
            },
          ]}
        />
        <DocCard
          title="필요 서류 없음"
          blocks={[
            { label: '변경내용', content: <Val>주소 / 전화 · 팩스 / E-mail 등</Val> },
            {
              label: '비고',
              content: (
                <Val>
                  인터넷 조달청(<Lnk href="http://www.g2b.go.kr/">www.g2b.go.kr</Lnk>)에서 정보 변경
                </Val>
              ),
            },
          ]}
        />

        {/* 보안측정안내 연락처 */}
        <p className="text-[17px] font-bold leading-normal text-krds-text-ink">
          보안측정안내 : 국군방첩사령부
        </p>
        <DocCard
          title="국군방첩사령부"
          blocks={[
            {
              label: '지역 / 전화번호',
              content: (
                <>
                  {DCC_CONTACTS.map((c) => (
                    <Val key={c}>{c}</Val>
                  ))}
                </>
              ),
            },
          ]}
        />
      </Section>
    </div>
  )
}
Foreign02Page.displayName = 'Foreign02Page'
