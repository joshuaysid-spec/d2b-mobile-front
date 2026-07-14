// 주요특징 — MUI-CM-05-M02. Figma 10020-85369 / 설계서 00.공통 v0.83 slide343·347.
// 구성: 주요특징(불릿) + 주요업무기능(불릿) + 국방전자조달시스템과 나라장터(설명 + 비교 카드) + 만족도 설문.
// 하단 만족도는 시스템소개와 동일 컴포넌트(SatisfactionSurvey) 재사용.
import { SatisfactionSurvey } from '@/ui/biz/cm/introduce/SatisfactionSurvey'

const FEATURES = [
  "'국가를 당사자로 하는 계약에 관한 법률 시행령' 에 따라 방위사업청장, 국방부장관이 지정·고시한 지정정보처리장치",
  '국방 분야(물품, 용역, 국외, 시설공사 등) 조달업무 전과정을 온라인으로 처리하는 전자조달시스템',
  '이해하기 쉬운 사용자 모의입찰, 시스템 이용 메뉴얼 제공',
  '업무 주요 단계 별 문자메세지(SMS) 알림 서비스',
  '입찰공고, 공지사항 등 주요 정보 알리미 서비스',
  '언제 어디서나 손쉽게 알아보는 국방전자조달 모바일 서비스',
  '콜센터 상담원 안내, 원격지원 서비스를 통한 신속한 고객 지원',
]
const FUNCTIONS = [
  '군수품 조달계획 공개 및 업체 의견 수렴',
  '입찰공고 등록, 입찰참가신청, 입찰서 제출, 등록심사, 개찰 등 전자입찰',
  '공개/비공개 품목에 대한 수의협상',
  '전자계약 체결',
  '전자세금계산서/인지세 발급',
  '검사 및 납품처리, 대금 지급 등 모든 과정을 인터넷으로 처리',
]
const NARA_INTRO =
  '정부 각 부처를 비롯한 공공기관의 전자조달은 조달청에서 운영하고 있는 나라장터(국가종합전자조달시스템, G2B)에서 대표적으로 이루어지고 있으며, 국방 분야의 특수성을 감안하여 국방 분야 조달은 국방전자조달의 시스템(G2B)에서 전담하여 운영되고 있습니다.'

// 비교 카드 — 각 항목별 국방전자조달시스템 / 나라장터 값.
const COMPARE: { title: string; rows: { org: string; values: string[] }[] }[] = [
  {
    title: '운영',
    rows: [
      { org: '국방전자조달시스템', values: ['방위사업청 정보화 데이터담당관'] },
      { org: '나라장터', values: ['조달청 전자조달국'] },
    ],
  },
  {
    title: '이용자',
    rows: [
      { org: '국방전자조달시스템', values: ['조달업체'] },
      { org: '나라장터', values: ['조달업체'] },
    ],
  },
  {
    title: '범위',
    rows: [
      {
        org: '국방전자조달시스템',
        values: ['군수품 및 용역', '방산 및 군용장비, 수리부속류', '피복, 급식, 유류', '부대 시설공사, 국외조달 등'],
      },
      {
        org: '나라장터',
        values: ['일반 상용물품 및 용역', '공공기관 운영 일반물자', '각종 상용품목', '시설공사 등'],
      },
    ],
  },
  {
    title: '관계법령',
    rows: [
      {
        org: '국방전자조달시스템',
        values: ['국가계약법', '방위사업법', '방위사업청 훈령, 예규 등', '국방부 훈령, 예규 등'],
      },
      {
        org: '나라장터',
        values: ['국가계약법, 지방계약법', '조달사업법', '전자조달법', '조달청 훈령, 예규 등'],
      },
    ],
  },
  {
    title: '관련시스템',
    rows: [
      {
        org: '국방전자조달시스템',
        values: ['통합사업관리정보체계', '부대조달정보체계', '국방통합원가시스템', '국방표준종합정보시스템'],
      },
      {
        org: '나라장터',
        values: ['조달행정통합시스템', '종합쇼핑몰', '목록정보시스템', '물품관리시스템'],
      },
    ],
  },
  {
    title: '보안',
    rows: [
      { org: '국방전자조달시스템', values: ['보안프로그램, 관제시스템 등', '정부·군 보안규정 준수'] },
      { org: '나라장터', values: ['보안프로그램, 관제시스템 등', '정부 보안규정 준수'] },
    ],
  },
  {
    title: '로그인',
    rows: [
      { org: '국방전자조달시스템', values: ['간편인증, 인증서'] },
      { org: '나라장터', values: ['간편인증, 인증서'] },
    ],
  },
  {
    title: '접속주소',
    rows: [
      { org: '국방전자조달시스템', values: ['https://www.d2b.go.kr', '(D2B : Defense to Business)'] },
      { org: '나라장터', values: ['http://www.g2b.go.kr', '(G2B : Goverment to Business)'] },
    ],
  },
]

// 불릿 섹션(타이틀 + 항목들).
function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map((t, i) => (
          <li key={i} className="flex gap-1 text-[17px] leading-normal text-krds-text-ink">
            <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-ink" />
            <span className="min-w-px flex-1 wrap-break-word">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 국방전자조달시스템 vs 나라장터 비교 카드.
function CompareCard({ title, rows }: (typeof COMPARE)[number]) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card">
      <span className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</span>
      {rows.map((r, i) => (
        <div key={r.org} className="flex flex-col gap-1">
          {i > 0 && <div className="mb-3 h-px w-full bg-krds-border-divider" />}
          <span className="text-[13px] leading-normal text-krds-text-subtle">{r.org}</span>
          {r.values.map((v, j) => (
            <span key={j} className="text-[17px] leading-normal text-krds-text-muted wrap-break-word">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function FeaturePage() {
  return (
    <div className="flex w-full flex-col">
      <BulletSection title="주요특징" items={FEATURES} />
      <BulletSection title="주요업무기능" items={FUNCTIONS} />

      {/* 국방전자조달시스템과 나라장터 */}
      <div className="flex flex-col gap-1 px-4 py-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
          국방전자조달시스템과 나라장터
        </p>
        <div className="flex gap-1 text-[17px] leading-normal text-krds-text-ink">
          <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-krds-text-ink" />
          <span className="min-w-px flex-1 wrap-break-word">{NARA_INTRO}</span>
        </div>
      </div>

      {/* 비교 카드 */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        {COMPARE.map((c) => (
          <CompareCard key={c.title} title={c.title} rows={c.rows} />
        ))}
      </div>

      {/* 만족도 설문 */}
      <SatisfactionSurvey />
    </div>
  )
}
FeaturePage.displayName = 'FeaturePage'
