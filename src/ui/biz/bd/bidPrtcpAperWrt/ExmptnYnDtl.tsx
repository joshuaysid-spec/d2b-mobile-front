// 보증금 면제여부 상세 (MUI-BD-04-P09, 설계서 영문ID ExmptnYnDtl).
// 접속: 입찰참가신청서 작성 > 입찰보증금 탭(M08) > 납부방법 '보증금면제' 선택 > 면제사유 옆 [보기].
// ⚠️ 바텀시트 콘텐츠 전용 — 컨테이너(BottomSheet title/footer/open)는 부모(M08 탭)가 소유하고,
//    여기엔 본문만. 조회 전용이라 forwardRef/제출 핸들 없음(P06 과 달리 submit 없음).
// 내용: 「국가를 당사자로 하는 계약에 관한 법률 시행령」 제37조 ③항 입찰보증금 면제사유 1~4호(설계서 그대로).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'

// 면제사유 각 호(설계서 P09) — 호번호 + 설명. 1:1 텍스트 보존.
const EXEMPTION_REASONS: { id: string; no: string; desc: string }[] = [
  {
    id: 'r1',
    no: '제1호',
    desc: '국가기관 및 지방자치단체',
  },
  {
    id: 'r2',
    no: '제2호',
    desc: '「공공기관의 운영에 관한 법률」에 따른 공공기관',
  },
  {
    id: 'r3',
    no: '제3호',
    desc: '정부가 기본재산의 100분의 50 이상을 출연한 법인',
  },
  {
    id: 'r4',
    no: '제4호',
    desc: '「농업협동조합법」에 의한 조합·조합공동사업법인 및 그 중앙회, 「수산업협동조합법」에 의한 어촌계·수산업협동조합 및 그 중앙회, 「산림조합법」에 의한 산림조합 및 그 중앙회, 「중소기업협동조합법」에 의한 중소기업협동조합 및 그 중앙회와 「한국농어촌공사 및 농지관리기금법」에 따른 한국농어촌공사',
  },
]

export function ExmptnYnDtl() {
  return (
    <div className="flex flex-col gap-krds-7">
      <p className="text-[17px] leading-normal text-krds-text-info">
        「국가를 당사자로 하는 계약에 관한 법률 시행령」 제37조 ③항에 따라 아래 각 호에 해당하는 경우
        입찰보증금이 면제됩니다.
      </p>

      <Accordion type="multiple" defaultValue={EXEMPTION_REASONS.map((r) => r.id)}>
        {EXEMPTION_REASONS.map((r, i) => (
          <AccordionSection
            key={r.id}
            value={r.id}
            title={r.no}
            variant="blue"
            borderTop={i !== 0}
            flush
          >
            <p className="text-[17px] leading-normal text-krds-text-ink">{r.desc}</p>
          </AccordionSection>
        ))}
      </Accordion>
    </div>
  )
}
ExmptnYnDtl.displayName = 'ExmptnYnDtl'
