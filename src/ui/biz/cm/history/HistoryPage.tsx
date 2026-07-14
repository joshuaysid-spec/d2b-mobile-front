// 연혁 — MUI-CM-05-M03. Figma 10020-85526 / 설계서 00.공통 v0.83 slide348.
// 연대(2015-2019 / 2005-2014 / 1995-2004) 구간 pill + 연도별 타임라인(월. + 항목). 정보 안내 화면(검색·설문 없음).
// 타임라인 네이비 = krds-text-primary-active(#0f316e, --krds-d2b-blue-dark) 토큰.

interface YearEntry {
  year: string
  items: { m: string; t: string }[]
}
interface Period {
  range: string
  years: YearEntry[]
}

const PERIODS: Period[] = [
  {
    range: '2015 - 2019',
    years: [
      { year: '2019', items: [{ m: '03.', t: '방위사업청 협상에 의한 계약 제안서 평가 결과 공개' }] },
      {
        year: '2018',
        items: [
          { m: '12.', t: '인지세 납부방법 개선 (전자수입인지 추가)' },
          { m: '07.', t: '국방전자조달시스템 "2018 국가대표브랜드 대상" 수상' },
          { m: '06.', t: '국방부 납품실적증명서 발급시간 단축 서비스 시행' },
        ],
      },
      {
        year: '2017',
        items: [
          { m: '07.', t: '차세대 국방전자조달시스템 구축' },
          { m: '07.', t: '계약이행 능력 모의심사 서비스 확대 실시' },
          { m: '04.', t: '하도급 대금지급 관리서비스 실시' },
          { m: '03.', t: '국방전자조달시스템 개인정보 영향평가 실시' },
        ],
      },
      {
        year: '2016',
        items: [
          { m: '07.', t: '조달청 나라장터 신용평가정보조회 서비스 개시' },
          { m: '01.', t: '납품실적증명서 서비스 개시 (시설공사)' },
          { m: '01.', t: '사전규격공개 서비스 확대 적용 (국방부)' },
        ],
      },
      {
        year: '2015',
        items: [
          { m: '12.', t: '국방전자조달시스템 고도화사업 추진 (2017년 7월 완료 예정)' },
          { m: '08.', t: '선급 및 착중도금 접수 시스템 기능 개선' },
        ],
      },
    ],
  },
  {
    range: '2005 - 2014',
    years: [
      {
        year: '2014',
        items: [
          { m: '03.', t: '국외전자계약 및 선금/착 중도금 서비스 개시' },
          { m: '01.', t: '조달정보 종합페이지 서비스 개시' },
        ],
      },
      {
        year: '2013',
        items: [
          { m: '10.', t: '국방전자조달시스템 관리규정 제정' },
          { m: '10.', t: '군수품 조달 공공데이터 개발' },
          { m: '09.', t: '정부 3.0 구현을 위한 국방조달 정보 조기 공개' },
          { m: '04.', t: '국방표준종합정보시스템 개통 (구 규격/목록 대체)' },
        ],
      },
      {
        year: '2012',
        items: [
          { m: '09.', t: '국외조달 역경매 서비스 개시' },
          { m: '08.', t: '국방전자조달 모바일 서비스 개시' },
          { m: '06.', t: '영문 홈페이지 디자인 개편' },
          { m: '04.', t: '국방통합원가시스템 개통 (구 원가 대체)' },
          { m: '01.', t: '입찰등록심사 진행절차 개선' },
        ],
      },
      { year: '2011', items: [{ m: '01.', t: '지문인식 전자입찰 전면 시행' }] },
      { year: '2010', items: [{ m: '06.', t: '불법투찰 방지 강화 (전자입찰 IP 중복 차단 등)' }] },
      {
        year: '2009',
        items: [
          { m: '11.', t: '국방전자조달 알리미 서비스 개시' },
          { m: '06.', t: '국방전자조달 디자인 개편' },
          { m: '03.', t: '지정정보처리장치 지정 고시 (방위사업청)' },
        ],
      },
      { year: '2008', items: [{ m: '01.', t: '복식부기/발생주의 회계제도 도입' }] },
      { year: '2007', items: [{ m: '03.', t: '국외조달 전자입찰 도입' }] },
      {
        year: '2006',
        items: [
          { m: '05.', t: '도메인 변경 (www.dpa.mil.kr > www.d2b.go.kr)' },
          { m: '05.', t: '지정정보처리장치 지정 고시 (국방부)' },
          { m: '01.', t: '방위사업청 개청, 국방부로부터 기존 시스템 인수' },
        ],
      },
      { year: '2005', items: [{ m: '06.', t: '납품대금 온라인 서비스 개시' }] },
    ],
  },
  {
    range: '1995 - 2004',
    years: [
      {
        year: '2004',
        items: [
          { m: '01.', t: '도메인 변경 (www.dpa.go.kr > www.dpa.mil.kr)' },
          { m: '12.', t: '국방전자조달체계 확대 구축 (2차)' },
        ],
      },
      {
        year: '2003',
        items: [
          { m: '07.', t: '전자입찰 전군 사단급 부대 확대 시행' },
          { m: '05.', t: '원가 산정 시스템 개통' },
          { m: '03.', t: '국방종합전자조달시스템 개통' },
        ],
      },
      {
        year: '2002',
        items: [
          { m: '12.', t: '지정정보처리장치 지정 고시 (국방부 고시 제 2002-501호)' },
          { m: '12.', t: '국방조달 전자상거래체계 확대 구축' },
        ],
      },
      { year: '2001', items: [{ m: '04.', t: '국방조달 전자상거래체계 개통 (www.dpa.go.kr)' }] },
      { year: '2000', items: [{ m: '12.', t: '조달CALS/EC체계 구축 (정부/기업간 전자거래시범사업)' }] },
      {
        year: '1995',
        items: [{ m: '08.', t: '국가경쟁력강화기획단 조달전자거래 도입 발의 (국방부 조달본부, 조달청)' }],
      },
    ],
  },
]

