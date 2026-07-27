// 실적증명서 확인(상세) — 신청정보 탭 · 방위사업청(T02, MUI-CM-04-T02). 설계서 00.공통 v0.84
// slide251(화면) · 항목 설명 slide272~273(dm_prfmncPrdocAplyInptInfo 1.3/1.4). 표/필드는 데이터 구동.
//
// 사용목적(usePrpsCd)별 세부정보 노출 규칙(slide251 — API 연동 시 반영, 목업 '기타'=1~7 전부 표시):
//   세무서제출-당해(납품)=납품·정산·납품일자 / 당해(선금)=선금·납품일자 / 당해(착수금)=착수금·납품일자 /
//   당해(중도금)=중도금·납품일자 / 예정(납품금)=납품·정산·납품일자 /
//   보증회사제출-당해·예정(납품금)=납품·정산·보증보험번호·확인요청사항·정산일자 /
//   적격심사제출·입찰참가용=납품·납품일자 / 기타=전부.
//
// ⚠️ 세부정보 표가 '신청금액/발급금액' 쌍(+처리사유)으로 나뉘나 설계서 항목 설명은
//   단일 금액(dm_prfmncPrdocAplyInptInfo)만 정의 → 신청측은 설계서 키 재사용, 발급측/처리사유는
//   임의 확정 키(*IssuAmt·prcsRsnCn — 2026-07-27 사용자 승인). 백엔드 연동 시 실키와 대조만(불일치 시 교체).
import { Accordion, AccordionSection } from '@/ui/common/base/Accordion'
import { Table, type TableRow } from '@/ui/common/composites/Table'
import type { PrfmncPrdocAplyInptInfo } from '@/types/cm'

const won = (v?: number) => (v == null ? '-' : `${v.toLocaleString()} 원`)

// 목업 — slide251 표시값 그대로(사용목적 '기타' → 전부 표시). API 연동 시 조회값으로 교체.
const APLY_INPT: PrfmncPrdocAplyInptInfo = {
  entlno: '02-1234-5678',
  dmndQty: '1',
  submOrgn: '방위사업청',
  usePrpsCd: '기타 - 실적확인용',
  prfmncYr: '2026',
  prfmncIdntyAmt: 1000000, // 납품신청금액
  otstDmndAmt: 1000000, // 착수금신청금액
  prpamtIdntyAmt: 1000000, // 선금신청금액
  mdwyDmndAmt: 1000000, // 중도금신청금액
  clclnAmt: 1000000, // 정산신청금액
  grnteInsrncNo: '1234567890',
  idntyDmndMttr: '없음',
  clclnYmd: '2026-02-02',
}

// 발급금액(신청측 대응 발급값)·처리사유 — 설계서 항목명 미정의 → 임의 확정 키(사용자 승인, 백엔드 연동 시 대조).
const ISSU = {
  prcsRsnCn: '처리사유 표시', // 처리사유
  prfmncIssuAmt: 1000000, // 납품발급금액
  otstIssuAmt: 1000000, // 착수금발급금액
  prpamtIssuAmt: 1000000, // 선금발급금액
  mdwyIssuAmt: 1000000, // 중고금발급금액
  clclnIssuAmt: 1000000, // 정산발급금액
}

const APLY_ROWS: TableRow[] = [
  { label: '사용목적', value: APLY_INPT.usePrpsCd },
  { label: '신청인 연락처', value: APLY_INPT.entlno },
  { label: '제출처', value: APLY_INPT.submOrgn },
  { label: '발급수량', value: `${APLY_INPT.dmndQty}부` },
]

// 세부정보 — 신청금액/발급금액 쌍(사용목적 '기타' 기준 전체 노출)
const DETAIL_ROWS: TableRow[] = [
  { label: '납품/지출년도', value: APLY_INPT.prfmncYr ? `${APLY_INPT.prfmncYr}년` : '-' },
  { label: '처리사유', value: ISSU.prcsRsnCn },
  { label: '납품신청금액', value: won(APLY_INPT.prfmncIdntyAmt), type: 'number' },
  { label: '납품발급금액', value: won(ISSU.prfmncIssuAmt), type: 'number' },
  { label: '착수금신청금액', value: won(APLY_INPT.otstDmndAmt), type: 'number' },
  { label: '착수금발급금액', value: won(ISSU.otstIssuAmt), type: 'number' },
  { label: '선금신청금액', value: won(APLY_INPT.prpamtIdntyAmt), type: 'number' },
  { label: '선금발급금액', value: won(ISSU.prpamtIssuAmt), type: 'number' },
  { label: '중도금신청금액', value: won(APLY_INPT.mdwyDmndAmt), type: 'number' },
  { label: '중도금발급금액', value: won(ISSU.mdwyIssuAmt), type: 'number' },
  { label: '정산신청금액', value: won(APLY_INPT.clclnAmt), type: 'number' },
  { label: '정산발급금액', value: won(ISSU.clclnIssuAmt), type: 'number' },
  { label: '보증보험번호', value: APLY_INPT.grnteInsrncNo ?? '-' },
  { label: '확인요청사항', value: APLY_INPT.idntyDmndMttr ?? '-' },
  { label: '납품일자', value: APLY_INPT.clclnYmd ?? '-' },
]

export function PrfmncPrdocDtl_D2b() {
  return (
    <div className="flex w-full flex-col pb-6">
      <Accordion type="multiple" defaultValue={['aply', 'detail']}>
        <AccordionSection value="aply" title="신청정보" borderTop={false}>
          <Table rows={APLY_ROWS} />
        </AccordionSection>
        <AccordionSection value="detail" title="세부정보">
          <Table rows={DETAIL_ROWS} />
        </AccordionSection>
      </Accordion>
    </div>
  )
}
PrfmncPrdocDtl_D2b.displayName = 'PrfmncPrdocDtl_D2b'
