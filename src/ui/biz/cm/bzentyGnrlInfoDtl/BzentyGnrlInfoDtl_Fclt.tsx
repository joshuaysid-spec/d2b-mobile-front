// 업체정보 상세 - '시설' 탭 콘텐츠 (MUI-CM-01-T03, 설계서 v0.86 slide134~136 / Figma 10020:82945·82992).
// 260827 Figma 리디자인 반영: 섹션 카드(InfoAccordionCard) 3장 + 시공능력평가액 안내(Infobox — 설계서, 유지 확정).
//   시설면허정보의 폐업여부는 공종 행 우측 뱃지(Figma), 주력분야는 접힘 시 4행 + 더보기.
//   구 괄호부 2줄 라벨(260826)은 리디자인 라벨 폭 확대(flex-1)로 Figma 그대로 1줄 복귀.
// 데이터는 목업(설계서 데이터영역 항목명·형식 그대로) — 추후 API(cmService.selectBzentyFcltInfo)로 대체.
import type { BzentyFcltInfo, BzentyFcltLcns, BzentyFcltMfrcFld } from '@/types/mock/cm'
import { Badge } from '@/ui/common/base/Badge'
import { Infobox } from '@/ui/common/composites/Infobox'
import {
  InfoAccordionCard,
  type InfoCardRowInput,
} from '@/ui/biz/cm/bzentyInfo/InfoAccordionCard'

// ── 시설정보 (dm_bzentyFcltInfo) — 설계서 slide134/135 예시값 ────────────────
const FCLT_INFO: BzentyFcltInfo = {
  bzstatCdNm: '제조',
  lcofcTelno: '02-1234-5678',
}

// ── 시설면허정보 (dl_bzentyFcltLcnsList) — 설계서 slide134/135 예시값 ─────────
const LCNS_LIST: BzentyFcltLcns[] = [
  {
    cnstpCdNm: '소방공사업',
    cnstpCd: '0001',
    lcnsNo: '1000',
    cnstAbltEvlAmt: '1,000,000 원',
    lcnsAcqsYmd: '1999-12-31',
    lcnsExpryYmd: '2000-01-01',
    bzentyStcd: '폐업', // Figma 예시(폐업 뱃지). 폐업 아닌 업체는 뱃지 미표시.
  },
]

// ── 주력분야 (dl_bzentyFcltMfrcFldList) — 설계서 slide134/135 예시값 ──────────
const MFRC_LIST: BzentyFcltMfrcFld[] = [
  {
    cnstpCdNm: '총탄',
    cnstpCd: '60',
    mfrcFldNm: '이불',
    mfrcFldCd: '001',
    mfrcFldRmvYmd: '-',
    cnstAbltEvlAmt: '1,000,000 원',
    evlAmtCrtrYr: '2025',
    mfrcFldDsgnYmd: '2020-01-01',
    mdfcnDt: '2025-01-01 12:00',
    excptnMttrCd: '적격',
  },
]

// 시설면허정보 — 폐업여부(bzentyStcd)는 공종 행 우측 뱃지('폐업'일 때만, Figma). 다건은 divider.
function lcnsRows(list: BzentyFcltLcns[]): InfoCardRowInput[] {
  return list.flatMap((d, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    {
      label: '공종/[업종코드]',
      value: `${d.cnstpCdNm}/[${d.cnstpCd}]`,
      badge:
        d.bzentyStcd === '폐업' ? (
          <Badge type="pastel" color="blue">
            폐업
          </Badge>
        ) : undefined,
    },
    { label: '면허번호', value: d.lcnsNo },
    { label: '시공능력 공시액', value: d.cnstAbltEvlAmt },
    {
      label: (
        <>
          면허유효기간
          <br />
          (시작일~종료일)
        </>
      ),
      value: (
        <>
          {d.lcnsAcqsYmd}
          <br />~{d.lcnsExpryYmd}
        </>
      ),
    },
  ])
}

function mfrcRows(list: BzentyFcltMfrcFld[]): InfoCardRowInput[] {
  return list.flatMap((d, i): InfoCardRowInput[] => [
    ...(i > 0 ? ['divider' as const] : []),
    { label: '공종명[업종코드]', value: `${d.cnstpCdNm} [${d.cnstpCd}]` },
    { label: '주력분야[코드]', value: `${d.mfrcFldNm} [${d.mfrcFldCd}]` },
    { label: '해제일', value: d.mfrcFldRmvYmd },
    { label: '시공능력 공시액', value: d.cnstAbltEvlAmt },
    { label: '평가액기준년도', value: d.evlAmtCrtrYr },
    { label: '지정일자', value: d.mfrcFldDsgnYmd },
    { label: '갱신일시', value: d.mdfcnDt },
    { label: '입찰제한대상', value: d.excptnMttrCd },
  ])
}

export function BzentyGnrlInfoDtl_Fclt() {
  return (
    <>
      <div className="flex w-full flex-col gap-krds-8 px-4 py-5">
        <InfoAccordionCard
          title="시설정보"
          rows={[
            { label: '대표업태', value: FCLT_INFO.bzstatCdNm },
            { label: '연락처', value: FCLT_INFO.lcofcTelno },
          ]}
        />
        <InfoAccordionCard title="시설면허정보" rows={lcnsRows(LCNS_LIST)} />
        <InfoAccordionCard title="주력분야" rows={mfrcRows(MFRC_LIST)} previewCount={4} />
      </div>

      {/* 시공능력평가액 안내 (설계서 slide134 — 유지 확정 260827) */}
      <div className="px-4 pb-4">
        <Infobox title="안내사항" collapsible={false}>
          시공능력평가액은 해당협회에 등록된 금액과 동일하지 않을 수 있습니다.
        </Infobox>
      </div>
    </>
  )
}
BzentyGnrlInfoDtl_Fclt.displayName = 'BzentyGnrlInfoDtl_Fclt'
