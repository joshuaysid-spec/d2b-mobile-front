// 이용문의 — MUI-CM-05-M06. Figma 10020-85895 / 설계서 00.공통 v0.83 slide351.
// 구성: 안내(1577-1118) + 번호별 연락처 카드(1/2/3번) + 시스템별 전화 카드(원가/표준).
// 하단 만족도 설문은 모바일 삭제(v0.87 검토 65~67, 기획 확정).
import { Badge } from '@/ui/common/base/Badge'

// 번호별 연락처(분야/담당부서).
const CONTACTS = [
  {
    no: '1번',
    title: '국방전자조달 시스템 관련 문의',
    rows: [
      { label: '분야', value: '전자입찰, 전자계약 등 시스템사용법. 오류문의. 조달원 및 품목등록 문의' },
      { label: '담당부서', value: '정보화데이터담당관 (콜센터)' },
    ],
  },
  {
    no: '2번',
    title: '국방통합원가시스템 및 국방표준종합정보시스템 관련 문의',
    rows: [
      { label: '분야', value: '표준 원가/방산수출입 상담' },
      { label: '담당부서', value: '정보화데이터담당관 (콜센터)' },
    ],
  },
  {
    no: '3번',
    title: '민원 관련 상담',
    rows: [
      { label: '분야', value: '업무문의, 민원 관련 상담' },
      { label: '담당부서', value: '운영지원과 고객지원팀' },
    ],
  },
]

// 시스템별 전화 안내(업무별 전화 + 담당부서).
const TELS = [
  {
    title: '국방통합원가시스템',
    groups: [
      { sub: '원가 업무/제도 문의', values: ['02-2079-6963, 02-2079-6954', '원가관리과'] },
      { sub: 'VPN 등록 문의', values: ['1577-1118 (2번)', '정보화데이터담당관'] },
      { sub: '시스템 관련 문의', values: ['1577-1118 (2번)', '정보화데이터담당관'] },
    ],
  },
  {
    title: '국방표준종합정보시스템',
    groups: [
      { sub: '표준 업무/교육 관련 문의', values: ['02-2079-6596', '표준기획과'] },
      { sub: 'VPN 등록 문의', values: ['1577-1118 (2번)', '정보화데이터담당관'] },
      { sub: '시스템/규격/목록 관련 문의', values: ['1577-1118 (2번)', '정보화데이터담당관'] },
    ],
  },
]

// 번호별 연락처 카드 — 배지 + 제목 + 분야/담당부서 행.
function ContactCard({ contact }: { contact: (typeof CONTACTS)[number] }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card">
      <div className="flex flex-wrap items-center gap-krds-5">
        <Badge type="pastel" color="blue">
          {contact.no}
        </Badge>
      </div>
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
        {contact.title}
      </p>
      <div className="flex flex-col gap-1">
        {contact.rows.map((r) => (
          <div key={r.label} className="flex items-start gap-2">
            <span className="w-[76px] shrink-0 text-[17px] leading-normal text-krds-text-muted">
              {r.label}
            </span>
            <span className="min-w-px flex-1 text-[17px] leading-normal text-krds-text-muted wrap-break-word">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 시스템별 전화 카드 — 제목 + 업무별(소제목 + 값) 그룹, 그룹 사이 구분선.
function TelCard({ tel }: { tel: (typeof TELS)[number] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-krds-border-divider bg-background p-4 shadow-krds-card">
      <span className="text-[19px] font-bold leading-normal text-krds-text-ink">{tel.title}</span>
      {tel.groups.map((g, i) => (
        <div key={g.sub} className="flex flex-col gap-1">
          {i > 0 && <div className="mb-3 h-px w-full bg-krds-border-divider" />}
          <span className="text-[13px] leading-normal text-krds-text-subtle">{g.sub}</span>
          {g.values.map((v, j) => (
            <span key={j} className="text-[17px] leading-normal text-krds-text-muted wrap-break-word">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function InquiryPage() {
  return (
    <div className="flex w-full flex-col">
      {/* 안내 + 대표전화 */}
      <div className="flex flex-col gap-1 px-4 py-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          국방전자조달시스템에 관한 이용문의는 아래의 연락처로 해주시기 바랍니다.
        </p>
        <p className="whitespace-pre-line text-[17px] leading-normal text-krds-text-ink">
          {'(국번없이) 1577-1118 : \n방위사업청 ARS 문의전화'}
        </p>
      </div>

      {/* 번호별 연락처 카드 */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        {CONTACTS.map((c) => (
          <ContactCard key={c.no} contact={c} />
        ))}
      </div>

      {/* 원가/표준 시스템 문의 */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        <p className="text-[19px] font-bold leading-normal text-krds-text-ink wrap-break-word">
          국방통합원가시스템 및 국방표준종합정보시스템에 관한 이용 문의는 아래의 연락처로 해주시기 바랍니다.
        </p>
        {TELS.map((t) => (
          <TelCard key={t.title} tel={t} />
        ))}
      </div>
    </div>
  )
}
InquiryPage.displayName = 'InquiryPage'
