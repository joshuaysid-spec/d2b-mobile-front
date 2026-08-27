// 업체정보 상세 - '국내소재상사' 탭 콘텐츠 (MUI-CM-01-T04, 설계서 v0.86 slide137~138 / Figma 10020:83043·83098).
// 260827 Figma 리디자인 반영: 섹션 카드(InfoAccordionCard) 4장 + 제출서류 안내(Infobox — 설계서, 유지 확정)
//   + [국외조달원등록증 신청 안내] 풀폭 버튼(→ 국외조달원등록증 신청 목록).
//   법인/개인 구분 값은 카드 타이틀에 표기(Figma '법인/개인 구분 : 개인'), 지점 행은 Figma 구성에 없어 제외.
// ⚠️ 설계서에 T04 데이터영역(항목명 영문) 표가 없다 → 필드명은 화면 표기 기준 잠정 영문키(types/mock/cm.ts DmsAgt* ⚠️).
// 데이터는 목업(설계서 화면 예시값 그대로) — API 연동 시 실제 데이터영역 매핑 확인 필요.
import { useNavigate } from 'react-router-dom'

import type {
  DmsAgtSaleInfo,
  DmsAgtFscCode,
  DmsAgtCorpInfo,
  DmsAgtOvsBzenty,
} from '@/types/mock/cm'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/ui/common/base/Button'
import { Infobox } from '@/ui/common/composites/Infobox'
import {
  InfoAccordionCard,
  type InfoCardRowInput,
} from '@/ui/biz/cm/bzentyInfo/InfoAccordionCard'

// ── 영업정보 — 설계서 slide137 예시값 (⚠️ 잠정 영문키) ────────────────────────
const SALE_INFO: DmsAgtSaleInfo = {
  anlSaleAmt: 300000000,
  astScl: 0,
  lncLmt: 0,
  mnTrnsBankNm: '한국외환은행',
  brnchNm: '계동',
  mlsplyFrstPtcpYmd: '2020-01-01',
  trnsPrdFrom: '2020',
  trnsPrdTo: '2023',
  dunsNo: '123-45-67890',
}

// ── FSC Codes — 설계서 slide137 예시값 (⚠️ 잠정) ──────────────────────────────
const FSC_CODES: DmsAgtFscCode[] = [{ fscCd: '1111', gunGrdNm: '기타 항공기 부수품' }]

// ── 법인/개인 구분 — 설계서 slide137 예시값 (⚠️ 잠정 영문키) ──────────────────
const CORP_INFO: DmsAgtCorpInfo = {
  corpIndvSe: 'corp',
  corpRgstOrgnNm: '방위사업청',
  corpRgstYmd: '2020-01-01',
  corpRgstPrps: '개업',
  bzrnoRgstOrgnNm: '방위사업청',
  hdlItemNm: '무기',
  bzstatNm: '제조',
  scrtMsrUnitNm: '보안부대',
  scrtMsrYmd: '2020-01-01',
  scrtMsrScr: 90,
}

// ── 해외관련 업체정보 — 설계서 slide138 예시값 (⚠️ 잠정) ──────────────────────
const OVS_BZENTY_LIST: DmsAgtOvsBzenty[] = [
  { ovsBzentyCd: '1111', ovsBzentyNm: 'Test Corp', ovsNtnNm: '프랑스', ovsTelno: '+33-1-34-88-30-00' },
]

// 천원 단위 금액 표기 — 천단위 콤마 + ' 천원'.
const won1000 = (v: number) => `${v.toLocaleString()} 천원`

// 법인/개인 구분 카드 — 구분값은 타이틀 표기(Figma), 행에서는 제외.
function corpRows(d: DmsAgtCorpInfo): InfoCardRowInput[] {
  return [
    { label: '법인등기기관', value: d.corpRgstOrgnNm },
    { label: '법인등기일자', value: d.corpRgstYmd },
    { label: '법인등기목적', value: d.corpRgstPrps },
    { label: '사업자등록기관', value: d.bzrnoRgstOrgnNm },
    { label: '취급품목', value: d.hdlItemNm },
    { label: '업태', value: d.bzstatNm },
    { label: '보안측정부대', value: d.scrtMsrUnitNm },
    { label: '보안측정일자', value: d.scrtMsrYmd },
    { label: '보안측정점수', value: String(d.scrtMsrScr) },
  ]
}

function fscRows(list: DmsAgtFscCode[]): InfoCardRowInput[] {
  return list.flatMap((d, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: 'FSC', value: d.fscCd },
    { label: '군급명', value: d.gunGrdNm },
  ])
}

// 영업정보 — 거래기간(F/T) 합침 행(Figma). 지점은 Figma 구성에 없어 제외(설계서 항목 — 실연동 시 확인).
function saleRows(d: DmsAgtSaleInfo): InfoCardRowInput[] {
  return [
    { label: '연간매출액', value: won1000(d.anlSaleAmt) },
    { label: '자산규모', value: won1000(d.astScl) },
    { label: '여신한도', value: won1000(d.lncLmt) },
    { label: '주거래은행', value: d.mnTrnsBankNm },
    { label: '군납최초 참여일', value: d.mlsplyFrstPtcpYmd },
    { label: '거래기간(F / T)', value: `${d.trnsPrdFrom} / ${d.trnsPrdTo}` },
    { label: "Dun's Number", value: d.dunsNo },
  ]
}

function ovsRows(list: DmsAgtOvsBzenty[]): InfoCardRowInput[] {
  return list.flatMap((d, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: '업체코드', value: d.ovsBzentyCd },
    { label: '업체명', value: d.ovsBzentyNm },
    { label: '국적', value: d.ovsNtnNm },
    { label: '전화번호', value: d.ovsTelno },
  ])
}

export function BzentyGnrlInfoDtl_DmsAgt() {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex w-full flex-col gap-krds-8 px-4 py-5">
        <InfoAccordionCard
          title={`법인/개인 구분 : ${CORP_INFO.corpIndvSe === 'corp' ? '법인' : '개인'}`}
          rows={corpRows(CORP_INFO)}
          previewCount={4}
        />
        <InfoAccordionCard
          title="FSC Codes (Federal Supply Classification Codes)"
          rows={fscRows(FSC_CODES)}
        />
        <InfoAccordionCard title="영업정보" rows={saleRows(SALE_INFO)} previewCount={4} />
        <InfoAccordionCard title="해외관련 업체정보" rows={ovsRows(OVS_BZENTY_LIST)} />
      </div>

      {/* 국내소재상사 제출서류 안내 (설계서 slide138 — 유지 확정 260827) */}
      <div className="px-4 pb-4">
        <Infobox title="국내소재상사 제출서류" collapsible={false} items={['보안측정결과서 - 1부']} />
      </div>

      {/* 국외조달원등록증 신청 안내 (Figma 하단 풀폭 primary) → 국외조달원등록증 신청 목록 */}
      <div className="px-4 pb-4">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate(ROUTES.SUPPORT_OVS_SOS_CNFDOC)}
        >
          국외조달원등록증 신청 안내
        </Button>
      </div>
    </>
  )
}
BzentyGnrlInfoDtl_DmsAgt.displayName = 'BzentyGnrlInfoDtl_DmsAgt'
