// 업체정보 상세 - '물품(내자)' 탭 콘텐츠 (MUI-CM-01-T02, 설계서 slide122~123 / 문서 P121~122).
// 아코디언(등록품목명세·담당자정보·대표품류및조합/단체) with 테이블 + 제출서류 안내(Infobox).
//   - 등록품목명세(dl_regTrgtItemList)는 목록형 → 항목별 Table 반복.
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyCmdtyInfo)로 대체.
import type { RegTrgtItem, PicInfo, KnditmAsctGrp } from '@/types/cm'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Infobox } from '@/ui/common/composites/Infobox'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// ── 등록품목명세 (dl_regTrgtItemList) — 설계서 slide122/123 예시값 ────────────
const REG_ITEMS: RegTrgtItem[] = [
  {
    itemCd: '1001100001',
    knditmCd: '60',
    knditmCdNm: '총탄',
    itemRgstrtSecdNm: '제조',
    itemCdNm: '이불',
    itemRgstrtRqmtNm: '해당업종 사업자 / 공장 등록',
    itemRvwRsltCn: '적격',
  },
]

// ── 담당자정보 (dm_picInfo) — 설계서 slide122/123 예시값 ─────────────────────
const PIC_INFO: PicInfo = {
  picNm: '김길동',
  picEntlno: '02-1234-5678',
  picFxno: '02-2345-6789',
  picEmlAddr: 'abcde@dapa.go.kr',
}

// ── 대표품류 및 조합/단체 (dm_knditmListAsctGrpList) — 설계서 slide122/123 예시값 ──
const ASCT_GRP_LIST: KnditmAsctGrp[] = [
  {
    knditmCd: '05',
    knditmCdNm: '05 / 피복',
    bzstatCdNm: '제조',
    asctCd: '001',
    asctCdNm: '한국피복공업협동조합',
  },
]

function regItemRows(d: RegTrgtItem): TableRow[] {
  return [
    { label: '품목코드', value: d.itemCd },
    { label: '품류코드/명', value: `${d.knditmCd} / ${d.knditmCdNm}` },
    { label: '구분', value: d.itemRgstrtSecdNm },
    { label: '품명', value: d.itemCdNm },
    { label: '등록요건', value: d.itemRgstrtRqmtNm },
    { label: '품목적부판정', value: d.itemRvwRsltCn },
  ]
}

function picRows(d: PicInfo): TableRow[] {
  return [
    { label: '담당자명', value: d.picNm },
    { label: '전화번호', value: d.picEntlno },
    { label: '팩스번호', value: d.picFxno },
    { label: '이메일주소', value: d.picEmlAddr },
  ]
}

function asctRows(d: KnditmAsctGrp): TableRow[] {
  return [
    { label: '대표품류', value: d.knditmCdNm },
    { label: '업태', value: d.bzstatCdNm },
    { label: '조합/단체', value: d.asctCdNm },
  ]
}

export function BzentyGnrlInfoDtl_Cmdty() {
  return (
    <>
      <Accordion type="multiple" defaultValue={['reg', 'pic', 'asct']} className="w-full">
        <AccordionSection value="pic" title="담당자정보" borderTop={false}>
          <Table rows={picRows(PIC_INFO)} />
        </AccordionSection>

        <AccordionSection value="asct" title="대표품류 및 조합/단체">
          <div className="flex flex-col gap-krds-8">
            {ASCT_GRP_LIST.map((a) => (
              <Table key={a.knditmCd} rows={asctRows(a)} />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection value="reg" title="등록품목명세">
          <div className="flex flex-col gap-krds-8">
            {REG_ITEMS.map((item) => (
              <Table key={item.itemCd} rows={regItemRows(item)} />
            ))}
          </div>
        </AccordionSection>
      </Accordion>

      {/* 물품[내자] 업체 제출서류 안내 (설계서 slide122) — 하단 여백도 좌우(16px)와 동일하게. */}
      <div className="px-4 py-4">
        <Infobox
          title="물품[내자] 업체 제출서류"
          collapsible={false}
          items={[
            '공장등록증명서 - 1부 (관련업체만 제출)',
            '인,허가증사본 - 1부 (해당품목 제출)',
          ]}
        />
      </div>
    </>
  )
}
BzentyGnrlInfoDtl_Cmdty.displayName = 'BzentyGnrlInfoDtl_Cmdty'
