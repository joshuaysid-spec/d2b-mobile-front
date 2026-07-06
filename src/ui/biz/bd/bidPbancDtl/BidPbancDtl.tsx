// 입찰공고 상세 - '일반정보' 탭 (MUI-BD-01-M07, Figma 9300-37570 / 설계서 slide26~28).
// 일반정보 + 지역제한 + 공증·면허제한(업무도움) + 첨부서류 + 문의처 아코디언. 데이터는 목업(추후 bdService.getDetail).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import { FileDownloadList, type FileDownloadItem } from '@/ui/common/composites/FileDownloadList'

// 일반정보 (설계서 slide27 데이터영역) — 필드/값 설계서 기준 목업.
const GENERAL_ROWS: TableRow[] = [
  { label: '공고번호-차수', value: '긴급공고 LDG0097-1' },
  { label: '공고일자', value: '2025-12-22' },
  { label: '게재기관', value: '인터넷' },
  { label: '공고명', value: '특수작전용대물타격무인항공기' },
  { label: '통합참조번호', value: '2025LDG56349' },
  { label: '총수량', value: '1 AY' },
  { label: '집행유형', value: '제조' },
  { label: '판단번호', value: '56349' },
  { label: '발주기관', value: '육군 탄약지원사령부' },
  { label: '입찰형태', value: '전자입찰' },
  { label: '계약방법', value: '제한경쟁' },
  { label: '단가제유형', value: '총액제' },
  { label: '계약종류', value: '일반확정계약' },
  { label: '낙찰자결정방법', value: '적격심사제' },
  { label: '적격심사여부', value: '대상' },
  { label: '예산금액', value: '1,000,000,000 원', type: 'number' },
  { label: '추정가격', value: '909,090,909 원', type: 'number' },
  { label: '입찰참가등록마감일시', value: '2025-12-23 17:00' },
  { label: '입찰서제출마감일시', value: '2025-12-24 10:00' },
  { label: '개찰일시', value: '2025-12-24 10:30' },
  { label: '입찰장소', value: '국방전자조달시스템' },
  { label: '기초예가적용여부', value: '적용' },
  { label: '신기술공고여부', value: '미해당' },
]

// 지역제한 (설계서 slide28)
const REGION_ROWS: TableRow[] = [
  { label: '지역제한', value: '제한없음' },
]

// 공증 및 면허제한 (설계서 slide28) — 그룹/면허
const LICENSE_ROWS: TableRow[] = [
  { label: '공종(업종)명', value: '정보통신공사업' },
  { label: '그룹', value: '1그룹' },
]

// 시공능력평가제한 (설계서 slide28) — 공종(업종)명 + 제한금액
const CNSTR_CPCTY_ROWS: TableRow[] = [
  { label: '공종(업종)명', value: '정보통신공사업' },
  { label: '제한금액', value: '10,000,000,000 원', type: 'number' },
]

// 지명경쟁업체 (설계서 slide28) — 업체코드/업체명/대표자/사업자등록번호/주소/항목번호
const DSGNT_BIDDER_ROWS: TableRow[] = [
  { label: '업체코드', value: '7004F' },
  { label: '업체명', value: '주식회사 국방전자조달' },
  { label: '대표자', value: '홍길동' },
  { label: '사업자등록번호', value: '123-45-67890' },
  { label: '주소', value: '서울특별시 용산구 한강대로 1' },
  { label: '항목번호', value: '1' },
]

// 첨부서류 (설계서 slide28 — 총 N건, 개별 다운로드)
const ATTACH_FILES: FileDownloadItem[] = [
  { id: 'att-1', name: '입찰공고문.hwp', size: '786KB', onDownload: () => console.log('[M07] 다운로드: 입찰공고문') },
  { id: 'att-2', name: '규격서.hwp', size: '1.2MB', onDownload: () => console.log('[M07] 다운로드: 규격서') },
]

// 문의처 (설계서 slide28)
const CONTACT_ROWS: TableRow[] = [
  { label: '기관', value: '방위사업청' },
  { label: '담당자', value: '홍길동 주무관' },
  {
    label: '연락처',
    value: (
      <div className="flex flex-col gap-0.5">
        <span>02-1234-5678</span>
        <span>010-1234-5678</span>
      </div>
    ),
    type: 'combination',
  },
]

export function BidPbancDtl() {
  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={['general', 'region', 'license', 'cnstrCpcty', 'dsgntBidder', 'attach', 'contact']}
        className="w-full"
      >
        <AccordionSection value="general" title="일반정보" borderTop={false}>
          <Table rows={GENERAL_ROWS} />
        </AccordionSection>
        <AccordionSection value="region" title="지역제한">
          <Table rows={REGION_ROWS} />
        </AccordionSection>
        <AccordionSection value="license" title="공증 및 면허제한">
          <Infobox
            title="업무도움"
            items={[
              '최대 16개의 그룹이 나타날 수 있으며, 동일그룹의 면허는 모두 보유해야 하고 여러 그룹인 경우 한 개 이상의 그룹면허를 보유해야 합니다.',
              '면허 제한에 이의가 있으면 하단 문의처로 연락하시기 바랍니다.',
            ]}
          />
          <Table rows={LICENSE_ROWS} />
        </AccordionSection>
        <AccordionSection value="cnstrCpcty" title="시공능력평가제한">
          <Table rows={CNSTR_CPCTY_ROWS} />
        </AccordionSection>
        <AccordionSection value="dsgntBidder" title="지명경쟁업체">
          <Table rows={DSGNT_BIDDER_ROWS} />
        </AccordionSection>
        <AccordionSection value="attach" title={`첨부서류 (총 ${ATTACH_FILES.length}건)`}>
          <FileDownloadList files={ATTACH_FILES} />
        </AccordionSection>
        <AccordionSection value="contact" title="문의처">
          <Table rows={CONTACT_ROWS} />
        </AccordionSection>
      </Accordion>
    </>
  )
}
BidPbancDtl.displayName = 'BidPbancDtl'
