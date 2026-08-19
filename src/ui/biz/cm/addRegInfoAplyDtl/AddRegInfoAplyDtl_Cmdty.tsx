// 추가정보 신청내역상세 — 물품(내자) 신청정보 탭 (MUI-CM-01-T05, addRegInfoAplyDtl_Cmdty). 설계서 slide140(문서 P139).
//   웹경로: 메인 홈 > 마이페이지 > 업체정보관리 > 추가정보 신청 목록 > 상세.
//   접수한 신청 데이터를 읽기전용으로 표시(아코디언 + Table). 구성: 일반정보 · 담당자정보 · 대표품류및조합/단체 · 등록품목명세.
//   데이터=목업(설계서 slide140 예시값, 항목명 영문 준수) — 추후 API: cmService.selectAddRegInfoAplyDtl.
import type { RegTrgtItem, PicInfo, KnditmAsctGrp } from '@/types/cm'
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'

// 등록품목명세(dl_regTrgtItemList) — slide140 예시값.
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
// 담당자정보(dm_picInfo) — slide140 예시값.
const PIC_INFO: PicInfo = {
  picNm: '김길동',
  picEntlno: '02-1234-5678',
  picFxno: '02-2345-6789',
  picEmlAddr: 'abcde@dapa.go.kr',
}
// 대표품류 및 조합/단체(dm_knditmListAsctGrpList) — slide140 예시값.
const ASCT_GRP: KnditmAsctGrp = {
  knditmCd: '05',
  knditmCdNm: '05 / 피복',
  bzstatCdNm: '제조',
  asctCd: '001',
  asctCdNm: '한국피복공업협동조합',
}
// 일반정보 — slide140 예시값(본/지사 1-본사, 사업자번호, ISO, 대표자명(영문), 주소(영문)).
const GNRL = {
  bplcSecd: '1-본사',
  brno: '123-45-67890',
  isoYn: '여 / 부',
  rprsvEngNm: 'Hong Gildong',
  addrEng: '102, 11st, jonglo-gu, seoul, korea',
}

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

export function AddRegInfoAplyDtl_Cmdty() {
  return (
    <Accordion type="multiple" defaultValue={['reg', 'pic', 'asct', 'gnrl']} className="w-full">
      <AccordionSection value="gnrl" title="일반정보" borderTop={false}>
        <Table
          rows={[
            { label: '본/지사', value: GNRL.bplcSecd },
            { label: '사업자번호', value: GNRL.brno },
            { label: 'ISO 인증여부', value: GNRL.isoYn },
            { label: '대표자명(영문)', value: GNRL.rprsvEngNm },
            { label: '주소(영문)', value: GNRL.addrEng },
          ]}
        />
      </AccordionSection>

      <AccordionSection value="pic" title="담당자정보">
        <Table
          rows={[
            { label: '담당자명', value: PIC_INFO.picNm },
            { label: '전화번호', value: PIC_INFO.picEntlno },
            { label: '팩스번호', value: PIC_INFO.picFxno },
            { label: '이메일주소', value: PIC_INFO.picEmlAddr },
          ]}
        />
      </AccordionSection>

      <AccordionSection value="asct" title="대표품류 및 조합/단체">
        <Table
          rows={[
            { label: '대표품류', value: ASCT_GRP.knditmCdNm },
            { label: '업태', value: ASCT_GRP.bzstatCdNm },
            { label: '조합/단체', value: ASCT_GRP.asctCdNm },
          ]}
        />
      </AccordionSection>

      <AccordionSection value="reg" title="등록품목명세">
        <div className="flex flex-col gap-krds-8">
          {REG_ITEMS.map((item) => (
            <Table key={item.itemCd} rows={regItemRows(item)} />
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}
AddRegInfoAplyDtl_Cmdty.displayName = 'AddRegInfoAplyDtl_Cmdty'
