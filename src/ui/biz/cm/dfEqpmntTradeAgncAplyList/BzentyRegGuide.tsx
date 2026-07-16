// 업체등록안내 팝업 (군수품무역대리업 신청목록 M15 내 안내) — Figma 10020:83204 1:1.
// m_popup_header(FullPopup) + HelpDisclosure(업무도움, 등록/변경/유효기간 안내) + [등록 신청서 및 첨부서류] 필요서류 안내 + [닫기].
// 컨테이너(FullPopup)는 이 컴포넌트가 소유하고, 열림 상태(open/onOpenChange)만 부모(M15)가 주입. 도메인 전용 조립물.
import { Button } from '@/ui/common/base/Button'
import { FullPopup } from '@/ui/common/composites/FullPopup'
import { HelpDisclosure } from '@/ui/common/composites/HelpDisclosure'

// 업무도움 안내(설계서 slide178 / Figma 83204) — 최초/변경/유효기간 등록 안내.
const HELP_ITEMS = [
  '최초 등록하시는 경우 아래 등록신청서 및 첨부서류를 구비하여 신청하시기 바랍니다. 등록신청서 및 청렴서약서 서식은 국가법령정보센터(www.law.go.kr)에서 방위사업법 시행규칙을 검색하시어 별지 3, 별지 23 서식을 사용하시면 됩니다.',
  '변경 등록 시에는 등록 신청서 상에 변경되는 내용을 적으시고 증명되는 서류를 첨부하시면 됩니다.',
  '최초 등록 후 3년 유효기간이 만료 후에도 군수품무역대리업을 계속 수행하고 싶으시면 유효기간 만료 1개월 전부터 국방전자조달 시스템(www.d2b.go.kr)에 로그인 후 ‘마이페이지’에서 관련 서류를 첨부 후 신청하시기 바랍니다. 등록 유효기간이 완료된 이후에는 신규로 다시 신청하시면 됩니다.',
]

// 필요서류 안내(등록 신청서 및 첨부서류) — 항목(①~④)과 주석(※). Figma 83204 m_list.
type DocLine = { text: string; note?: boolean }
const DOC_LINES: DocLine[] = [
  { text: '① 등록신청서(방위사업법 시행규칙 별지 제23호 서식)' },
  { text: '② 대표자 및 임원의 이력서' },
  {
    text: '※ 임원은 상법 등 관련 법률에 따라 이사 및 감사이며, 해당 인원은 법인등기부 등본 ‘임원에 관련된 사항’에 기재된 모든 인원을 포함합니다. 그러므로 법인등기부 상 임원은 모두 이력서 및 청렴서약서를 제출하셔야 합니다.',
    note: true,
  },
  { text: '③ 전체 직원 수 및 방위사업 관련 직원 수, 성명 등 고용현황' },
  { text: '④ 청렴서약서(방위사업법 시행규칙 별지 제2호 서식)' },
  { text: '※ 청렴서약서는 방위사업법 제6조에 따라 대표 및 임원이 함께 제출하여야 합니다.', note: true },
  {
    text: '※ 이력서와 고용현황은 별도 서식이 없습니다. 일반적으로 이력서는 귀사에서 사용하시는 양식을 사용하시고 고용현황은 4대보험 가입현황을 활용하시면서 방위사업 참여직원만 표시하시면 됩니다.',
    note: true,
  },
]

export interface BzentyRegGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BzentyRegGuide({ open, onOpenChange }: BzentyRegGuideProps) {
  return (
    <FullPopup
      open={open}
      onOpenChange={onOpenChange}
      title="업체등록안내"
      footer={
        <Button variant="primary" className="w-full" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
      }
    >
      <div className="flex flex-col gap-krds-8 pb-6">
        {/* 업무도움 — 등록/변경/유효기간 안내(기본 펼침). */}
        <HelpDisclosure items={HELP_ITEMS} defaultOpen />

        {/* [등록 신청서 및 첨부서류] 필요서류 안내. */}
        <div className="flex flex-col gap-krds-7 px-4">
          <p className="text-[19px] font-bold leading-normal text-krds-text-ink">
            [등록 신청서 및 첨부서류]
          </p>
          <p className="text-[17px] leading-normal text-krds-text-ink">
            필요서류 안내 : 통합검색&gt;군수품무역대리업 신청서
          </p>
          <ul className="flex flex-col gap-krds-5">
            {DOC_LINES.map((line, i) => (
              <li
                key={i}
                className={
                  line.note
                    ? 'text-[15px] leading-relaxed text-krds-text-muted wrap-break-word'
                    : 'text-[17px] leading-normal text-krds-text-ink wrap-break-word'
                }
              >
                {line.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FullPopup>
  )
}
BzentyRegGuide.displayName = 'BzentyRegGuide'