// 연도 한 개 — 좌측 타임라인 레일(점 + 세로선) + 연도/항목.
function YearRow({ entry, last }: { entry: YearEntry; last: boolean }) {
  return (
    <div className="flex gap-1">
      {/* 레일 — 상단 노드(네이비 링 + 흰 속, Figma Ellipse466 r5/stroke4) + 아래 연결선(마지막 연도는 선 없음) */}
      <div className="flex w-8 shrink-0 flex-col items-center pt-[6px]">
        <span className="size-3.5 shrink-0 rounded-full border-4 border-krds-text-primary-active bg-background" />
        {!last && <span className="mt-1.5 w-px flex-1 bg-krds-text-primary-active" />}
      </div>
      {/* 연도 + 항목 */}
      <div className="flex min-w-px flex-1 flex-col gap-1 py-1">
        <p className="text-[19px] font-bold leading-normal text-krds-text-primary-active">{entry.year}</p>
        {entry.items.map((it, i) => (
          <div key={i} className="flex gap-1 text-[17px] leading-normal text-krds-text-ink">
            <span className="shrink-0">{it.m}</span>
            <span className="min-w-px flex-1 wrap-break-word">{it.t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HistoryPage() {
  return (
    <div className="flex w-full flex-col px-4 py-4">
      <div className="flex flex-col gap-4 rounded-[12px] border border-krds-border-field p-4">
        {PERIODS.map((period, pi) => (
          <div key={period.range} className="flex w-full flex-col gap-4">
            {pi > 0 && <div className="h-px w-full bg-krds-border-field" />}
            {/* 구간 pill */}
            <div className="inline-flex w-fit items-center justify-center rounded-full bg-krds-text-primary-active px-4 py-2">
              <span className="text-[19px] font-bold leading-normal text-white">{period.range}</span>
            </div>
            {/* 연도 타임라인 */}
            <div className="flex flex-col">
              {period.years.map((y, yi) => (
                <YearRow key={y.year} entry={y} last={yi === period.years.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
HistoryPage.displayName = 'HistoryPage'
