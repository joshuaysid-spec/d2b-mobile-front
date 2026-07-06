// 입찰공고 상세 - '공고문안' 탭 (MUI-BD-01-M11, Figma 9300-41549).
// 업무도움(Infobox) + 공고문안 본문(소제목 + 내용 블록 반복). 수의계약 등에서 노출.
// 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'

// 공고문안 본문 — 소제목 + 내용(목업). 실제는 공고문안 전문 표시.
const NOTICE_BLOCKS: { id: string; title: string; body: string }[] = [
  { id: 'b1', title: '1. 입찰에 부치는 사항', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
  { id: 'b2', title: '2. 입찰 참가자격', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
  { id: 'b3', title: '3. 입찰 및 개찰 일시·장소', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
  { id: 'b4', title: '4. 낙찰자 결정방법', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
  { id: 'b5', title: '5. 입찰보증금 및 귀속', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
  { id: 'b6', title: '6. 기타사항', body: '공고문안의 내용을 표시합니다. 공고문안의 내용을 표시합니다.' },
]

export function BidPbancDtl_Tacpg06() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['notice']} className="w-full">
        <AccordionSection value="notice" title="공고문안" borderTop={false}>
          <Infobox
            title="업무도움"
            items={[
              '입찰전 꼭 확인 하시기 바랍니다.',
              '규격자료 중 공개자료와 비공개자료는 열람 방식이 다릅니다. 규격자료 지원 방법을 꼭 확인하시기 바랍니다.',
              '규격서상 각종 성능시험 요건을 입찰 전에 확인 하시기 바랍니다. 성능시험을 수행할 책임은 계약업체에 있습니다.',
              '계약서의 납기와 품질보증형태를 꼭 확인 하시기 바랍니다.',
            ]}
          />
          <div className="flex flex-col gap-krds-6">
            {NOTICE_BLOCKS.map((b) => (
              <div key={b.id} className="flex flex-col gap-krds-3">
                <h3 className="text-krds-body-md font-bold text-krds-text-ink">{b.title}</h3>
                <p className="text-krds-body-md text-krds-text-ink">{b.body}</p>
              </div>
            ))}
          </div>
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl_Tacpg06.displayName = 'BidPbancDtl_Tacpg06'
